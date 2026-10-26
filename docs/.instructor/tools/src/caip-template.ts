import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderNativeMermaidFlowchart } from "./mermaid-native.js";
import type {
  PresentationTemplate,
  PptxTextRun,
  PptxSlide,
  SemanticSlide,
  SlideBlock,
  SlideCodeBlock,
  SlideColumn,
  SlideDeck,
  SlideInlineRun,
  SlideImageBlock,
  SlideListBlock,
  SlideTableBlock,
  SlideTextBlock
} from "./types.js";

// pptxgenjs escapes title/subject/author when it writes docProps/core.xml, but it
// inserts `company` into docProps/app.xml verbatim (no XML escaping). Any raw &, <
// or > in the company name therefore corrupts the package and forces PowerPoint to
// run its repair prompt, so we pre-escape the value here.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Theme reverse-engineered from caip_template.pptx
// (theme name: "CAIP 2025 (Light)" / "Microsoft CSA_Light Template").
// Colors come from the deck's clrScheme + custom color list, fonts from its fontScheme.
const theme = {
  background: "FFF8F3", // warm white (lt2 / bg2)
  canvas: "FFFFFF",
  ink: "000000", // dk1
  muted: "505050", // Dark Gray
  border: "D7D2CB", // Mid Gray
  accent: "0078D4", // Blue (accent1)
  accentSoft: "8DC8E8", // Light Blue (accent2)
  teal: "008575", // Teal
  tealSoft: "B9DCD2", // Light Teal
  sectionBackground: "B9DCD2", // Light Teal hero band
  sectionInk: "091F2C", // Blue Black
  titleBand: "091F2C", // Blue Black
  titleBandText: "FFFFFF",
  warning: "FF5C39", // Orange
  warningSoft: "FFE3D6", // soft orange wash
  quote: "C5B4E3" // Light Purple
};

const fonts = {
  heading: "Segoe Sans Display Semibold",
  body: "Segoe Sans Display",
  mono: "Consolas"
};

const shapes = {
  rect: "rect",
  roundRect: "roundRect"
} as const;

const fontSizes = {
  chromeTitle: 28,
  subheading: 21,
  body: 19,
  references: 11
} as const;

const assetDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "caip-template");
const logoPath = path.join(assetDirectory, "caip-logo.png");
const iconPath = path.join(assetDirectory, "caip-icon.png");

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const caipTemplate: PresentationTemplate = {
  id: "caip",
  configurePresentation(pptx, deck) {
    pptx.layout = "LAYOUT_WIDE";
    pptx.author = "GitHub Copilot CLI";
    pptx.company = escapeXml("Cloud & AI Platforms");
    pptx.subject = deck.title;
    pptx.title = deck.title;
    pptx.lang = "en-US";
  },
  renderSlide(pptx, slide, deck, semanticSlide) {
    slide.background = { color: resolveBackground(semanticSlide) };
    slide.hidden = semanticSlide.hidden;

    switch (semanticSlide.layout) {
      case "title":
        renderTitleSlide(slide, deck, semanticSlide);
        break;
      case "section":
        renderSectionSlide(slide, deck, semanticSlide);
        break;
      case "two-column":
        renderTwoColumnSlide(slide, deck, semanticSlide);
        break;
      case "table":
        renderTableSlide(slide, deck, semanticSlide);
        break;
      case "demo":
        renderDemoSlide(slide, deck, semanticSlide);
        break;
      case "section-break":
        renderSectionBreak(slide, deck, semanticSlide);
        break;
      case "wrap-up":
        renderWrapUpSlide(slide, deck, semanticSlide);
        break;
      case "quote":
        renderQuoteSlide(slide, deck, semanticSlide);
        break;
      case "code":
        renderCodeSlide(slide, deck, semanticSlide);
        break;
      case "content":
      default:
        renderContentSlide(slide, deck, semanticSlide);
        break;
    }

    if (semanticSlide.notes.length > 0) {
      slide.addNotes(semanticSlide.notes.join("\n\n"));
    }
  }
};

function renderTitleSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  const accent = resolveAccent(semanticSlide);

  slide.addShape(shapes.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 7.5,
    line: { color: theme.background },
    fill: { color: theme.background }
  });

  // Accent bar evoking the CAIP brand stripe.
  slide.addShape(shapes.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.22,
    line: { color: accent },
    fill: { color: accent }
  });

  placeLogo(slide, { x: 0.9, y: 0.95, w: 4.6, h: 0.92 });

  slide.addText(semanticSlide.title, {
    x: 0.9,
    y: 2.55,
    w: 11.5,
    h: 1.5,
    color: theme.ink,
    fontFace: fonts.heading,
    fontSize: 40,
    bold: true,
    align: "left",
    valign: "mid",
    fit: "shrink",
    placeholder: "title",
    margin: 0
  });

  const bodyRegion = { x: 0.95, y: 4.2, w: 11.4, h: 2.2 };
  renderBlocks(slide, semanticSlide.blocks, bodyRegion, deck.sourcePath, false, theme.muted);

  placeIcon(slide, { x: 10.55, y: 3.55, w: 2.2, h: 2.2 });
}

function renderSectionSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  slide.addShape(shapes.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 7.5,
    line: { color: theme.sectionBackground },
    fill: { color: theme.sectionBackground }
  });

  slide.addShape(shapes.rect, {
    x: 0,
    y: 0,
    w: 0.3,
    h: 7.5,
    line: { color: theme.teal },
    fill: { color: theme.teal }
  });

  placeLogo(slide, { x: 0.9, y: 0.85, w: 4.2, h: 0.84 });

  slide.addText(semanticSlide.title, {
    x: 0.9,
    y: 2.6,
    w: 11.5,
    h: 1.3,
    color: theme.sectionInk,
    fontFace: fonts.heading,
    fontSize: 34,
    bold: true,
    align: "left",
    valign: "mid",
    fit: "shrink",
    placeholder: "title",
    margin: 0
  });

  renderBlocks(slide, semanticSlide.blocks, { x: 0.95, y: 4.1, w: 11.4, h: 2.4 }, deck.sourcePath, false, theme.sectionInk);
}

function renderContentSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, resolveAccent(semanticSlide));
  renderBlocks(slide, semanticSlide.blocks, { x: 0.75, y: 1.45, w: 11.85, h: 5.45 }, deck.sourcePath);
}

function renderTwoColumnSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, resolveAccent(semanticSlide));
  const columns = semanticSlide.columns ?? [];
  const left = columns[0];
  const right = columns[1];

  if (left) {
    renderColumn(slide, left, { x: 0.75, y: 1.5, w: 5.5, h: 5.3 }, deck.sourcePath);
  }

  if (right) {
    renderColumn(slide, right, { x: 7.0, y: 1.5, w: 5.5, h: 5.3 }, deck.sourcePath);
  }
}

function renderTableSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, resolveAccent(semanticSlide));
  const tableBlock = semanticSlide.blocks.find((block): block is SlideTableBlock => block.kind === "table");
  const introBlocks = semanticSlide.blocks.filter((block) => block.kind !== "table");

  renderBlocks(slide, introBlocks, { x: 0.75, y: 1.45, w: 11.85, h: 1.2 }, deck.sourcePath);

  if (tableBlock) {
    slide.addTable([tableBlock.headers, ...tableBlock.rows], {
      x: 0.75,
      y: 2.35,
      w: 11.85,
      h: 4.25,
      border: { color: theme.border, pt: 1 },
      fill: theme.canvas,
      color: theme.ink,
      fontFace: fonts.body,
      fontSize: 13,
      autoFit: false,
      margin: 0.06,
      rowH: 0.34,
      bold: false
    });
  }
}

function renderDemoSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, theme.warning);
  slide.addShape(shapes.roundRect, {
    x: 0.9,
    y: 1.8,
    w: 11.5,
    h: 3.9,
    rectRadius: 0.08,
    line: { color: theme.warning, pt: 1.25 },
    fill: { color: theme.warningSoft }
  });

  slide.addText("Live Demo", {
    x: 1.2,
    y: 2.05,
    w: 3.2,
    h: 0.4,
    color: theme.warning,
    fontFace: fonts.heading,
    fontSize: 18,
    bold: true,
    margin: 0
  });

  renderBlocks(slide, semanticSlide.blocks, { x: 1.2, y: 2.55, w: 10.8, h: 2.8 }, deck.sourcePath);
}

function renderSectionBreak(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  slide.addShape(shapes.rect, {
    x: 0.55,
    y: 1.0,
    w: 12.2,
    h: 5.5,
    line: { color: theme.border, pt: 1 },
    fill: { color: theme.canvas }
  });

  slide.addShape(shapes.rect, {
    x: 0.55,
    y: 1.0,
    w: 12.2,
    h: 0.16,
    line: { color: theme.teal },
    fill: { color: theme.teal }
  });

  slide.addText(semanticSlide.title, {
    x: 1.0,
    y: 2.0,
    w: 11.3,
    h: 1.0,
    color: theme.ink,
    fontFace: fonts.heading,
    fontSize: 28,
    bold: true,
    align: "center",
    valign: "mid",
    fit: "shrink",
    placeholder: "title",
    margin: 0
  });

  renderBlocks(slide, semanticSlide.blocks, { x: 2.0, y: 3.35, w: 9.3, h: 1.8 }, deck.sourcePath, true);
}

function renderWrapUpSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, resolveAccent(semanticSlide));
  slide.addShape(shapes.roundRect, {
    x: 0.75,
    y: 1.65,
    w: 11.85,
    h: 4.8,
    rectRadius: 0.05,
    line: { color: theme.border, pt: 1 },
    fill: { color: theme.canvas }
  });
  renderBlocks(slide, semanticSlide.blocks, { x: 1.05, y: 1.95, w: 11.25, h: 4.2 }, deck.sourcePath);
}

function renderQuoteSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, resolveAccent(semanticSlide));
  const quote = semanticSlide.blocks.find((block): block is SlideTextBlock => block.kind === "quote");
  slide.addShape(shapes.roundRect, {
    x: 1.0,
    y: 2.0,
    w: 11.3,
    h: 3.2,
    rectRadius: 0.05,
    line: { color: theme.quote, pt: 1.5 },
    fill: { color: theme.canvas }
  });
  slide.addText(quote?.text ?? "", {
    x: 1.45,
    y: 2.45,
    w: 10.4,
    h: 2.2,
    color: theme.ink,
    fontFace: fonts.heading,
    fontSize: 22,
    italic: true,
    align: "center",
    valign: "mid",
    fit: "shrink"
  });
}

function renderCodeSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, resolveAccent(semanticSlide));
  const nonCode = semanticSlide.blocks.filter((block) => block.kind !== "code");
  renderBlocks(slide, nonCode, { x: 0.75, y: 1.45, w: 11.85, h: 1.2 }, deck.sourcePath);
  const code = semanticSlide.blocks.find((block): block is SlideCodeBlock => block.kind === "code");

  if (code) {
    slide.addShape(shapes.roundRect, {
      x: 0.9,
      y: 2.0,
      w: 11.55,
      h: 4.55,
      rectRadius: 0.04,
      line: { color: theme.border, pt: 1 },
      fill: { color: theme.sectionInk }
    });
    slide.addText(code.code, {
      x: 1.1,
      y: 2.2,
      w: 11.15,
      h: 4.15,
      color: "E2E8F0",
      fontFace: fonts.mono,
      fontSize: 12,
      fit: "shrink",
      margin: 0.05
    });
  }
}

