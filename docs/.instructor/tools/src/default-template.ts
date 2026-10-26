import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderNativeMermaidFlowchart } from "./mermaid-native.js";
import type {
  PresentationTemplate,
  PptxTextRun,
  PptxPresentation,
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

// GitHub "2026 Core Brand" dark theme, reverse-engineered from the m30 deck
// (ppt/theme/theme1.xml + slideMaster1.xml + slideLayouts).
const theme = {
  background: "000000", // bg1 / dk1 - slide background (black)
  canvas: "0D1117", // raised panel surface on dark
  panel: "161B22", // secondary panel surface
  ink: "FFFFFF", // tx1 / lt1 - primary text (white)
  muted: "B0BAC3", // bg2 / dk2 - eyebrows, footers, references
  subtle: "6E7781", // faint chrome text
  border: "30363D", // panel borders on dark
  accent: "0EBE3D", // accent4 - GitHub green (rules, highlights)
  accentBright: "5EEC83", // accent3
  accentSoft: "BEFFD0", // accent1 - mint (subheadings)
  accentDeep: "0D6836", // accent5
  accentDarkest: "09241A", // accent6 - deep green panel fill
  sectionBackground: "000000",
  sectionInk: "FFFFFF",
  sectionAccent: "0EBE3D",
  titleBand: "000000",
  titleBandText: "FFFFFF",
  warning: "F2CC60", // GitHub dark "attention" yellow
  warningSoft: "352A16", // dark amber panel
  quote: "30363D",
  link: "2F94FF", // hlink
  codeBg: "0D1117",
  codeInk: "E6EDF3"
};

const fonts = {
  display: "Mona Sans Display",
  body: "Mona Sans",
  mono: "Mona Sans Mono"
} as const;

// White GitHub "invertocat" mark carried over from the brand slide master, shown
// in the lower-right corner of content/section slides.
const assetDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "default-template");
const brandMarkPath = path.join(assetDirectory, "github-mark.png");

// Position mirrors the master layout's octocat (≈12.97" x, 7.14" y, ≈0.28" square).
const brandMark = {
  x: 12.97,
  y: 7.1,
  w: 0.28,
  h: 0.28
} as const;

const shapes = {
  rect: "rect",
  roundRect: "roundRect"
} as const;

const fontSizes = {
  chromeTitle: 32,
  eyebrow: 11,
  subheading: 22,
  body: 19,
  references: 11
} as const;

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const defaultTemplate: PresentationTemplate = {
  id: "default",
  configurePresentation(pptx, deck) {
    pptx.layout = "LAYOUT_WIDE";
    pptx.author = "GitHub Copilot CLI";
    pptx.company = "GitHub";
    pptx.subject = deck.title;
    pptx.title = deck.title;
    pptx.lang = "en-US";
  },
  renderSlide(pptx, slide, deck, semanticSlide) {
    slide.background = { color: theme.background };
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
  renderHeroSlide(slide, deck, semanticSlide, {
    eyebrow: deckLabel(deck),
    titleColor: theme.ink,
    bodyColor: theme.muted,
    titleSize: 40,
    accentBar: true
  });
}

function renderSectionSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  renderHeroSlide(slide, deck, semanticSlide, {
    eyebrow: deckLabel(deck),
    titleColor: theme.ink,
    bodyColor: theme.muted,
    titleSize: 44,
    accentBar: false
  });
}

function renderHeroSlide(
  slide: PptxSlide,
  deck: SlideDeck,
  semanticSlide: SemanticSlide,
  options: {
    eyebrow: string;
    titleColor: string;
    bodyColor: string;
    titleSize: number;
    accentBar: boolean;
  }
): void {
  // Black canvas, matching the GitHub brand "Title"/"Section" layouts.
  slide.addShape(shapes.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 7.5,
    line: { color: theme.background },
    fill: { color: theme.background }
  });

  if (options.accentBar) {
    // Left vertical green accent that echoes the title-slide sidebar graphic.
    slide.addShape(shapes.rect, {
      x: 0,
      y: 0,
      w: 0.22,
      h: 7.5,
      line: { color: theme.accent },
      fill: { color: theme.accent }
    });
  }

  drawEyebrow(slide, options.eyebrow, options.accentBar ? 0.62 : 0.75);

  const hasBody = semanticSlide.blocks.length > 0;
  // Title is bottom-anchored toward the middle of the slide, left aligned.
  slide.addText(semanticSlide.title, {
    x: options.accentBar ? 0.62 : 0.75,
    y: 1.2,
    w: 11.9,
    h: hasBody ? 3.0 : 4.4,
    color: options.titleColor,
    fontFace: fonts.display,
    fontSize: options.titleSize,
    bold: false,
    align: "left",
    valign: "bottom",
    fit: "shrink",
    placeholder: "title",
    margin: 0,
    lineSpacingMultiple: 0.9
  });

  if (hasBody) {
    const bodyRegion = { x: options.accentBar ? 0.65 : 0.78, y: 4.45, w: 11.7, h: 2.3 };
    renderBlocks(slide, semanticSlide.blocks, bodyRegion, deck.sourcePath, false, options.bodyColor);
  }

  drawAccentRule(slide);
  if (!options.accentBar) {
    drawBrandMark(slide);
  }
}

