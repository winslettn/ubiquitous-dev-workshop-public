import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Content, Root } from "mdast";
import { unified } from "unified";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { parse as parseYaml } from "yaml";
import type {
  DeckMetadata,
  SemanticSlide,
  SlideBlock,
  SlideCodeBlock,
  SlideColumn,
  SlideDeck,
  SlideInlineRun,
  SlideImageBlock,
  SlideLayout,
  SlideListBlock,
  SlideListItem,
  SlideMermaidBlock,
  SlideMetadata,
  SlideQuoteBlock,
  SlideTableBlock,
  SlideTextBlock,
  SourceMode
} from "./types.js";

type MdNode = Content & {
  children?: MdNode[];
  depth?: number;
  value?: string;
  lang?: string | null;
  ordered?: boolean;
  url?: string;
  alt?: string | null;
  position?: {
    start?: { line?: number };
    end?: { line?: number };
  };
};

type SplitStrategy = "explicit-slide-headings" | "thematic-breaks" | "h2-headings" | "single-slide";

interface ExtractedDirectives {
  metadata: SlideMetadata;
  notes: string[];
  nodes: MdNode[];
  warnings: string[];
  sourceMode: SourceMode;
}

interface ParsedBlocks {
  blocks: SlideBlock[];
  warnings: string[];
}

interface SplitResult {
  deckTitle?: string;
  strategy: SplitStrategy;
  sections: MdNode[][];
  warnings: string[];
}

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter, ["yaml"]);

export async function parseDeckFromFile(sourcePath: string): Promise<SlideDeck> {
  const markdown = await readFile(sourcePath, "utf8");
  return parseDeck(markdown, sourcePath);
}

export function parseDeck(markdown: string, sourcePath: string): SlideDeck {
  const root = processor.parse(markdown) as Root;
  const children = [...root.children] as MdNode[];
  const metadata = extractDeckMetadata(children);
  const split = splitIntoSlides(metadata.remainingChildren);
  const deckTitle =
    getStringValue(metadata.deckMetadata.title) ??
    split.deckTitle ??
    path.basename(sourcePath, path.extname(sourcePath));

  const slides = split.sections.map((section, index) =>
    parseSlideSection(section, {
      sourcePath,
      slideNumber: index + 1,
      deckTitle,
      deckTemplate: getStringValue(metadata.deckMetadata.template),
      strategy: split.strategy,
      canonical: metadata.sourceMode === "canonical"
    })
  );

  const deckWarnings = [
    ...split.warnings,
    ...slides.flatMap((slide, index) => slide.warnings.map((warning) => `Slide ${index + 1}: ${warning}`))
  ];

  if (metadata.sourceMode === "legacy") {
    deckWarnings.unshift("Deck uses legacy markdown conventions. Prefer HTML comment metadata blocks, `---` slide separators, and ```speaker-notes``` blocks.");
  }

  return {
    sourcePath,
    title: deckTitle,
    metadata: metadata.deckMetadata,
    slides,
    warnings: dedupeWarnings(deckWarnings),
    sourceMode: inferDeckMode(metadata.sourceMode, slides)
  };
}

function inferDeckMode(frontmatterMode: SourceMode, slides: SemanticSlide[]): SlideDeck["sourceMode"] {
  if (slides.length === 0) {
    return frontmatterMode;
  }

  const modes = new Set<SourceMode>(slides.map((slide) => slide.sourceMode));
  modes.add(frontmatterMode);

  if (modes.size === 1) {
    return [...modes][0];
  }

  return "mixed";
}

function extractDeckMetadata(children: MdNode[]): {
  deckMetadata: DeckMetadata;
  remainingChildren: MdNode[];
  sourceMode: SourceMode;
} {
  const firstNode = children[0];

  if (firstNode?.type === "html" && typeof firstNode.value === "string") {
    const body = parseHtmlCommentBody(firstNode.value);
    if (body) {
      const deckMetadata = parseRecord(body);
      if (Object.keys(deckMetadata).length > 0) {
        return {
          deckMetadata,
          remainingChildren: children.slice(1),
          sourceMode: "canonical"
        };
      }
    }
  }

  if (firstNode?.type !== "yaml") {
    return {
      deckMetadata: {},
      remainingChildren: children,
      sourceMode: "legacy"
    };
  }

  const deckMetadata = parseRecord(children[0].value);
  return {
    deckMetadata,
    remainingChildren: children.slice(1),
    sourceMode: "legacy"
  };
}

