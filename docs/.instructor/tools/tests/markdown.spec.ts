import { describe, expect, it } from "vitest";
import { parseDeck } from "../src/markdown.js";

describe("parseDeck", () => {
  it("parses canonical decks with HTML comment metadata and speaker notes", () => {
    const markdown = `<!--
title: Sample Module
template: default
-->
# Sample Module

---
<!--
template: default
layout: content
-->
## Welcome

- Goal one
- Goal two

\`\`\`speaker-notes
Open with the framing story.
\`\`\`

---
<!--
template: default
layout: section
-->
## Part 2: Deep Dive

- Transition into the next section.

---
<!--
template: default
layout: two-column
hidden: true
-->
## Compare Approaches

### Legacy
- HTML comments

### Canonical
- HTML comment metadata blocks
- speaker-notes fences
`;

    const deck = parseDeck(markdown, "C:\\repo\\docs\\.instructor\\slides\\sample.md");

    expect(deck.title).toBe("Sample Module");
    expect(deck.slides).toHaveLength(4);
    expect(deck.slides[0]?.layout).toBe("title");
    expect(deck.slides[0]?.title).toBe("Sample Module");
    expect(deck.slides[0]?.blocks).toEqual([]);
    expect(deck.slides[0]?.metadata.template).toBe("default");
    expect(deck.slides[0]?.notes).toEqual([]);
    expect(deck.slides[1]?.layout).toBe("content");
    expect(deck.slides[1]?.metadata.template).toBe("default");
    expect(deck.slides[1]?.notes).toEqual(["Open with the framing story."]);
    expect(deck.slides[2]?.layout).toBe("section");
    expect(deck.slides[2]?.metadata.template).toBe("default");
    expect(deck.slides[3]?.layout).toBe("two-column");
    expect(deck.slides[3]?.metadata.template).toBe("default");
    expect(deck.slides[3]?.hidden).toBe(true);
    expect(deck.sourceMode).toBe("canonical");
  });

  it("parses legacy frontmatter and explicit slide headings with migration warnings", () => {
    const markdown = `---
title: Legacy Deck
---
# Module 21: Work IQ — Idea-to-Code
## Slides

### Slide 1 — Title & Objectives

- What is the workflow?
<!-- Speaker notes: Keep this quick. -->

### Slide 2 — Demo Placeholder

> **Demo:** Run the full flow
`;

    const deck = parseDeck(markdown, "C:\\repo\\docs\\.instructor\\slides\\legacy.md");

    expect(deck.slides).toHaveLength(3);
    expect(deck.slides[0]?.title).toBe("Module 21: Work IQ — Idea-to-Code");
    expect(deck.slides[0]?.layout).toBe("title");
    expect(deck.slides[0]?.blocks).toEqual([]);
    expect(deck.slides[1]?.title).toBe("Title & Objectives");
    expect(deck.title).toBe("Legacy Deck");
    expect(deck.warnings.some((warning) => warning.includes("legacy `### Slide N` headings"))).toBe(true);
    expect(deck.slides[1]?.notes[0]).toContain("Keep this quick.");
    expect(deck.sourceMode).toBe("legacy");
  });

  it("preserves nested list structure with sub-bullets", () => {
    const markdown = `# Nested List Deck

---
## GitHub Security and Quality Product Coverage

- **GitHub Dependabot:** Supply chain security
  - **Capabilities:** Dependency alerts
  - **License:** Included in GitHub plans
- **GitHub Secret Protection:** Secret scanning and push protection
`;

    const deck = parseDeck(markdown, "C:\\repo\\docs\\.instructor\\slides\\nested-list.md");
    const listBlock = deck.slides[1]?.blocks.find((block) => block.kind === "list");

    expect(listBlock).toMatchObject({
      kind: "list",
      items: [
        { text: "GitHub Dependabot: Supply chain security", level: 0, ordered: false },
        { text: "Capabilities: Dependency alerts", level: 1, ordered: false },
        { text: "License: Included in GitHub plans", level: 1, ordered: false },
        { text: "GitHub Secret Protection: Secret scanning and push protection", level: 0, ordered: false }
      ]
    });
  });

  it("preserves intra-cell line breaks in tables authored with <br>", () => {
    const markdown = `# Table Deck

---
<!--
layout: table
-->
## Scope Matrix

| Scope | Enterprise |
| --- | --- |
| Dependabot | Alerts in configs<br>Centralized credentials |
`;

    const deck = parseDeck(markdown, "C:\\repo\\docs\\.instructor\\slides\\table.md");
    const tableBlock = deck.slides[1]?.blocks.find((block) => block.kind === "table");

    expect(tableBlock).toMatchObject({
      kind: "table",
      headers: ["Scope", "Enterprise"],
      rows: [["Dependabot", "Alerts in configs\nCentralized credentials"]]
    });
  });

  it("parses a standalone image paragraph into an image block", () => {
    const markdown = `# Image Deck

---
## Dashboard

- Supporting copy

![Dashboard screenshot](assets/dashboard.png)
`;

    const deck = parseDeck(markdown, "C:\\repo\\docs\\.instructor\\slides\\image.md");
    const imageBlock = deck.slides[1]?.blocks.find((block) => block.kind === "image");

    expect(imageBlock).toMatchObject({
      kind: "image",
      src: "assets/dashboard.png",
      alt: "Dashboard screenshot"
    });
  });

  it("preserves inline markdown formatting for text and list items", () => {
    const markdown = `# Formatting Deck

---
## Formatting

Use **bold**, *italic*, ~~strikethrough~~, \`inline code\`, and [docs](https://docs.github.com).

- Main **bold** bullet with [link](https://github.com)
  - Nested *italic* bullet
`;

    const deck = parseDeck(markdown, "C:\\repo\\docs\\.instructor\\slides\\formatting.md");
    const textBlock = deck.slides[1]?.blocks.find((block) => block.kind === "text");
    const listBlock = deck.slides[1]?.blocks.find((block) => block.kind === "list");

    expect(textBlock).toMatchObject({
      kind: "text",
      text: "Use bold, italic, strikethrough, inline code, and docs."
    });
    expect(textBlock?.kind === "text" && textBlock.runs?.some((run) => run.bold)).toBe(true);
    expect(textBlock?.kind === "text" && textBlock.runs?.some((run) => run.italic)).toBe(true);
    expect(textBlock?.kind === "text" && textBlock.runs?.some((run) => run.strike)).toBe(true);
    expect(textBlock?.kind === "text" && textBlock.runs?.some((run) => run.code)).toBe(true);
    expect(textBlock?.kind === "text" && textBlock.runs?.some((run) => run.link === "https://docs.github.com")).toBe(true);

    expect(listBlock).toMatchObject({
      kind: "list",
      items: [
        { text: "Main bold bullet with link", level: 0, ordered: false },
        { text: "Nested italic bullet", level: 1, ordered: false }
      ]
    });
    expect(listBlock?.kind === "list" && listBlock.items[0]?.runs?.some((run) => run.bold)).toBe(true);
    expect(listBlock?.kind === "list" && listBlock.items[0]?.runs?.some((run) => run.link === "https://github.com")).toBe(true);
    expect(listBlock?.kind === "list" && listBlock.items[1]?.runs?.some((run) => run.italic)).toBe(true);
  });

  it("parses mermaid fenced blocks as diagram blocks", () => {
    const markdown = `# Mermaid Deck

---
## Architecture Diagram

\`\`\`mermaid
flowchart LR
  A[Developer] --> B[GitHub]
\`\`\`
`;

    const deck = parseDeck(markdown, "C:\\repo\\docs\\.instructor\\slides\\mermaid.md");
    const mermaidBlock = deck.slides[1]?.blocks.find((block) => block.kind === "mermaid");

    expect(deck.slides[1]?.layout).toBe("content");
    expect(mermaidBlock).toMatchObject({
      kind: "mermaid",
      source: "flowchart LR\n  A[Developer] --> B[GitHub]"
    });
  });

  it("preserves embedded blank lines between content blocks", () => {
    const markdown = `# Spacing Deck

---
## Spacing

Intro paragraph.


- First bullet
- Second bullet


Outro paragraph.
`;

    const deck = parseDeck(markdown, "C:\\repo\\docs\\.instructor\\slides\\spacing.md");
    expect(deck.slides[1]?.blocks).toEqual([
      { kind: "text", text: "Intro paragraph.", runs: [{ text: "Intro paragraph." }] },
      { kind: "spacer", lines: 1 },
      {
        kind: "list",
        items: [
          { text: "First bullet", runs: [{ text: "First bullet" }], level: 0, ordered: false },
          { text: "Second bullet", runs: [{ text: "Second bullet" }], level: 0, ordered: false }
        ]
      },
      { kind: "spacer", lines: 1 },
      { kind: "text", text: "Outro paragraph.", runs: [{ text: "Outro paragraph." }] }
    ]);
  });

  it("preserves blank lines embedded between list items as blank items", () => {
    const markdown = `# Grouped Bullets Deck

---
## Grouped Bullets

- Group one first
- Group one second

- Group two first
- Group two second
`;

    const deck = parseDeck(markdown, "C:\\repo\\docs\\.instructor\\slides\\grouped.md");
    const listBlock = deck.slides[1]?.blocks.find((block) => block.kind === "list");
    expect(listBlock).toEqual({
      kind: "list",
      items: [
        { text: "Group one first", runs: [{ text: "Group one first" }], level: 0, ordered: false },
        { text: "Group one second", runs: [{ text: "Group one second" }], level: 0, ordered: false },
        { text: " ", level: 0, ordered: false, bullet: false },
        { text: "Group two first", runs: [{ text: "Group two first" }], level: 0, ordered: false },
        { text: "Group two second", runs: [{ text: "Group two second" }], level: 0, ordered: false }
      ]
    });
  });
});
