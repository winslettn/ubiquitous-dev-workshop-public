export { parseDeck, parseDeckFromFile } from "./markdown.js";
export { generateFromInput, lintInput } from "./generator.js";
export { defaultTemplate } from "./default-template.js";
export { caipTemplate } from "./caip-template.js";
export type {
  DeckMetadata,
  GeneratedDeck,
  PresentationTemplate,
  SemanticSlide,
  SlideBlock,
  SlideColumn,
  SlideDeck,
  SlideLayout,
  SlideMetadata
} from "./types.js";