function splitIntoSlides(children: MdNode[]): SplitResult {
  const warnings: string[] = [];
  let workingChildren = [...children];
  let deckTitle: string | undefined;
  let titleSection: MdNode[] | undefined;

  if (isHeading(workingChildren[0], 1)) {
    titleSection = [workingChildren[0]];
    deckTitle = getNodeText(workingChildren[0]);
    workingChildren = workingChildren.slice(1);

    if (isHeading(workingChildren[0], 2) && getNodeText(workingChildren[0]).toLowerCase() === "slides") {
      workingChildren = workingChildren.slice(1);
    }

    while (workingChildren[0] && !isSlideBoundaryStart(workingChildren[0])) {
      titleSection.push(workingChildren[0]);
      workingChildren = workingChildren.slice(1);
    }
  }

  if (isHeading(workingChildren[0], 2) && getNodeText(workingChildren[0]).toLowerCase() === "slides") {
    workingChildren = workingChildren.slice(1);
  }

  if (hasExplicitSlideHeadings(workingChildren)) {
    warnings.push("Deck uses legacy `### Slide N` headings. Prefer `---` slide separators and `##` slide titles.");
    return prependTitleSection({
      deckTitle,
      strategy: "explicit-slide-headings",
      sections: splitByHeading(workingChildren, (node) => isHeading(node, 3) && /^slide\s+\d+/i.test(getNodeText(node))),
      warnings
    }, titleSection);
  }

  if (workingChildren.some((node) => node.type === "thematicBreak")) {
    return prependTitleSection({
      deckTitle,
      strategy: "thematic-breaks",
      sections: splitByThematicBreak(workingChildren),
      warnings
    }, titleSection);
  }

  if (workingChildren.some((node) => isHeading(node, 2))) {
    warnings.push("Deck uses legacy heading-only slide boundaries. Prefer `---` slide separators for canonical decks.");
    return prependTitleSection({
      deckTitle,
      strategy: "h2-headings",
      sections: splitByHeading(workingChildren, (node) => isHeading(node, 2)),
      warnings
    }, titleSection);
  }

  return prependTitleSection({
    deckTitle,
    strategy: "single-slide",
    sections: workingChildren.length > 0 ? [workingChildren] : [],
    warnings
  }, titleSection);
}

function prependTitleSection(result: SplitResult, titleSection?: MdNode[]): SplitResult {
  if (!titleSection || titleSection.length === 0) {
    return result;
  }

  return {
    ...result,
    sections: [titleSection, ...result.sections]
  };
}

function splitByThematicBreak(children: MdNode[]): MdNode[][] {
  const sections: MdNode[][] = [];
  let current: MdNode[] = [];

  for (const node of children) {
    if (node.type === "thematicBreak") {
      if (current.length > 0) {
        sections.push(current);
      }
      current = [];
      continue;
    }

    current.push(node);
  }

  if (current.length > 0) {
    sections.push(current);
  }

  return sections;
}

function splitByHeading(children: MdNode[], matcher: (node: MdNode) => boolean): MdNode[][] {
  const sections: MdNode[][] = [];
  let current: MdNode[] = [];

  for (const node of children) {
    if (matcher(node)) {
      if (current.length > 0) {
        sections.push(current);
      }
      current = [node];
      continue;
    }

    if (current.length === 0) {
      continue;
    }

    current.push(node);
  }

  if (current.length > 0) {
    sections.push(current);
  }

  return sections;
}

function hasExplicitSlideHeadings(children: MdNode[]): boolean {
  return children.some((node) => isHeading(node, 3) && /^slide\s+\d+/i.test(getNodeText(node)));
}