function deckLabel(deck: SlideDeck): string {
  const meta = deck.metadata;
  const candidate = [meta.module, meta.audience].find(
    (value) => typeof value === "string" && value.trim().length > 0
  );
  return typeof candidate === "string" && candidate.trim().length > 0 ? candidate.trim() : deck.title;
}

// Full-width GitHub-green rule near the bottom (matches the layouts' accent4 bar).
function drawAccentRule(slide: PptxSlide): void {
  slide.addShape(shapes.rect, {
    x: 0,
    y: 7.04,
    w: 13.33,
    h: 0.03,
    line: { color: theme.accent },
    fill: { color: theme.accent }
  });
}

// Lower-right white octocat mark, carried over from the brand slide master.
function drawBrandMark(slide: PptxSlide): void {
  if (!fs.existsSync(brandMarkPath)) {
    return;
  }

  slide.addImage({
    path: brandMarkPath,
    x: brandMark.x,
    y: brandMark.y,
    w: brandMark.w,
    h: brandMark.h,
    altText: "GitHub logo"
  });
}

// Mono, all-caps eyebrow label in the muted brand gray.
function drawEyebrow(slide: PptxSlide, text: string, x = 0.75): void {
  if (!text) {
    return;
  }

  slide.addText(text.toUpperCase(), {
    x,
    y: 0.42,
    w: 11.85,
    h: 0.32,
    color: theme.muted,
    fontFace: fonts.mono,
    fontSize: fontSizes.eyebrow,
    charSpacing: 1,
    align: "left",
    valign: "mid",
    margin: 0
  });
}

function renderContentSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, theme.accent);

  const imageBlock = semanticSlide.blocks.find((block): block is SlideImageBlock => block.kind === "image");
  if (imageBlock) {
    // Canonical "image on a page" layout (modelled on the m30 Security Overview
    // Dashboard slide): supporting copy on the left, the image filling the right.
    const textBlocks = semanticSlide.blocks.filter((block) => block.kind !== "image");
    renderBlocks(slide, textBlocks, { x: 0.75, y: 1.78, w: 4.55, h: 4.95 }, deck.sourcePath);
    renderImageOnPage(slide, imageBlock, { x: 5.55, y: 1.78, w: 7.05, h: 4.95 }, deck.sourcePath);
    return;
  }

  renderBlocks(slide, semanticSlide.blocks, { x: 0.75, y: 1.78, w: 11.85, h: 4.95 }, deck.sourcePath);
}

function renderTwoColumnSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, theme.accent);
  const columns = semanticSlide.columns ?? [];
  const left = columns[0];
  const right = columns[1];

  if (left) {
    renderColumn(slide, left, { x: 0.75, y: 1.82, w: 5.5, h: 4.9 }, deck.sourcePath);
  }

  if (right) {
    renderColumn(slide, right, { x: 7.0, y: 1.82, w: 5.5, h: 4.9 }, deck.sourcePath);
  }
}

function renderTableSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, theme.accent);
  const tableBlock = semanticSlide.blocks.find((block): block is SlideTableBlock => block.kind === "table");
  const introBlocks = semanticSlide.blocks.filter((block) => block.kind !== "table");

  renderBlocks(slide, introBlocks, { x: 0.75, y: 1.78, w: 11.85, h: 0.9 }, deck.sourcePath);

  if (tableBlock) {
    slide.addTable(toTableMatrix(tableBlock), {
      x: 0.75,
      y: 2.75,
      w: 11.85,
      h: 3.85,
      colW: computeColumnWidths(tableBlock.headers.length, 11.85),
      border: { color: theme.border, pt: 1 },
      fill: theme.canvas,
      color: theme.ink,
      fontFace: fonts.body,
      fontSize: 12,
      valign: "top",
      autoFit: false,
      margin: 0.06,
      rowH: 0.34,
      bold: false
    });
  }
}

