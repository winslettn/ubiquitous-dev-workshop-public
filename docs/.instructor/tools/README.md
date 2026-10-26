# slides-pptx

Standalone **TypeScript + PptxGenJS** engine for converting instructor slide markdown into editable PowerPoint decks.

## Why this package exists

- Keeps slide generation separate from the API and frontend packages
- Uses a **TypeScript template contract** so presentation design stays modular
- Defines a **canonical markdown format** that maps cleanly to slide layouts
- Still reads current legacy slide markdown through an isolated migration path

## Commands

```bash
npm run lint
npm run generate
npm run generate -- --input ..\\slides\\m21-idea-to-code-slides.md
npm run generate -- --input ..\\slides\\m1*.md
npm run generate -- --input ..\\slides --output ..\\slides\\generated
```

## Canonical markdown format

Use HTML comment metadata blocks, `---` slide separators, and `speaker-notes` fenced blocks for notes.

````md
<!--
title: Module 21: Work IQ — Idea-to-Code
template: default
-->
# Module 21: Work IQ — Idea-to-Code

---
<!--
template: default
layout: content
hidden: false
-->
## Title & Objectives

- What is the workflow?
- Where does Copilot help?

```speaker-notes
Frame this as an orientation module before the deeper capability modules.
```

---
<!--
template: default
layout: section
-->
## Part 2: GitHub Well Architected Framework

- Shift from security specifics to broader architecture review patterns

---
<!--
template: default
layout: two-column
hidden: true
-->
## Compare Approaches

### Legacy
- YAML frontmatter (legacy)

### Canonical
- HTML comment metadata blocks
- `speaker-notes`
````

## Supported layouts

- `title`
- `section`
- `content`
- `two-column`
- `table`
- `demo`
- `section-break`
- `wrap-up`
- `quote`
- `code`

If `layout` is omitted, the engine infers a reasonable default. Prefer explicit layout metadata when the visual intent matters.

## Tables and images

- **Tables** are authored as standard GitHub-flavored markdown tables. Use `<br>` inside a cell to force a line break; each line renders on its own row inside the PowerPoint table cell. A slide containing a table renders best with `layout: table` (the first column is given a narrow fixed width for row labels).
- **Images** use standard markdown image syntax (`![alt text](assets/file.png)`) on their own line. There is a single on-page image format: supporting copy renders in a left column and the image fills the right side of the slide, scaled to fit while preserving its aspect ratio. Store assets next to the deck (e.g. `slides/assets/<name>.png`); paths are resolved relative to the markdown file.


- The deck-level `#` heading is emitted as the opening title slide, with only the title text visible on the slide.
- `title` remains available when you intentionally want another hero-style slide later in the deck.
- `section` is a hero-style divider slide inside the deck and is typically authored as a `##` slide heading with `layout: section`.

## Hidden slides and speaker notes

The authoring contract supports both features directly:

````md
<!--
template: default
layout: content
hidden: true
-->
## Internal Appendix

- Extra facilitator material

```speaker-notes
Keep this slide hidden in the live delivery deck, but retain it for handoff and reuse.
```
````

- `hidden: true` marks the PowerPoint slide as hidden
- HTML comment metadata blocks are the canonical way to declare layout and hidden-slide hints
- `speaker-notes` content is written into native PowerPoint speaker notes
- Legacy `<!-- Speaker notes: ... -->` comments still parse, but fenced notes are the canonical format

## Legacy input support

The engine still reads:

- YAML frontmatter metadata at the top of a deck
- `### Slide N — ...` decks
- heading-only scaffold decks
- speaker notes in HTML comments like `<!-- Speaker notes: ... -->`

Those forms lint as **legacy** so authors can migrate toward the canonical format without blocking generation.

## Output behavior

- `--input` defaults to `..\\slides`
- `--input` accepts a single markdown file, a directory, or a wildcard pattern such as `..\\slides\\m1*.md`
- `--output` defaults to `..\\slides\\generated` for `generate`
- For a **single markdown file**, the output writes `<deck-name>.pptx` into the selected output folder
- For a **directory input** or **wildcard input**, each generated `.pptx` file is written directly into the selected output folder
- Generated decks remain editable PowerPoint content

## Templates

Templates are executable TypeScript modules that implement the presentation contract:

- configure presentation-wide settings
- own layout and branding choices
- render semantic slides into PowerPoint shapes, tables, images, and notes

The current implementation ships with a single `default` template. Additional templates can be added without changing the markdown parser.

## Branding

The `default` template renders the **GitHub "2026 Core Brand" dark** look, reverse-engineered from the instructor master deck:

- Black slide background with white body text
- GitHub green (`#0EBE3D`) accent rule and highlights
- `Mona Sans Display` titles, `Mona Sans` body, and `Mona Sans Mono` eyebrows/footers/code
- Mermaid diagrams render with a matching dark palette

Install the Mona Sans family locally for exact rendering; PowerPoint falls back gracefully if it is missing.