function isSlideBoundaryStart(node: MdNode | undefined): boolean {
  return (
    node?.type === "thematicBreak" ||
    isHeading(node, 2) ||
    (isHeading(node, 3) && /^slide\s+\d+/i.test(getNodeText(node)))
  );
}

function parseSlideSection(
  section: MdNode[],
  options: {
    sourcePath: string;
    slideNumber: number;
    deckTitle: string;
    deckTemplate?: string;
    strategy: SplitStrategy;
    canonical: boolean;
  }
): SemanticSlide {
  const directives = extractDirectives(section);
  const titleNodeIndex = directives.nodes.findIndex((node) => isHeading(node));
  const titleNode = titleNodeIndex >= 0 ? directives.nodes[titleNodeIndex] : undefined;
  const inferredTitle = titleNode ? normalizeTitle(getNodeText(titleNode)) : undefined;
  const title =
    getStringValue(directives.metadata.title) ??
    inferredTitle ??
    `${options.deckTitle} — Slide ${options.slideNumber}`;

  const contentNodes =
    titleNodeIndex >= 0
      ? directives.nodes.filter((_, index) => index !== titleNodeIndex)
      : directives.nodes;

  const columns = shouldUseColumns(directives.metadata, contentNodes)
    ? extractColumns(contentNodes)
    : undefined;
  const parsedBlocks = columns ? { blocks: [], warnings: [] } : parseBlocks(contentNodes);
  const slideWarnings = [...directives.warnings, ...parsedBlocks.warnings];
  const layout = resolveLayout({
    metadata: directives.metadata,
    title,
    slideNumber: options.slideNumber,
    blocks: parsedBlocks.blocks,
    columns
  });

  return {
    title,
    layout,
    metadata: {
      ...(options.deckTemplate ? { template: options.deckTemplate } : {}),
      ...directives.metadata
    },
    hidden: Boolean(directives.metadata.hidden),
    notes: directives.notes,
    blocks: parsedBlocks.blocks,
    columns,
    warnings: dedupeWarnings(slideWarnings),
    sourceMode:
      options.canonical &&
      options.strategy === "thematic-breaks" &&
      (directives.sourceMode === "canonical" || isHeading(titleNode, 1))
        ? "canonical"
        : "legacy"
  };
}

function extractDirectives(nodes: MdNode[]): ExtractedDirectives {
  const metadata: SlideMetadata = {};
  const notes: string[] = [];
  const filteredNodes: MdNode[] = [];
  const warnings: string[] = [];
  let sourceMode: SourceMode = "legacy";

  for (const node of nodes) {
    if (node.type === "code" && typeof node.lang === "string") {
      const lang = node.lang.toLowerCase();

      if (lang === "slide-meta" || lang === "slide") {
        Object.assign(metadata, parseRecord(node.value));
        warnings.push("Legacy fenced slide metadata detected. Prefer HTML comment metadata blocks.");
        sourceMode = "legacy";
        continue;
      }

      if (lang === "speaker-notes" || lang === "notes") {
        if (node.value?.trim()) {
          notes.push(node.value.trim());
        }
        sourceMode = sourceMode === "legacy" ? "legacy" : "canonical";
        continue;
      }
    }

    if (node.type === "html" && typeof node.value === "string") {
      const comment = parseHtmlComment(node.value);

      if (comment.kind === "notes" && typeof comment.value === "string") {
        notes.push(comment.value);
        warnings.push("Legacy HTML-comment speaker notes detected. Prefer ```speaker-notes``` fenced blocks.");
        sourceMode = "legacy";
        continue;
      }

      if (comment.kind === "slide-meta" && typeof comment.value === "object") {
        Object.assign(metadata, comment.value);
        sourceMode = "canonical";
        continue;
      }
    }

    filteredNodes.push(node);
  }

  return {
    metadata,
    notes,
    nodes: filteredNodes,
    warnings,
    sourceMode
  };
}

function shouldUseColumns(metadata: SlideMetadata, nodes: MdNode[]): boolean {
  if (metadata.layout === "two-column") {
    return true;
  }

  const headingCount = nodes.filter((node) => isHeading(node, 3)).length;
  return headingCount === 2;
}

