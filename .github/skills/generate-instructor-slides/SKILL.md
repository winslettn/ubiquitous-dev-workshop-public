---
name: generate-instructor-slides
description: "Generate facilitator-ready HTML presentations for workshop delivery, ask which modules to include, require a presentation name, compose module markdown, and render HTML slides"
---

# Generate Instructor Slides

Use this skill when an instructor is preparing to deliver a workshop and needs a facilitator-ready HTML presentation composed from selected modules.

## Inputs

- Module IDs, for example: m21,m22,m24 (if not provided, ask)
- Presentation name, for example: `agentic-automation-workshop` or `Agentic Automation Workshop`
- Optional deck title override when it should differ from the presentation name
- Optional markdown output path when the default generated name should be overridden
- Optional HTML output path when the default generated name should be overridden
- Optional visual direction when the instructor wants a custom look (for example: executive briefing, workshop lab, or bold launch narrative)
- Optional `skip-design-pass` preference when the user wants raw composed output only

## Workflow

1. Confirm this is an instructor-prep workflow.
2. Ask only for the minimum missing inputs:
- module IDs when not provided (prefer checkbox selection populated from live module inventory)
- presentation name when not provided
- optional deck title only if the user wants it to differ from the presentation name
- optional markdown output path only if the user wants a non-default location
- optional HTML output path only if the user wants a non-default location
- optional `skip-design-pass` only if the user explicitly wants to bypass frontend-design handoff
3. Use the local compose script for module discovery and validation instead of inspecting repo files manually.
4. When module IDs are not explicitly provided, run `--list-modules`, parse the discovered IDs, and present them as a multi-select checkbox list in chat (using `vscode_askQuestions` with `multiSelect: true`).
5. Build the `--modules` argument from the checked values and continue generation.
6. Prefer one of these local entrypoints:
- `node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --list-modules` to discover valid modules and coverage
- `node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --interactive` when the user wants runtime selection
- `node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --modules <module-list>` when module IDs are already known
7. Always produce an HTML presentation file. Markdown is an intermediate artifact for composition.
8. Run the compose script with a presentation name so local code determines the default title and markdown file name:

```bash
node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --modules m21,m22,m24 --presentation-name "Agentic Automation Workshop"
```

9. For interactive selection at runtime, run:

```bash
node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --interactive
```

10. Run `frontend-design` as the default handoff styling pass on the generated markdown before final HTML render:
- keep module order, learning objectives, and speaker notes intact
- apply visual identity using Marp-compatible CSS and slide-level classes
- do not rewrite factual workshop content unless the user requests content edits
- skip this step only when the user explicitly sets `skip-design-pass`

11. Render HTML slides from the composed markdown using Marp CLI:

```bash
npx --yes @marp-team/marp-cli docs/.instructor/slides/generated/<name>-slides.md --html --allow-local-files --output docs/.instructor/slides/generated/<name>-slides.html
```

12. Return a concise summary based on command output:
- included modules
- source coverage reported by the script
- generated HTML path
- generated markdown path (only as intermediate context)
- presentation name used for the generated deck

## Speaker Notes

Speaker notes are automatically extracted from instructor notes markdown files (`docs/.instructor/mNN-*.md`) and embedded in the generated presentation.

### How Speaker Notes Work

- **Source**: Each module's instructor notes file (e.g., `docs/.instructor/m10-ghe-admin-notes.md`)
- **Embedded as**: Fenced code blocks with language tag `speaker-notes` in the markdown, e.g.:
  ```speaker-notes
  Point participants to the exercise guide and frame success around completion criteria.
  ```
- **Accessible in HTML**: Use Marp's **Presenter View** to see speaker notes while delivering
  - Press **p** during the HTML presentation to open Presenter View
  - Presenter View shows current slide, next slide preview, speaker notes, elapsed time, and timer

### Instructor Delivery

1. Open the generated HTML file in a browser
2. Start the slideshow (full screen mode)
3. Press **p** to open Presenter View
4. View speaker notes alongside slide content
5. Use presenter view timer and notes to guide pacing and talking points

### Note Extraction

The compose script automatically extracts facilitation context from instructor notes, including:
- Topics and focus areas (first section of notes)
- Workshop objectives (from module workshop guides)
- Specific facilitation talking points (speaker-notes blocks)

All speaker notes are preserved during design passes and final HTML rendering.

## Command Templates

List discovered modules and context coverage:

```bash
node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --list-modules
```

Compose markdown only:

```bash
node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --modules <module-list> --presentation-name "<presentation-name>"
```

Render generated markdown to HTML:

```bash
npx --yes @marp-team/marp-cli docs/.instructor/slides/generated/<name>-slides.md --html --allow-local-files --output docs/.instructor/slides/generated/<name>-slides.html
```

Compose and render HTML in one flow (raw output, only when design pass is skipped):

```bash
node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --modules <module-list> --presentation-name "<presentation-name>" && npx --yes @marp-team/marp-cli docs/.instructor/slides/generated/<name>-slides.md --html --allow-local-files --output docs/.instructor/slides/generated/<name>-slides.html
```

Compose, design, and render (default handoff flow):

```text
1) Compose deck markdown with compose-module-slides.mjs
2) Apply frontend-design skill to the generated markdown (Marp-compatible styling pass)
3) Render final HTML with marp-cli
```

Compose and render raw output (only when design pass is explicitly skipped):

```text
1) Compose deck markdown with compose-module-slides.mjs
2) Skip frontend-design only when user requests skip-design-pass
3) Render final HTML with marp-cli
```

Compose markdown interactively:

```bash
node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --interactive
```

Checkbox-based module selection flow (recommended when modules are not provided):

```text
1) Run compose-module-slides.mjs --list-modules
2) Show discovered modules as multi-select checkbox options with vscode_askQuestions
3) Join checked module IDs into the --modules argument
4) Continue compose -> default design pass -> HTML render (unless skip-design-pass is explicitly set)
```

Compose markdown with title and output path:

```bash
node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --modules <module-list> --presentation-name "<presentation-name>" --title "<deck-title>" --output docs/.instructor/slides/generated/<name>-slides.md
```

Compose markdown with title/output path and render to custom HTML output (raw output, only when design pass is skipped):

```bash
node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --modules <module-list> --presentation-name "<presentation-name>" --title "<deck-title>" --output <markdown-output-path> && npx --yes @marp-team/marp-cli <markdown-output-path> --html --allow-local-files --output <html-output-path>
```

## Guardrails

- Do not invent module files that do not exist.
- If a module ID is ambiguous or missing, ask for clarification before proceeding.
- Prefer checkbox module selection over free-text module entry when modules are missing.
- Always ask for a presentation name before generation so the local script can assign a meaningful title and default file name.
- Do not manually inspect workshop guides, instructor slides, or instructor notes to assemble the deck when `compose-module-slides.mjs` can do that work locally.
- Treat `compose-module-slides.mjs` as the source of truth for module discovery, validation, source coverage, and output paths.
- Keep generated content grounded in local workshop files, instructor slides, and instructor notes by invoking the local script rather than reconstructing content in chat.
- Treat HTML output as required for this workflow. Do not stop at markdown-only output.
- Prefer HTML slide delivery and do not treat PPTX generation as part of the standard workflow.
- `frontend-design` is the default handoff for generated instructor decks and must be used as a styling layer on top of composed instructor content, not as a content-rewrite workflow.
- Only bypass `frontend-design` when the user explicitly requests `skip-design-pass`.
- Prefer script output over manual hand-edits unless the user explicitly requests custom edits after generation.
- Keep chat output concise; let the script perform heavy content assembly, validation, and reporting to preserve tokens.