function addChrome(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide, accent: string): void {
  slide.addShape(shapes.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.95,
    line: { color: theme.titleBand },
    fill: { color: theme.titleBand }
  });

  slide.addShape(shapes.rect, {
    x: 0,
    y: 0,
    w: 0.18,
    h: 0.95,
    line: { color: accent },
    fill: { color: accent }
  });

  slide.addText(semanticSlide.title, {
    x: 0.55,
    y: 0.18,
    w: 10.4,
    h: 0.45,
    color: theme.titleBandText,
    fontFace: fonts.heading,
    fontSize: fontSizes.chromeTitle,
    bold: true,
    fit: "shrink",
    placeholder: "title",
    margin: 0
  });

  placeIcon(slide, { x: 12.4, y: 0.2, w: 0.55, h: 0.55 });
}

function renderColumn(slide: PptxSlide, column: SlideColumn, region: Region, sourcePath: string): void {
  slide.addText(column.title, {
    x: region.x,
    y: region.y,
    w: region.w,
    h: 0.35,
    color: theme.accent,
    fontFace: fonts.heading,
    fontSize: 18,
    bold: true,
    fit: "shrink",
    margin: 0
  });

  renderBlocks(slide, column.blocks, {
    x: region.x,
    y: region.y + 0.45,
    w: region.w,
    h: region.h - 0.45
  }, sourcePath);
}

function renderBlocks(
  slide: PptxSlide,
  blocks: SlideBlock[],
  region: Region,
  sourcePath: string,
  center = false,
  textColor?: string
): void {
  const normalizedBlocks = mergeReferenceHeadingWithList(blocks);
  const referencesBlock = getReferencesBlock(normalizedBlocks);
  const contentBlocks = referencesBlock ? normalizedBlocks.filter((block) => block !== referencesBlock) : normalizedBlocks;
  let y = region.y;
  const maxY = region.y + region.h;
  const referencesHeight = referencesBlock
    ? Math.min(estimateHeight(referencesBlock.text, region.w, fontSizes.references), region.h * 0.38)
    : 0;
  const referencesGap = referencesBlock ? 0.08 : 0;
  const contentMaxY = maxY - referencesHeight - referencesGap;

  for (const block of contentBlocks) {
    const remainingHeight = contentMaxY - y;
    if (remainingHeight <= 0.22) {
      break;
    }

    const renderedHeight = renderBlock(slide, block, {
      x: region.x,
      y,
      w: region.w,
      h: remainingHeight
    }, sourcePath, center, textColor);

    y += renderedHeight + (block.kind === "spacer" ? 0 : 0.1);
  }

  if (referencesBlock) {
    slide.addText(referencesBlock.text, {
      x: region.x,
      y: maxY - referencesHeight,
      w: region.w,
      h: referencesHeight,
      fontFace: fonts.body,
      fontSize: fontSizes.references,
      color: theme.muted,
      fit: "shrink",
      margin: 0.02,
      valign: "top"
    });
  }
}

function renderBlock(
  slide: PptxSlide,
  block: SlideBlock,
  region: Region,
  sourcePath: string,
  center = false,
  textColor?: string
): number {
  switch (block.kind) {
    case "subheading":
      return renderTextBox(slide, block.text, block.runs, region, {
        fontFace: fonts.heading,
        fontSize: fontSizes.subheading,
        bold: true,
        color: textColor ?? theme.accent,
        align: center ? "center" : "left"
      });
    case "text":
      return renderTextBox(slide, block.text, block.runs, region, {
        fontFace: fonts.body,
        fontSize: fontSizes.body,
        color: textColor ?? theme.ink,
        align: center ? "center" : "left"
      });
    case "list":
      return renderListBlock(slide, block, region, {
        fontFace: fonts.body,
        fontSize: fontSizes.body,
        color: textColor ?? theme.ink,
        align: center ? "center" : "left"
      });
    case "quote":
      return renderTextBox(slide, `“${block.text}”`, wrapInlineRuns(block.runs, "“", "”"), region, {
        fontFace: fonts.heading,
        fontSize: 18,
        italic: true,
        color: textColor ?? theme.ink,
        align: center ? "center" : "left"
      });
    case "code":
      return renderCodeBlock(slide, block, region);
    case "mermaid":
      return renderNativeMermaidFlowchart(
        slide,
        block.source,
        region,
        {
          nodeFillColor: "E6F0FF",
          nodeBorderColor: "324A70",
          textColor: textColor ?? theme.ink,
          edgeColor: "324A70",
          fontFace: fonts.body,
          fontSize: 14
        }
      ) ?? renderCodeBlock(slide, { kind: "code", language: "mermaid", code: block.source }, region);
    case "table":
      return renderTableBlock(slide, block, region);
    case "image":
      return renderImageBlock(slide, block, region, sourcePath);
    case "spacer":
      return Math.min(region.h, Math.max(0, block.lines) * 0.24);
    default:
      return 0;
  }
}