function extractColumns(nodes: MdNode[]): SlideColumn[] | undefined {
  const sections = splitByHeading(nodes, (node) => isHeading(node, 3));
  if (sections.length !== 2) {
    return undefined;
  }

  return sections.map((section) => {
    const [heading, ...body] = section;
    const parsed = parseBlocks(body);
    return {
      title: normalizeTitle(getNodeText(heading)),
      blocks: parsed.blocks
    };
  });
}

function parseBlocks(nodes: MdNode[]): ParsedBlocks {
  const blocks: SlideBlock[] = [];
  const warnings: string[] = [];
  let lastRenderedEndLine: number | undefined;

  for (const node of nodes) {
    const block = parseBlock(node, warnings);
    if (!block) {
      continue;
    }

    const startLine = getNodeStartLine(node);
    if (lastRenderedEndLine !== undefined && startLine !== undefined) {
      const gapLines = Math.max(0, startLine - lastRenderedEndLine - 1);
      const embeddedBlankLines = Math.max(0, gapLines - 1);
      if (embeddedBlankLines > 0) {
        blocks.push({ kind: "spacer", lines: embeddedBlankLines });
      }
    }

    blocks.push(block);
    const endLine = getNodeEndLine(node) ?? startLine;
    if (endLine !== undefined) {
      lastRenderedEndLine = endLine;
    }
  }

  return { blocks, warnings };
}

function parseBlock(node: MdNode, warnings: string[]): SlideBlock | undefined {
  switch (node.type) {
    case "paragraph": {
      const image = extractImageBlock(node);
      if (image) {
        return image;
      }

      const runs = extractInlineRuns(node);
      const text = runsToText(runs).trim();
      if (text) {
        return { kind: "text", text, runs } satisfies SlideTextBlock;
      }
      return undefined;
    }
    case "heading": {
      const runs = extractInlineRuns(node);
      const text = runsToText(runs).trim();
      if (text) {
        return { kind: "subheading", text, runs } satisfies SlideTextBlock;
      }
      return undefined;
    }
    case "list": {
      return parseListNode(node);
    }
    case "table":
      return extractTable(node);
    case "code": {
      const lang = node.lang?.toLowerCase();
      if (lang === "slide-meta" || lang === "slide" || lang === "speaker-notes" || lang === "notes") {
        return undefined;
      }

      if (lang === "mermaid") {
        return {
          kind: "mermaid",
          source: node.value ?? ""
        } satisfies SlideMermaidBlock;
      }

      return {
        kind: "code",
        language: node.lang ?? undefined,
        code: node.value ?? ""
      } satisfies SlideCodeBlock;
    }
    case "blockquote": {
      const runs = extractInlineRuns(node);
      const text = runsToText(runs).trim();
      if (text) {
        return { kind: "quote", text, runs } satisfies SlideQuoteBlock;
      }
      return undefined;
    }
    case "html": {
      if (!parseHtmlComment(node.value ?? "").kind) {
        warnings.push(`Unsupported raw HTML block was ignored: ${truncate(node.value ?? "", 48)}`);
      }
      return undefined;
    }
    default:
      return undefined;
  }
}

function getNodeStartLine(node: MdNode): number | undefined {
  return node.position?.start?.line;
}

function getNodeEndLine(node: MdNode): number | undefined {
  return node.position?.end?.line;
}

function extractImageBlock(node: MdNode): SlideImageBlock | undefined {
  const children = node.children ?? [];
  if (children.length !== 1 || children[0]?.type !== "image") {
    return undefined;
  }

  return {
    kind: "image",
    src: children[0].url ?? "",
    alt: children[0].alt ?? undefined
  };
}

function extractTable(node: MdNode): SlideTableBlock | undefined {
  const rows = (node.children ?? []).map((row) =>
    (row.children ?? []).map((cell) => extractCellText(cell))
  );

  if (rows.length === 0) {
    return undefined;
  }

  return {
    kind: "table",
    headers: rows[0] ?? [],
    rows: rows.slice(1)
  };
}