// Builds the pptxgenjs row matrix for a table, turning cells that contain
// newlines (authored as `<br>`) into multi-line rich-text runs so each point
// renders on its own line inside the cell.
function toTableMatrix(block: SlideTableBlock): string[][] {
  const rows = [block.headers, ...block.rows].map((row) => row.map((cell) => toTableCell(cell)));
  // pptxgenjs accepts rich-text cell objects; the wrapper type only models
  // string cells, so widen here at the single call boundary.
  return rows as unknown as string[][];
}

function toTableCell(value: string): unknown {
  if (!value.includes("\n")) {
    return value;
  }

  const lines = value.split("\n");
  return {
    text: lines.map((line, index) => ({
      text: line,
      options: index < lines.length - 1 ? { breakLine: true } : {}
    }))
  };
}

// Gives the first column a narrow fixed width (row labels / "Scope" header) and
// distributes the remaining width evenly across the data columns.
function computeColumnWidths(columnCount: number, totalWidth: number): number[] | undefined {
  if (columnCount <= 1) {
    return undefined;
  }

  const firstWidth = Math.min(1.9, totalWidth / columnCount);
  const remaining = (totalWidth - firstWidth) / (columnCount - 1);
  return [firstWidth, ...Array(columnCount - 1).fill(remaining)];
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
    fontFace: fonts.display,
    fontSize: 18,
    bold: true,
    margin: 0
  });

  renderBlocks(slide, semanticSlide.blocks, { x: 1.2, y: 2.55, w: 10.8, h: 2.8 }, deck.sourcePath);
}

function renderSectionBreak(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  // Full-bleed black divider with a centered green panel accent.
  slide.addShape(shapes.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 7.5,
    line: { color: theme.background },
    fill: { color: theme.background }
  });

  slide.addShape(shapes.rect, {
    x: 0.55,
    y: 2.45,
    w: 0.16,
    h: 2.6,
    line: { color: theme.accent },
    fill: { color: theme.accent }
  });

  drawEyebrow(slide, deckLabel(deck));

  slide.addText(semanticSlide.title, {
    x: 1.0,
    y: 2.45,
    w: 11.3,
    h: 1.6,
    color: theme.ink,
    fontFace: fonts.display,
    fontSize: 40,
    bold: false,
    align: "left",
    valign: "mid",
    fit: "shrink",
    placeholder: "title",
    margin: 0,
    lineSpacingMultiple: 0.9
  });

  renderBlocks(slide, semanticSlide.blocks, { x: 1.0, y: 4.2, w: 10.3, h: 1.8 }, deck.sourcePath, false, theme.muted);
  drawAccentRule(slide);
  drawBrandMark(slide);
}

function renderWrapUpSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, theme.accent);
  slide.addShape(shapes.roundRect, {
    x: 0.75,
    y: 1.82,
    w: 11.85,
    h: 4.7,
    rectRadius: 0.05,
    line: { color: theme.border, pt: 1 },
    fill: { color: theme.canvas }
  });
  renderBlocks(slide, semanticSlide.blocks, { x: 1.05, y: 2.05, w: 11.25, h: 4.25 }, deck.sourcePath);
}

function renderQuoteSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, theme.accent);
  const quote = semanticSlide.blocks.find((block): block is SlideTextBlock => block.kind === "quote");
  slide.addShape(shapes.roundRect, {
    x: 1.0,
    y: 2.0,
    w: 11.3,
    h: 3.2,
    rectRadius: 0.05,
    line: { color: theme.quote, pt: 1 },
    fill: { color: theme.canvas }
  });
  slide.addText(quote?.text ?? "", {
    x: 1.45,
    y: 2.45,
    w: 10.4,
    h: 2.2,
    color: theme.ink,
    fontFace: fonts.display,
    fontSize: 22,
    italic: true,
    align: "center",
    valign: "mid",
    fit: "shrink"
  });
}