function renderTextBox(
  slide: PptxSlide,
  text: string,
  runs: SlideInlineRun[] | undefined,
  region: Region,
  options: {
    fontFace: string;
    fontSize: number;
    color: string;
    bold?: boolean;
    italic?: boolean;
    align?: "left" | "center" | "right";
    breakLine?: boolean;
  }
): number {
  const height = Math.min(estimateHeight(text, region.w, options.fontSize, options.breakLine !== false), region.h);
  const textPayload: string | PptxTextRun[] = runs?.length ? mapInlineRunsToPptxRuns(runs, options) : text;
  slide.addText(textPayload, {
    x: region.x,
    y: region.y,
    w: region.w,
    h: height,
    fontFace: options.fontFace,
    fontSize: options.fontSize,
    color: options.color,
    bold: options.bold,
    italic: options.italic,
    align: options.align,
    fit: "shrink",
    margin: 0.02,
    valign: "top",
    breakLine: options.breakLine
  });
  return height;
}

function renderListBlock(
  slide: PptxSlide,
  block: SlideListBlock,
  region: Region,
  options: {
    fontFace: string;
    fontSize: number;
    color: string;
    align?: "left" | "center" | "right";
  }
): number {
  const height = Math.min(
    estimateHeight(block.items.map((item) => `${"  ".repeat(item.level)}${item.text}`).join("\n"), region.w, options.fontSize),
    region.h
  );

  const listRuns = block.items.flatMap((item, index) => {
    const bulletFontSize = getBulletFontSize(options.fontSize, item.level);
    const paragraphRuns = mapInlineRunsToPptxRuns(item.runs, {
      ...options,
      fontSize: bulletFontSize
    });
    const itemRuns = paragraphRuns.length > 0
      ? paragraphRuns
      : [{
          text: item.text,
          options: {
            fontFace: options.fontFace,
            fontSize: bulletFontSize,
            color: options.color
          }
        }];
    const firstRun = itemRuns[0] as PptxTextRun;
    const lastRun = itemRuns[itemRuns.length - 1] as PptxTextRun;
    const showBullet = item.bullet !== false;

    firstRun.options = showBullet
      ? {
          ...(firstRun.options ?? {}),
          bullet: item.ordered ? { type: "number" } : true,
          indentLevel: item.level
        }
      : {
          ...(firstRun.options ?? {})
        };

    lastRun.options = {
      ...(lastRun.options ?? {}),
      breakLine: index < block.items.length - 1
    };

    return itemRuns;
  });

  slide.addText(
    listRuns,
    {
      x: region.x,
      y: region.y,
      w: region.w,
      h: height,
      align: options.align,
      fit: "shrink",
      margin: 0.02,
      valign: "top"
    }
  );

  return height;
}

function getBulletFontSize(baseFontSize: number, level: number): number {
  if (level <= 0) {
    return baseFontSize;
  }

  return Math.max(baseFontSize - Math.min(level * 2, 5), 12);
}

function renderCodeBlock(slide: PptxSlide, block: SlideCodeBlock, region: Region): number {
  const height = Math.min(Math.max(1.5, estimateHeight(block.code, region.w, 12, false) + 0.3), region.h);
  slide.addShape(shapes.roundRect, {
    x: region.x,
    y: region.y,
    w: region.w,
    h: height,
    rectRadius: 0.03,
    line: { color: theme.border, pt: 1 },
    fill: { color: theme.sectionInk }
  });
  slide.addText(block.code, {
    x: region.x + 0.12,
    y: region.y + 0.12,
    w: region.w - 0.24,
    h: height - 0.24,
    fontFace: fonts.mono,
    fontSize: 12,
    color: "E2E8F0",
    fit: "shrink",
    margin: 0.02
  });
  return height;
}