// Extracts the text of a single table cell, preserving intra-cell line breaks
// authored as `<br>` (or hard breaks) as newlines. Inline runs are concatenated
// without inserting extra spaces, matching how phrasing content already carries
// its own spacing.
function extractCellText(cell: MdNode): string {
  return collectCellText(cell)
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

function collectCellText(node: MdNode): string {
  switch (node.type) {
    case "text":
    case "inlineCode":
      return node.value ?? "";
    case "break":
      return "\n";
    case "html": {
      const value = (node.value ?? "").trim();
      return /^<br\s*\/?>$/i.test(value) ? "\n" : "";
    }
    case "image":
      return node.alt ?? "";
    default:
      return (node.children ?? []).map((child) => collectCellText(child as MdNode)).join("");
  }
}

function flattenListItems(listNode: MdNode, level: number): SlideListItem[] {
  const items: SlideListItem[] = [];
  const isOrdered = Boolean(listNode.ordered);

  for (const child of listNode.children ?? []) {
    if (child.type !== "listItem") {
      continue;
    }

    items.push(...flattenListItem(child, isOrdered, level));
  }

  return items;
}

function flattenListItem(child: MdNode, isOrdered: boolean, level: number): SlideListItem[] {
  const items: SlideListItem[] = [];
  const listItemChildren = (child.children ?? []) as MdNode[];
  const contentRuns = mergeInlineRuns(
    listItemChildren
      .filter((listChild) => listChild.type !== "list")
      .flatMap((listChild) => extractInlineRuns(listChild))
  );
  const text = runsToText(contentRuns).trim();

  if (text) {
    items.push({
      text,
      runs: contentRuns,
      level,
      ordered: isOrdered
    });
  }

  for (const listChild of listItemChildren) {
    if (listChild.type === "list") {
      items.push(...flattenListItems(listChild as MdNode, level + 1));
    }
  }

  return items;
}

// Builds a list block while preserving blank lines that the author embedded
// between top-level list items (e.g. two bullet groups separated by a blank
// line). Each embedded blank line becomes a non-bulleted blank item so it
// renders as a visible empty line in the same list textbox, keeping ordered
// numbering continuous.
function parseListNode(node: MdNode): SlideListBlock | undefined {
  if (node.type !== "list") {
    return undefined;
  }

  const isOrdered = Boolean(node.ordered);
  const items: SlideListItem[] = [];
  let previousEndLine: number | undefined;

  for (const child of node.children ?? []) {
    if (child.type !== "listItem") {
      continue;
    }

    const itemStartLine = getNodeStartLine(child);
    if (previousEndLine !== undefined && itemStartLine !== undefined && items.length > 0) {
      const blankLines = Math.max(0, itemStartLine - previousEndLine - 1);
      for (let blankIndex = 0; blankIndex < blankLines; blankIndex += 1) {
        items.push({ text: " ", level: 0, ordered: false, bullet: false });
      }
    }

    items.push(...flattenListItem(child, isOrdered, 0));

    const itemEndLine = getNodeEndLine(child);
    if (itemEndLine !== undefined) {
      previousEndLine = itemEndLine;
    }
  }

  if (items.length === 0) {
    return undefined;
  }

  return { kind: "list", items } satisfies SlideListBlock;
}

function resolveLayout(input: {
  metadata: SlideMetadata;
  title: string;
  slideNumber: number;
  blocks: SlideBlock[];
  columns?: SlideColumn[];
}): SlideLayout {
  if (typeof input.metadata.layout === "string") {
    return input.metadata.layout;
  }

  const loweredTitle = input.title.toLowerCase();

  if (input.columns) {
    return "two-column";
  }

  if (loweredTitle.includes("demo placeholder") || loweredTitle.startsWith("demo")) {
    return "demo";
  }

  if (loweredTitle.includes("wrap-up") || loweredTitle.includes("takeaway") || loweredTitle.includes("q&a")) {
    return "wrap-up";
  }

  if (input.slideNumber === 1) {
    return "title";
  }

  if (input.blocks.some((block) => block.kind === "table")) {
    return "table";
  }

  if (input.blocks.length === 1 && input.blocks[0]?.kind === "quote") {
    return "quote";
  }

  if (input.blocks.some((block) => block.kind === "code")) {
    return "code";
  }

  if (input.blocks.some((block) => block.kind === "mermaid")) {
    return "content";
  }

  if (input.blocks.length <= 1) {
    return "section-break";
  }

  return "content";
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
      return applyInlineStyle(extractInlineRunsFromChildren(node.children as MdNode[] | undefined), { italic: true });
    case "strong":
      return applyInlineStyle(extractInlineRunsFromChildren(node.children as MdNode[] | undefined), { bold: true });
    case "delete":
      return applyInlineStyle(extractInlineRunsFromChildren(node.children as MdNode[] | undefined), { strike: true });
    case "link": {
      const runs = extractInlineRunsFromChildren(node.children as MdNode[] | undefined);
      if (runs.length === 0 && node.url) {
        return [{ text: node.url, underline: true, link: node.url }];
      }

      return applyInlineStyle(runs, { underline: true, link: node.url });
    }
    default:
      return extractInlineRunsFromChildren(node.children as MdNode[] | undefined);
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

function runsToText(runs: SlideInlineRun[]): string {
  return runs
    .map((run) => run.text)
    .join("")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

function getNodeText(node?: MdNode): string {
  if (!node) {
    return "";
  }

  switch (node.type) {
    case "text":
    case "inlineCode":
    case "yaml":
    case "html":
    case "code":
      return node.value ?? "";
    case "image":
      return node.alt ?? "";
    case "link": {
      const text = joinTexts((node.children ?? []).map((child) => getNodeText(child)));
      return text || node.url || "";
    }
    default:
      return joinTexts((node.children ?? []).map((child) => getNodeText(child)));
  }
}

function joinTexts(parts: string[]): string {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseHtmlComment(value: string): { kind?: "notes" | "slide-meta"; value: string | SlideMetadata } {
  const body = parseHtmlCommentBody(value);
  if (!body) {
    return { value: "" };
  }

  const notesMatch = body.match(/^(?:speaker\s+notes|notes)\s*:\s*([\s\S]+)$/i);
  if (notesMatch) {
    return { kind: "notes", value: notesMatch[1].trim() };
  }

  const slideMatch = body.match(/^(?:slide|slide-meta)\s*:\s*([\s\S]+)$/i);
  if (slideMatch) {
    return { kind: "slide-meta", value: parseInlineMetadata(slideMatch[1]) };
  }

  const metadata = parseRecord(body);
  if (Object.keys(metadata).length > 0) {
    return { kind: "slide-meta", value: metadata as SlideMetadata };
  }

  return { value: "" };
}

function parseInlineMetadata(value: string): SlideMetadata {
  const metadata: SlideMetadata = {};

  for (const token of value.split(/[,\s]+/).filter(Boolean)) {
    const [key, rawValue] = token.split("=");
    if (!key || !rawValue) {
      continue;
    }

    const normalized = rawValue.replace(/^["']|["']$/g, "");
    metadata[key] =
      normalized.toLowerCase() === "true"
        ? true
        : normalized.toLowerCase() === "false"
          ? false
          : normalized;
  }

  return metadata;
}

function normalizeTitle(text: string): string {
  const explicitMatch = text.match(/^slide\s+\d+\s*[—-]\s*(.+)$/i);
  return explicitMatch ? explicitMatch[1].trim() : text.trim();
}

function parseRecord(value: string | undefined): Record<string, unknown> {
  if (!value?.trim()) {
    return {};
  }

  const parsed = parseYaml(value);
  return isRecord(parsed) ? parsed : {};
}

function parseHtmlCommentBody(value: string): string | undefined {
  const match = value.match(/<!--\s*([\s\S]*?)\s*-->/);
  return match?.[1]?.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isHeading(node: MdNode | undefined, depth?: number): boolean {
  return node?.type === "heading" && (depth === undefined || node.depth === depth);
}

function dedupeWarnings(warnings: string[]): string[] {
  return [...new Set(warnings.filter(Boolean))];
}

function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}
