import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { Content, Root } from "mdast";
import JSZip from "jszip";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { parseDeckFromFile } from "./markdown.js";
import { defaultTemplate } from "./default-template.js";
import { caipTemplate } from "./caip-template.js";
import type {
  GeneratedDeck,
  PresentationTemplate,
  PptxPresentation,
  SemanticSlide,
  SlideBlock,
  SlideColumn,
  SlideDeck,
  SlideInlineRun,
  SlideLayout
} from "./types.js";

type MdNode = Content & {
  children?: MdNode[];
  value?: string;
  ordered?: boolean;
  url?: string;
};

interface NotesParagraph {
  level?: number;
  ordered?: boolean;
  orderIndex?: number;
  runs: SlideInlineRun[];
}

const notesProcessor = unified().use(remarkParse).use(remarkGfm);

export async function generateFromInput(options: {
  inputPath: string;
  outputPath?: string;
  templateId?: string;
}): Promise<GeneratedDeck[]> {
  const input = await resolveMarkdownInput(options.inputPath);

  if (input.kind === "multiple") {
    const outputDirectory = resolveBatchOutputDirectory(input.defaultOutputDirectory, options.outputPath);

    await mkdir(outputDirectory, { recursive: true });

    const generatedDecks: GeneratedDeck[] = [];
    for (const markdownFile of input.markdownFiles) {
      const outputPath = path.join(outputDirectory, `${path.basename(markdownFile, ".md")}.pptx`);
      generatedDecks.push(await generateDeckFile(markdownFile, outputPath, options.templateId));
    }

    return generatedDecks;
  }

  const outputPath = resolveFileOutputPath(input.markdownFile, options.outputPath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  return [await generateDeckFile(input.markdownFile, outputPath, options.templateId)];
}

export async function lintInput(inputPath: string): Promise<SlideDeck[]> {
  const input = await resolveMarkdownInput(inputPath);

  if (input.kind === "multiple") {
    return Promise.all(input.markdownFiles.map((fileName) => parseDeckFromFile(fileName)));
  }

  return [await parseDeckFromFile(input.markdownFile)];
}

async function generateDeckFile(
  inputPath: string,
  outputPath: string,
  requestedTemplateId?: string
): Promise<GeneratedDeck> {
  const deck = await parseDeckFromFile(inputPath);
  const deckTemplateId = typeof deck.metadata.template === "string" ? deck.metadata.template.trim() : undefined;
  const template = getTemplate(requestedTemplateId ?? deckTemplateId);
  const PptxModule = await import("pptxgenjs");
  const PptxConstructor = PptxModule.default as unknown as new () => PptxPresentation;
  const pptx = new PptxConstructor();
  template.configurePresentation(pptx, deck);

  for (const slideModel of deck.slides) {
    const slide = pptx.addSlide();
    template.renderSlide(pptx, slide, deck, slideModel);
  }

  await pptx.writeFile({ fileName: outputPath });
  await postProcessGeneratedDeck(outputPath, deck);
  return { deck, outputPath };
}

async function materializeMermaidVisuals(
  deck: SlideDeck,
  _sourcePath: string
): Promise<{ deck: SlideDeck; cleanupPaths: string[] }> {
  const hasMermaid = deck.slides.some((slide) => containsMermaid(slide.blocks) || containsMermaidInColumns(slide.columns));
  if (!hasMermaid) {
    return { deck, cleanupPaths: [] };
  }

  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-mermaid-"));
  const renderedMermaidCache = new Map<string, string>();
  const cleanupPaths = [tempRoot];

  const slides = await Promise.all(
    deck.slides.map(async (slide) => {
      const blocks = await replaceMermaidBlocks(slide.blocks, tempRoot, renderedMermaidCache);
      const columns = slide.columns
        ? await Promise.all(
            slide.columns.map(async (column) => ({
              ...column,
              blocks: await replaceMermaidBlocks(column.blocks, tempRoot, renderedMermaidCache)
            }))
          )
        : undefined;

      const adjustedLayout = adjustLayoutForMermaid(slide.layout, blocks, columns);

      return {
        ...slide,
        blocks,
        columns,
        layout: adjustedLayout
      };
    })
  );

  return {
    deck: {
      ...deck,
      slides
    },
    cleanupPaths
  };
}

function containsMermaid(blocks: SlideBlock[]): boolean {
  return blocks.some((block) => block.kind === "mermaid");
}

function containsMermaidInColumns(columns?: SlideColumn[]): boolean {
  return (columns ?? []).some((column) => containsMermaid(column.blocks));
}

async function replaceMermaidBlocks(
  blocks: SlideBlock[],
  tempRoot: string,
  renderedMermaidCache: Map<string, string>
): Promise<SlideBlock[]> {
  const replaced: SlideBlock[] = [];

  for (const block of blocks) {
    if (block.kind !== "mermaid") {
      replaced.push(block);
      continue;
    }

    const source = block.source.trim();
    if (!source) {
      continue;
    }

    const existing = renderedMermaidCache.get(source);
    const diagramPath = existing ?? await renderMermaidToSvg(source, tempRoot);
    renderedMermaidCache.set(source, diagramPath);
    replaced.push({
      kind: "image",
      src: diagramPath,
      alt: "Mermaid diagram"
    });
  }

  return replaced;
}

function adjustLayoutForMermaid(layout: SlideLayout, blocks: SlideBlock[], columns?: SlideColumn[]): SlideLayout {
  if (layout !== "code") {
    return layout;
  }

  const hasCode = blocks.some((block) => block.kind === "code") || (columns ?? []).some((column) => column.blocks.some((block) => block.kind === "code"));
  return hasCode ? layout : "content";
}

async function renderMermaidToSvg(source: string, tempRoot: string): Promise<string> {
  const hash = hashString(source);
  const inputFile = path.join(tempRoot, `${hash}.mmd`);
  const outputFile = path.join(tempRoot, `${hash}.svg`);

  await writeFile(inputFile, source, "utf8");

  try {
    const mermaidCli = await import("@mermaid-js/mermaid-cli");
    await mermaidCli.run(inputFile, outputFile as `${string}.svg`, {
      quiet: true,
      outputFormat: "svg",
      puppeteerConfig: {
        protocolTimeout: 120000,
        args: ["--no-sandbox", "--disable-dev-shm-usage"]
      },
      parseMMDOptions: {
        backgroundColor: "transparent",
        mermaidConfig: {
          theme: "base",
          themeVariables: {
            background: "#000000",
            primaryColor: "#161B22",
            primaryBorderColor: "#0EBE3D",
            primaryTextColor: "#FFFFFF",
            secondaryColor: "#0D1117",
            secondaryBorderColor: "#30363D",
            secondaryTextColor: "#FFFFFF",
            tertiaryColor: "#09241A",
            tertiaryBorderColor: "#30363D",
            tertiaryTextColor: "#FFFFFF",
            lineColor: "#B0BAC3",
            textColor: "#FFFFFF",
            mainBkg: "#161B22",
            nodeBorder: "#0EBE3D",
            clusterBkg: "#0D1117",
            clusterBorder: "#30363D",
            defaultLinkColor: "#B0BAC3",
            edgeLabelBackground: "#0D1117",
            titleColor: "#FFFFFF"
          }
        }
      }
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to render Mermaid diagram via mmdc: ${details}`);
  }

  return outputFile;
}

function hashString(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16);
}

async function cleanupMermaidArtifacts(paths: string[]): Promise<void> {
  for (const targetPath of paths) {
    await rm(targetPath, { recursive: true, force: true });
  }
}

async function postProcessGeneratedDeck(outputPath: string, deck: SlideDeck): Promise<void> {
  const hasNotes = deck.slides.some((slide) => slide.notes.length > 0);
  const hasTitles = deck.slides.some((slide) => slide.title.trim().length > 0);
  if (!hasNotes && !hasTitles) {
    return;
  }

  const buffer = await readFile(outputPath);
  const zip = await JSZip.loadAsync(buffer);

  for (let index = 0; index < deck.slides.length; index += 1) {
    const slide = deck.slides[index];
    if (!slide) {
      continue;
    }

    if (hasTitles && slide.title.trim()) {
      const slidePath = `ppt/slides/slide${index + 1}.xml`;
      const slideFile = zip.file(slidePath);
      if (slideFile) {
        const slideXml = await slideFile.async("string");
        const updatedSlideXml = injectTitlePlaceholder(slideXml, slide.title);
        if (updatedSlideXml !== slideXml) {
          zip.file(slidePath, updatedSlideXml);
        }
      }
    }

    const noteMarkdown = slide.notes.join("\n\n").trim();
    if (hasNotes && noteMarkdown) {
      const notesPath = `ppt/notesSlides/notesSlide${index + 1}.xml`;
      const notesFile = zip.file(notesPath);
      if (!notesFile) {
        continue;
      }

      const xml = await notesFile.async("string");
      const notesBodyXml = buildNotesBodyXml(noteMarkdown);
      const updatedXml = replaceNotesBody(xml, notesBodyXml);
      if (updatedXml !== xml) {
        zip.file(notesPath, updatedXml);
      }
    }
  }

  const updatedBuffer = await zip.generateAsync({ type: "nodebuffer" });
  await writeFile(outputPath, updatedBuffer);
}

function buildNotesBodyXml(markdown: string): string {
  const root = notesProcessor.parse(markdown) as Root;
  const paragraphs = extractNotesParagraphs(root.children as MdNode[]);
  if (paragraphs.length === 0) {
    return `<a:p><a:endParaRPr lang="en-US" dirty="0"/></a:p>`;
  }

  return paragraphs.map((paragraph) => notesParagraphToXml(paragraph)).join("");
}

function replaceNotesBody(xml: string, notesBodyXml: string): string {
  return xml.replace(
    /(<p:ph type="body" idx="1"\/><\/p:nvPr><\/p:nvSpPr><p:spPr\/><p:txBody><a:bodyPr\/><a:lstStyle\/>)([\s\S]*?)(<\/p:txBody><\/p:sp><p:sp>)/,
    `$1${notesBodyXml}$3`
  );
}

function injectTitlePlaceholder(xml: string, title: string): string {
  if (xml.includes('<p:ph type="title"')) {
    return xml;
  }

  const escapedTitle = escapeRegExp(escapeXmlText(title));
  const titleShapePattern = new RegExp(
    `(<p:sp><p:nvSpPr><p:cNvPr[\\s\\S]*?<\\/p:cNvPr><p:cNvSpPr\\/><p:nvPr>)(<\\/p:nvPr><\\/p:nvSpPr>[\\s\\S]*?<a:t>${escapedTitle}<\\/a:t>[\\s\\S]*?<\\/p:sp>)`
  );

  return xml.replace(titleShapePattern, '$1<p:ph type="title"/>$2');
}

function escapeXmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractNotesParagraphs(nodes: MdNode[]): NotesParagraph[] {
  const paragraphs: NotesParagraph[] = [];

  for (const node of nodes) {
    switch (node.type) {
      case "paragraph": {
        const runs = extractInlineRuns(node);
        if (runs.length > 0) {
          paragraphs.push({ runs });
        }
        break;
      }
      case "heading": {
        const runs = applyInlineStyle(extractInlineRuns(node), { bold: true });
        if (runs.length > 0) {
          paragraphs.push({ runs });
        }
        break;
      }
      case "list":
        paragraphs.push(...extractListParagraphs(node, 0));
        break;
      case "code": {
        const code = node.value?.trim();
        if (code) {
          paragraphs.push({
            runs: [{ text: code, code: true }]
          });
        }
        break;
      }
      case "blockquote": {
        const runs = applyInlineStyle(extractInlineRuns(node), { italic: true });
        if (runs.length > 0) {
          paragraphs.push({ runs });
        }
        break;
      }
      default:
        break;
    }
  }

  return paragraphs;
}

function extractListParagraphs(listNode: MdNode, level: number): NotesParagraph[] {
  const paragraphs: NotesParagraph[] = [];
  const ordered = Boolean(listNode.ordered);
  let orderIndex = 0;

  for (const child of listNode.children ?? []) {
    if (child.type !== "listItem") {
      continue;
    }

    orderIndex += 1;
    const itemChildren = (child.children ?? []) as MdNode[];
    const contentRuns = mergeInlineRuns(
      itemChildren
        .filter((listChild) => listChild.type !== "list")
        .flatMap((listChild) => extractInlineRuns(listChild as MdNode))
    );

    if (contentRuns.length > 0) {
      paragraphs.push({
        level,
        ordered,
        orderIndex,
        runs: contentRuns
      });
    }

    for (const listChild of itemChildren) {
      if (listChild.type === "list") {
        paragraphs.push(...extractListParagraphs(listChild as MdNode, level + 1));
      }
    }
  }

  return paragraphs;
}

function notesParagraphToXml(paragraph: NotesParagraph): string {
  const pPr = paragraph.level !== undefined
    ? `<a:pPr lvl="${paragraph.level}">${paragraph.ordered ? `<a:buAutoNum type="arabicPeriod" startAt="${paragraph.orderIndex ?? 1}"/>` : `<a:buChar char="•"/>`}</a:pPr>`
    : "";
  const runsXml = paragraph.runs.length > 0
    ? paragraph.runs.map((run) => noteRunToXml(run)).join("")
    : `<a:r><a:rPr lang="en-US" dirty="0"/><a:t></a:t></a:r>`;

  return `<a:p>${pPr}${runsXml}<a:endParaRPr lang="en-US" dirty="0"/></a:p>`;
}

function noteRunToXml(run: SlideInlineRun): string {
  const attrs = [
    `lang="en-US"`,
    `dirty="0"`,
    run.bold ? `b="1"` : "",
    run.italic ? `i="1"` : "",
    run.strike ? `strike="sngStrike"` : "",
    run.underline || run.link ? `u="sng"` : ""
  ].filter(Boolean).join(" ");
  const typeface = run.code
    ? `<a:latin typeface="Consolas"/><a:ea typeface="Consolas"/><a:cs typeface="Consolas"/>`
    : "";
  const escapedText = escapeXml(run.text);
  const preserveSpace = /^\s|\s$/.test(run.text) ? ` xml:space="preserve"` : "";
  return `<a:r><a:rPr ${attrs}>${typeface}</a:rPr><a:t${preserveSpace}>${escapedText}</a:t></a:r>`;
}

function extractInlineRuns(node?: MdNode): SlideInlineRun[] {
  if (!node) {
    return [];
  }

  switch (node.type) {
    case "text":
      return node.value ? [{ text: node.value }] : [];
    case "inlineCode":
      return node.value ? [{ text: node.value, code: true }] : [];
    case "break":
      return [{ text: "\n" }];
    case "emphasis":
      return applyInlineStyle(extractInlineRunsFromChildren(node.children), { italic: true });
    case "strong":
      return applyInlineStyle(extractInlineRunsFromChildren(node.children), { bold: true });
    case "delete":
      return applyInlineStyle(extractInlineRunsFromChildren(node.children), { strike: true });
    case "link": {
      const runs = extractInlineRunsFromChildren(node.children);
      if (runs.length === 0 && node.url) {
        return [{ text: node.url, underline: true, link: node.url }];
      }

      return applyInlineStyle(runs, { underline: true, link: node.url });
    }
    default:
      return extractInlineRunsFromChildren(node.children);
  }
}

function extractInlineRunsFromChildren(children?: MdNode[]): SlideInlineRun[] {
  return mergeInlineRuns((children ?? []).flatMap((child) => extractInlineRuns(child)));
}

function applyInlineStyle(
  runs: SlideInlineRun[],
  style: Partial<Pick<SlideInlineRun, "bold" | "italic" | "underline" | "strike" | "link">>
): SlideInlineRun[] {
  return runs.map((run) => ({
    ...run,
    ...style
  }));
}

function mergeInlineRuns(runs: SlideInlineRun[]): SlideInlineRun[] {
  const merged: SlideInlineRun[] = [];

  for (const run of runs) {
    if (!run.text) {
      continue;
    }

    const previous = merged[merged.length - 1];
    if (previous && haveSameInlineStyle(previous, run)) {
      previous.text += run.text;
      continue;
    }

    merged.push({ ...run });
  }

  return merged;
}

function haveSameInlineStyle(a: SlideInlineRun, b: SlideInlineRun): boolean {
  return (
    Boolean(a.bold) === Boolean(b.bold) &&
    Boolean(a.italic) === Boolean(b.italic) &&
    Boolean(a.underline) === Boolean(b.underline) &&
    Boolean(a.strike) === Boolean(b.strike) &&
    Boolean(a.code) === Boolean(b.code) &&
    (a.link ?? "") === (b.link ?? "")
  );
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function resolveFileOutputPath(inputPath: string, outputPath?: string): string {
  if (!outputPath) {
    return path.join(path.dirname(inputPath), "generated", `${path.basename(inputPath, ".md")}.pptx`);
  }

  const resolved = path.resolve(outputPath);
  return resolved.toLowerCase().endsWith(".pptx")
    ? resolved
    : path.join(resolved, `${path.basename(inputPath, ".md")}.pptx`);
}

type ResolvedMarkdownInput =
  | { kind: "single"; markdownFile: string }
  | { kind: "multiple"; markdownFiles: string[]; defaultOutputDirectory: string };

async function resolveMarkdownInput(inputPath: string): Promise<ResolvedMarkdownInput> {
  const resolvedInput = path.resolve(inputPath);

  if (hasWildcard(inputPath)) {
    const markdownFiles = await resolveWildcardMarkdownFiles(resolvedInput);
    if (markdownFiles.length === 0) {
      throw new Error(`No markdown files matched input pattern "${inputPath}".`);
    }

    if (markdownFiles.length === 1) {
      return { kind: "single", markdownFile: markdownFiles[0] };
    }

    return {
      kind: "multiple",
      markdownFiles,
      defaultOutputDirectory: path.join(resolveWildcardBaseDirectory(resolvedInput), "generated")
    };
  }

  const stats = await stat(resolvedInput);
  if (stats.isDirectory()) {
    const markdownFiles = (await readdir(resolvedInput))
      .filter((fileName) => fileName.toLowerCase().endsWith(".md"))
      .sort()
      .map((fileName) => path.join(resolvedInput, fileName));

    return {
      kind: "multiple",
      markdownFiles,
      defaultOutputDirectory: path.join(resolvedInput, "generated")
    };
  }

  return { kind: "single", markdownFile: resolvedInput };
}

function hasWildcard(value: string): boolean {
  return /[*?]/.test(value);
}

async function resolveWildcardMarkdownFiles(resolvedPattern: string): Promise<string[]> {
  const { root } = path.parse(resolvedPattern);
  const relativePattern = resolvedPattern.slice(root.length);
  const patternSegments = relativePattern.split(path.sep).filter(Boolean);
  const matches = await collectWildcardMatches(root, patternSegments, 0);

  return matches.filter((filePath) => filePath.toLowerCase().endsWith(".md")).sort();
}

async function collectWildcardMatches(
  currentPath: string,
  patternSegments: string[],
  segmentIndex: number
): Promise<string[]> {
  if (segmentIndex >= patternSegments.length) {
    const currentStats = await stat(currentPath);
    return currentStats.isFile() ? [currentPath] : [];
  }

  const segment = patternSegments[segmentIndex];
  if (!hasWildcard(segment)) {
    return collectWildcardMatches(path.join(currentPath, segment), patternSegments, segmentIndex + 1);
  }

  const entries = await readdir(currentPath, { withFileTypes: true });
  const matcher = createWildcardMatcher(segment);
  const isLastSegment = segmentIndex === patternSegments.length - 1;
  const matchingEntries = entries.filter(
    (entry) => matcher.test(entry.name) && (isLastSegment ? entry.isFile() : entry.isDirectory())
  );

  const nestedMatches = await Promise.all(
    matchingEntries.map((entry) =>
      collectWildcardMatches(path.join(currentPath, entry.name), patternSegments, segmentIndex + 1)
    )
  );

  return nestedMatches.flat();
}

function createWildcardMatcher(segment: string): RegExp {
  const escaped = segment.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const pattern = escaped.replace(/\*/g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${pattern}$`, "i");
}

function resolveWildcardBaseDirectory(resolvedPattern: string): string {
  const { root } = path.parse(resolvedPattern);
  const relativePattern = resolvedPattern.slice(root.length);
  const patternSegments = relativePattern.split(path.sep).filter(Boolean);
  const staticSegments = patternSegments.slice(0, patternSegments.findIndex(hasWildcard));
  return staticSegments.length > 0 ? path.join(root, ...staticSegments) : root;
}

function resolveBatchOutputDirectory(defaultOutputDirectory: string, outputPath?: string): string {
  if (!outputPath) {
    return defaultOutputDirectory;
  }

  const resolvedOutput = path.resolve(outputPath);
  if (resolvedOutput.toLowerCase().endsWith(".pptx")) {
    throw new Error("A .pptx output path can only be used with a single markdown input file.");
  }

  return resolvedOutput;
}

function getTemplate(templateId?: string): PresentationTemplate {
  if (!templateId || templateId === "default") {
    return defaultTemplate;
  }

  if (templateId === "caip") {
    return caipTemplate;
  }

  throw new Error(`Unknown template "${templateId}". Available templates: "default", "caip".`);
}
