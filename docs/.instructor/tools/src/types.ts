export type SlideLayout =
  | "title"
  | "section"
  | "content"
  | "two-column"
  | "table"
  | "demo"
  | "section-break"
  | "wrap-up"
  | "quote"
  | "code";

export type SourceMode = "canonical" | "legacy";

export interface DeckMetadata {
  title?: string;
  template?: string;
  audience?: string;
  module?: string;
  [key: string]: unknown;
}

export interface SlideMetadata {
  title?: string;
  layout?: SlideLayout;
  template?: string;
  accent?: string;
  background?: string;
  hidden?: boolean;
  [key: string]: unknown;
}

export interface SlideTextBlock {
  kind: "text" | "subheading";
  text: string;
  runs?: SlideInlineRun[];
}

export interface SlideListBlock {
  kind: "list";
  items: SlideListItem[];
}

export interface SlideListItem {
  text: string;
  runs?: SlideInlineRun[];
  level: number;
  ordered: boolean;
  bullet?: boolean;
}

export interface SlideInlineRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  link?: string;
}

export interface SlideTableBlock {
  kind: "table";
  headers: string[];
  rows: string[][];
}

export interface SlideCodeBlock {
  kind: "code";
  language?: string;
  code: string;
}

export interface SlideMermaidBlock {
  kind: "mermaid";
  source: string;
}

export interface SlideQuoteBlock {
  kind: "quote";
  text: string;
  runs?: SlideInlineRun[];
}

export interface SlideImageBlock {
  kind: "image";
  src: string;
  alt?: string;
}

export interface SlideSpacerBlock {
  kind: "spacer";
  lines: number;
}

export type SlideBlock =
  | SlideTextBlock
  | SlideListBlock
  | SlideTableBlock
  | SlideCodeBlock
  | SlideMermaidBlock
  | SlideQuoteBlock
  | SlideImageBlock
  | SlideSpacerBlock;

export interface SlideColumn {
  title: string;
  blocks: SlideBlock[];
}

export interface SemanticSlide {
  title: string;
  layout: SlideLayout;
  metadata: SlideMetadata;
  hidden: boolean;
  notes: string[];
  blocks: SlideBlock[];
  columns?: SlideColumn[];
  warnings: string[];
  sourceMode: SourceMode;
}

export interface SlideDeck {
  sourcePath: string;
  title: string;
  metadata: DeckMetadata;
  slides: SemanticSlide[];
  warnings: string[];
  sourceMode: SourceMode | "mixed";
}

export interface GeneratedDeck {
  deck: SlideDeck;
  outputPath: string;
}

export interface PptxSlide {
  hidden?: boolean;
  background?: { color: string };
  addShape(shapeName: string, options: Record<string, unknown>): unknown;
  addText(text: string | PptxTextRun[], options: Record<string, unknown>): unknown;
  addTable(rows: string[][], options: Record<string, unknown>): unknown;
  addImage(options: Record<string, unknown>): unknown;
  addNotes(notes: string): unknown;
}

export interface PptxTextRun {
  text: string;
  options?: Record<string, unknown>;
}

export interface PptxPresentation {
  layout: string;
  author: string;
  company: string;
  subject: string;
  title: string;
  lang: string;
  addSlide(): PptxSlide;
  writeFile(options: { fileName: string }): Promise<unknown>;
}

export interface PresentationTemplate {
  id: string;
  configurePresentation(pptx: PptxPresentation, deck: SlideDeck): void;
  renderSlide(pptx: PptxPresentation, slide: PptxSlide, deck: SlideDeck, semanticSlide: SemanticSlide): void;
}