function renderTableBlock(slide: PptxSlide, block: SlideTableBlock, region: Region): number {
  const height = Math.min(Math.max(1.4, 0.45 + (block.rows.length + 1) * 0.32), region.h);
  slide.addTable([block.headers, ...block.rows], {
    x: region.x,
    y: region.y,
    w: region.w,
    h: height,
    border: { color: theme.border, pt: 1 },
    fill: theme.canvas,
    color: theme.ink,
    fontFace: fonts.body,
    fontSize: 12,
    margin: 0.05,
    rowH: 0.3
  });
  return height;
}

function renderImageBlock(slide: PptxSlide, block: SlideImageBlock, region: Region, sourcePath: string): number {
  const imagePath = path.isAbsolute(block.src) ? block.src : path.resolve(path.dirname(sourcePath), block.src);
  const height = Math.min(region.h, 2.6);

  if (fs.existsSync(imagePath)) {
    slide.addImage({
      path: imagePath,
      x: region.x,
      y: region.y,
      w: Math.min(region.w, 5.6),
      h: height
    });
  } else {
    slide.addShape(shapes.rect, {
      x: region.x,
      y: region.y,
      w: region.w,
      h: height,
      line: { color: theme.border, pt: 1, dash: "dash" },
      fill: { color: "F1F5F9" }
    });
    slide.addText(block.alt ? `${block.alt}\n${block.src}` : block.src, {
      x: region.x + 0.1,
      y: region.y + 0.1,
      w: region.w - 0.2,
      h: height - 0.2,
      fontFace: fonts.body,
      fontSize: 12,
      color: theme.muted,
      align: "center",
      valign: "mid",
      fit: "shrink"
    });
  }

  return height;
}

function mergeReferenceHeadingWithList(blocks: SlideBlock[]): SlideBlock[] {
  const merged: SlideBlock[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const current = blocks[index];
    const nextIndex = findNextNonSpacerIndex(blocks, index + 1);
    const next = nextIndex >= 0 ? blocks[nextIndex] : undefined;

    if (
      (current?.kind === "subheading" || current?.kind === "text") &&
      shouldMergeLabelWithList(current.text) &&
      next?.kind === "list"
    ) {
      if (isReferenceLabel(current.text)) {
        merged.push({
          kind: "text",
          text: `${current.text.trim()}\n${next.items
            .map((item) => formatListItem(item))
            .join("\n")}`
        } satisfies SlideTextBlock);
        index = nextIndex;
        continue;
      }

      const previous = merged[merged.length - 1];
      if (previous?.kind === "list") {
        previous.items.push({
          text: current.text.trim(),
          runs: current.runs,
          level: 0,
          ordered: false,
          bullet: false
        });
        previous.items.push(...next.items);
        index = nextIndex;
        continue;
      }

      merged.push({
        kind: "list",
        items: [
          {
            text: current.text.trim(),
            runs: current.runs,
            level: 0,
            ordered: false,
            bullet: false
          },
          ...next.items
        ]
      } satisfies SlideListBlock);
      index = nextIndex;
      continue;
    }

    if (current) {
      merged.push(current);
    }
  }

  return merged;
}

function findNextNonSpacerIndex(blocks: SlideBlock[], startIndex: number): number {
  for (let index = startIndex; index < blocks.length; index += 1) {
    if (blocks[index]?.kind !== "spacer") {
      return index;
    }
  }

  return -1;
}

function isReferenceLabel(value: string): boolean {
  return /^references?:\s*$/i.test(value.trim());
}