function renderCodeSlide(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void {
  addChrome(slide, deck, semanticSlide, theme.accent);
  const nonCode = semanticSlide.blocks.filter((block) => block.kind !== "code");
  renderBlocks(slide, nonCode, { x: 0.75, y: 1.78, w: 11.85, h: 0.9 }, deck.sourcePath);
  const code = semanticSlide.blocks.find((block): block is SlideCodeBlock => block.kind === "code");

  if (code) {
    slide.addShape(shapes.roundRect, {
      x: 0.9,
      y: 2.75,
      w: 11.55,
      h: 3.85,
      rectRadius: 0.04,
      line: { color: theme.border, pt: 1 },
      fill: { color: theme.codeBg }
    });
    slide.addText(code.code, {
      x: 1.1,
      y: 2.95,
      w: 11.15,
      h: 3.45,
      color: theme.codeInk,
      fontFace: fonts.mono,
      fontSize: 12,
      fit: "shrink",
      margin: 0.05
    });
  }
}

function addChrome(slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide, _accent: string): void {
  drawEyebrow(slide, deckLabel(deck));

  slide.addText(semanticSlide.title, {
    x: 0.75,
    y: 0.74,
    w: 11.85,
    h: 0.92,
    color: theme.ink,
    fontFace: fonts.display,
    fontSize: fontSizes.chromeTitle,
    bold: false,
    align: "left",
    valign: "top",
    fit: "shrink",
    placeholder: "title",
    margin: 0,
    lineSpacingMultiple: 0.95
  });

  drawAccentRule(slide);
  drawBrandMark(slide);
}

function renderColumn(slide: PptxSlide, column: SlideColumn, region: Region, sourcePath: string): void {
  slide.addText(column.title, {
    x: region.x,
    y: region.y,
    w: region.w,
    h: 0.35,
    color: theme.accent,
    fontFace: fonts.display,
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
  let y = region.y;
  const maxY = region.y + region.h;

  for (const block of normalizedBlocks) {
    const remainingHeight = maxY - y;
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
        fontFace: fonts.display,
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
        fontFace: fonts.display,
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
          nodeFillColor: theme.panel,
          nodeBorderColor: theme.accent,
          textColor: textColor ?? theme.ink,
          edgeColor: theme.muted,
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
    fill: { color: theme.codeBg }
  });
  slide.addText(block.code, {
    x: region.x + 0.12,
    y: region.y + 0.12,
    w: region.w - 0.24,
    h: height - 0.24,
    fontFace: fonts.mono,
    fontSize: 12,
    color: theme.codeInk,
    fit: "shrink",
    margin: 0.02
  });
  return height;
}

function renderTableBlock(slide: PptxSlide, block: SlideTableBlock, region: Region): number {
  const height = Math.min(Math.max(1.4, 0.45 + (block.rows.length + 1) * 0.32), region.h);
  slide.addTable(toTableMatrix(block), {
    x: region.x,
    y: region.y,
    w: region.w,
    h: height,
    colW: computeColumnWidths(block.headers.length, region.w),
    border: { color: theme.border, pt: 1 },
    fill: theme.canvas,
    color: theme.ink,
    fontFace: fonts.body,
    fontSize: 12,
    valign: "top",
    margin: 0.05,
    rowH: 0.3
  });
  return height;
}

function renderImageBlock(slide: PptxSlide, block: SlideImageBlock, region: Region, sourcePath: string): number {
  return renderImageOnPage(slide, block, region, sourcePath);
}

// Single canonical image renderer: the image is fit inside its region with its
// aspect ratio preserved (`contain`) and anchored to the top of the region.
// Missing images fall back to a dashed placeholder showing the alt text / path.
function renderImageOnPage(slide: PptxSlide, block: SlideImageBlock, region: Region, sourcePath: string): number {
  const imagePath = path.isAbsolute(block.src) ? block.src : path.resolve(path.dirname(sourcePath), block.src);

  if (fs.existsSync(imagePath)) {
    slide.addImage({
      path: imagePath,
      x: region.x,
      y: region.y,
      w: region.w,
      h: region.h,
      sizing: { type: "contain", w: region.w, h: region.h },
      altText: block.alt ?? undefined
    });
    return region.h;
  }

  const height = Math.min(region.h, 2.6);
  slide.addShape(shapes.rect, {
    x: region.x,
    y: region.y,
    w: region.w,
    h: height,
    line: { color: theme.border, pt: 1, dash: "dash" },
    fill: { color: theme.panel }
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
        color: run.link ? theme.link : options.color,
        bold: options.bold || run.bold || undefined,
        italic: options.italic || run.italic || undefined,
        strike: run.strike ? "sngStrike" : undefined,
        underline: run.underline || run.link ? { style: "sng" } : undefined,
        hyperlink: run.link ? { url: run.link } : undefined
      }
    }));
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