function shouldMergeLabelWithList(value: string): boolean {
  const trimmed = value.trim();
  return isReferenceLabel(trimmed) || /^[^.\n]{1,140}:\s*$/.test(trimmed);
}

function getReferencesBlock(blocks: SlideBlock[]): SlideTextBlock | undefined {
  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    const block = blocks[index];
    if (block?.kind === "text" && /^references?:\s*\n/i.test(block.text.trim())) {
      return block;
    }
  }

  return undefined;
}

function wrapInlineRuns(runs: SlideInlineRun[] | undefined, prefix: string, suffix: string): SlideInlineRun[] | undefined {
  if (!runs || runs.length === 0) {
    return undefined;
  }

  return [{ text: prefix }, ...runs, { text: suffix }];
}

function mapInlineRunsToPptxRuns(
  runs: SlideInlineRun[] | undefined,
  options: {
    fontFace: string;
    fontSize: number;
    color: string;
    bold?: boolean;
    italic?: boolean;
    align?: "left" | "center" | "right";
    breakLine?: boolean;
  }
): PptxTextRun[] {
  return (runs ?? [])
    .filter((run) => run.text.length > 0)
    .map((run) => ({
      text: run.text,
      options: {
        fontFace: run.code ? fonts.mono : options.fontFace,
        fontSize: options.fontSize,
        color: run.link ? "2563EB" : options.color,
        bold: options.bold || run.bold || undefined,
        italic: options.italic || run.italic || undefined,
        strike: run.strike ? "sngStrike" : undefined,
        underline: run.underline || run.link ? { style: "sng" } : undefined,
        hyperlink: run.link ? { url: run.link } : undefined
      }
    }));
}

function placeLogo(slide: PptxSlide, region: Region): void {
  if (fs.existsSync(logoPath)) {
    slide.addImage({ path: logoPath, x: region.x, y: region.y, w: region.w, h: region.h });
  }
}

function placeIcon(slide: PptxSlide, region: Region): void {
  if (fs.existsSync(iconPath)) {
    slide.addImage({ path: iconPath, x: region.x, y: region.y, w: region.w, h: region.h });
  }
}

function resolveAccent(semanticSlide: SemanticSlide): string {
  const accent = semanticSlide.metadata.accent;
  return typeof accent === "string" && accent.trim() ? normalizeColor(accent) : theme.accent;
}

function resolveBackground(semanticSlide: SemanticSlide): string {
  const background = semanticSlide.metadata.background;
  return typeof background === "string" && background.trim() ? normalizeColor(background) : theme.background;
}

function normalizeColor(value: string): string {
  return value.trim().replace(/^#/, "").toUpperCase();
}

function formatListItems(block: SlideListBlock): string {
  const orderedCounts: number[] = [];
  return block.items.map((item) => formatListItem(item, orderedCounts)).join("\n");
}

function formatListItem(
  item: SlideListBlock["items"][number],
  orderedCounts: number[] = []
): string {
  if (item.bullet === false) {
    orderedCounts.length = item.level + 1;
    return `${"  ".repeat(item.level)}${item.text}`;
  }

  orderedCounts.length = item.level + 1;

  if (item.ordered) {
    const next = (orderedCounts[item.level] ?? 0) + 1;
    orderedCounts[item.level] = next;
    return `${"  ".repeat(item.level)}${next}. ${item.text}`;
  }

  orderedCounts[item.level] = 0;
  return `${"  ".repeat(item.level)}• ${item.text}`;
}

function estimateHeight(text: string, width: number, fontSize: number, breakLine = true): number {
  const charactersPerLine = Math.max(14, Math.floor(width * 14));
  const rawLineCount = breakLine
    ? text.split("\n").reduce((count, line) => count + Math.max(1, Math.ceil(line.length / charactersPerLine)), 0)
    : Math.max(1, Math.ceil(text.length / charactersPerLine));
  const lineHeight = fontSize <= 12 ? 0.19 : fontSize <= 16 ? 0.24 : 0.29;
  return Math.max(lineHeight + 0.04, rawLineCount * lineHeight + 0.04);
}
