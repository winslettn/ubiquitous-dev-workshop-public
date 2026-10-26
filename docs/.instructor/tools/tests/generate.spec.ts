import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { generateFromInput, lintInput } from "../src/generator.js";

describe("generateFromInput", () => {
  it("expands wildcard input patterns for generate and writes each match to the generated folder", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-wildcard-generate-"));
    const inputDirectory = path.join(tempDirectory, "slides");

    await import("node:fs/promises").then((fs) => fs.mkdir(inputDirectory, { recursive: true }));
    await writeFile(path.join(inputDirectory, "m10-alpha.md"), "# Alpha Deck\n", "utf8");
    await writeFile(path.join(inputDirectory, "m11-beta.md"), "# Beta Deck\n", "utf8");
    await writeFile(path.join(inputDirectory, "m20-gamma.md"), "# Gamma Deck\n", "utf8");

    const generated = await generateFromInput({
      inputPath: path.join(inputDirectory, "m1*.md")
    });

    expect(generated.map((deck) => path.basename(deck.deck.sourcePath))).toEqual(["m10-alpha.md", "m11-beta.md"]);
    expect(generated.map((deck) => deck.outputPath)).toEqual([
      path.join(inputDirectory, "generated", "m10-alpha.pptx"),
      path.join(inputDirectory, "generated", "m11-beta.pptx")
    ]);

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("expands wildcard input patterns for lint", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-wildcard-lint-"));
    const inputDirectory = path.join(tempDirectory, "slides");

    await import("node:fs/promises").then((fs) => fs.mkdir(inputDirectory, { recursive: true }));
    await writeFile(path.join(inputDirectory, "m10-alpha.md"), "# Alpha Deck\n", "utf8");
    await writeFile(path.join(inputDirectory, "m11-beta.md"), "# Beta Deck\n", "utf8");
    await writeFile(path.join(inputDirectory, "m20-gamma.md"), "# Gamma Deck\n", "utf8");

    const decks = await lintInput(path.join(inputDirectory, "m1*.md"));

    expect(decks.map((deck) => path.basename(deck.sourcePath))).toEqual(["m10-alpha.md", "m11-beta.md"]);

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("defaults a directory input to a generated subfolder inside that directory", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-default-dir-output-"));
    const inputDirectory = path.join(tempDirectory, "slides");
    const inputPath = path.join(inputDirectory, "demo.md");

    await import("node:fs/promises").then((fs) => fs.mkdir(inputDirectory, { recursive: true }));
    await writeFile(
      inputPath,
      `# Demo Deck

---
## Demo Slide

- One
`,
      "utf8"
    );

    const [generated] = await generateFromInput({
      inputPath: inputDirectory
    });

    const expectedOutputPath = path.join(inputDirectory, "generated", "demo.pptx");
    expect(generated.outputPath).toBe(expectedOutputPath);

    const stats = await import("node:fs/promises").then((fs) => fs.stat(expectedOutputPath));
    expect(stats.size).toBeGreaterThan(0);

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("defaults a single file input to a generated sibling folder", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-default-file-output-"));
    const inputDirectory = path.join(tempDirectory, "slides");
    const inputPath = path.join(inputDirectory, "demo.md");

    await import("node:fs/promises").then((fs) => fs.mkdir(inputDirectory, { recursive: true }));
    await writeFile(
      inputPath,
      `# Demo Deck

---
## Demo Slide

- One
`,
      "utf8"
    );

    const [generated] = await generateFromInput({
      inputPath
    });

    const expectedOutputPath = path.join(inputDirectory, "generated", "demo.pptx");
    expect(generated.outputPath).toBe(expectedOutputPath);

    const stats = await import("node:fs/promises").then((fs) => fs.stat(expectedOutputPath));
    expect(stats.size).toBeGreaterThan(0);

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("writes a pptx file for a markdown deck", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-"));
    const inputPath = path.join(tempDirectory, "demo.md");
    const outputPath = path.join(tempDirectory, "demo.pptx");

    await writeFile(
      inputPath,
      `<!--
title: Demo Deck
-->
# Demo Deck

---
<!--
template: default
layout: section
-->
## Part 2: Demo Flow

- One
- Two

\`\`\`speaker-notes
- **Bold note** item
  - *Nested* note item
\`\`\`
`,
  "utf8"
);

    const [generated] = await generateFromInput({
      inputPath,
      outputPath
    });

    expect(generated.outputPath).toBe(outputPath);

    const stats = await import("node:fs/promises").then((fs) => fs.stat(outputPath));
    expect(stats.size).toBeGreaterThan(0);

    const pptxBuffer = await import("node:fs/promises").then((fs) => fs.readFile(outputPath));
    const zip = await JSZip.loadAsync(pptxBuffer);
    const notesXml = await zip.file("ppt/notesSlides/notesSlide2.xml")?.async("string");
    expect(notesXml).toBeDefined();
    expect(notesXml).toContain('<a:buChar char="•"/>');
    expect(notesXml).toContain('b="1"');
    expect(notesXml).toContain('i="1"');

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("marks slide titles as PowerPoint title placeholders", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-title-placeholder-"));
    const inputPath = path.join(tempDirectory, "title-placeholder.md");
    const outputPath = path.join(tempDirectory, "title-placeholder.pptx");

    await writeFile(
      inputPath,
      `<!--
title: Demo Deck
-->
# Demo Deck

---
## Security Overview

<!--
layout: section
-->

---
## Application Security

- Main point
`,
      "utf8"
    );

    await generateFromInput({
      inputPath,
      outputPath
    });

    const pptxBuffer = await import("node:fs/promises").then((fs) => fs.readFile(outputPath));
    const zip = await JSZip.loadAsync(pptxBuffer);
    const sectionSlideXml = await zip.file("ppt/slides/slide2.xml")?.async("string");
    const contentSlideXml = await zip.file("ppt/slides/slide3.xml")?.async("string");

    expect(sectionSlideXml).toContain('type="title"');
    expect(contentSlideXml).toContain('type="title"');

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("renders references only once when separated by blank lines", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-refs-"));
    const inputPath = path.join(tempDirectory, "refs.md");
    const outputPath = path.join(tempDirectory, "refs.pptx");

    await writeFile(
      inputPath,
      `# References Deck

---
## Slide With References

- Main point

References:


- https://docs.github.com/en/code-security
`,
      "utf8"
    );

    await generateFromInput({
      inputPath,
      outputPath
    });

    const pptxBuffer = await import("node:fs/promises").then((fs) => fs.readFile(outputPath));
    const zip = await JSZip.loadAsync(pptxBuffer);
    const slideXml = await zip.file("ppt/slides/slide2.xml")?.async("string");
    expect(slideXml).toBeDefined();
    const referencesMatches = slideXml?.match(/References:/g) ?? [];
    expect(referencesMatches).toHaveLength(1);

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("keeps 'Why this matters:' in body and renders only explicit references in footer", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-ref-label-"));
    const inputPath = path.join(tempDirectory, "why-this-matters.md");
    const outputPath = path.join(tempDirectory, "why-this-matters.pptx");

    await writeFile(
      inputPath,
      `# Why This Matters Deck

---
## Application Security

- Context bullet

Why this matters:

- Source A
- Source B

References:

- https://docs.github.com/en/code-security
`,
      "utf8"
    );

    await generateFromInput({
      inputPath,
      outputPath
    });

    const pptxBuffer = await import("node:fs/promises").then((fs) => fs.readFile(outputPath));
    const zip = await JSZip.loadAsync(pptxBuffer);
    const slideXml = await zip.file("ppt/slides/slide2.xml")?.async("string");
    expect(slideXml).toBeDefined();
    const whyMatches = slideXml?.match(/Why this matters:/g) ?? [];
    const sourceAMatches = slideXml?.match(/Source A/g) ?? [];
    const referencesMatches = slideXml?.match(/References:/g) ?? [];
    const docsLinkMatches = slideXml?.match(/https:\/\/docs\.github\.com\/en\/code-security/g) ?? [];
    expect(whyMatches).toHaveLength(1);
    expect(sourceAMatches).toHaveLength(1);
    expect(referencesMatches).toHaveLength(1);
    expect(docsLinkMatches).toHaveLength(1);

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("continues a trailing label+list in the existing body list textbox", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-body-list-continuation-"));
    const inputPath = path.join(tempDirectory, "body-list-continuation.md");
    const outputPath = path.join(tempDirectory, "body-list-continuation.pptx");

    await writeFile(
      inputPath,
      `# Body Continuation Deck

---
## Application Security

- Existing bullet one
- Existing bullet two

Why this matters:

- Source A
- Source B

References:

- https://docs.github.com/en/code-security
`,
      "utf8"
    );

    await generateFromInput({
      inputPath,
      outputPath
    });

    const pptxBuffer = await import("node:fs/promises").then((fs) => fs.readFile(outputPath));
    const zip = await JSZip.loadAsync(pptxBuffer);
    const slideXml = await zip.file("ppt/slides/slide2.xml")?.async("string");
    expect(slideXml).toBeDefined();

    const textBodies = (slideXml ?? "")
      .split("<p:txBody>")
      .slice(1)
      .map((part) => part.split("</p:txBody>")[0] ?? "");

    const bodyWithContinuation = textBodies.some(
      (body) =>
        body.includes("Existing bullet one") &&
        body.includes("Why this matters:") &&
        body.includes("Source A")
    );

    expect(bodyWithContinuation).toBe(true);

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("renders labelled lists as native bullets in a single shared content textbox", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-native-bullets-"));
    const inputPath = path.join(tempDirectory, "native-bullets.md");
    const outputPath = path.join(tempDirectory, "native-bullets.pptx");

    await writeFile(
      inputPath,
      `# Native Bullets Deck

---
## Application Security

Common vulnerability classes in application code:

- **Leaked credentials and secrets:** hard-coded keys.
- Application code vulnerabilities.

Why this matters:

- Source A
- Source B

References:

- https://docs.github.com/en/code-security
`,
      "utf8"
    );

    await generateFromInput({
      inputPath,
      outputPath
    });

    const pptxBuffer = await import("node:fs/promises").then((fs) => fs.readFile(outputPath));
    const zip = await JSZip.loadAsync(pptxBuffer);
    const slideXml = await zip.file("ppt/slides/slide2.xml")?.async("string");
    expect(slideXml).toBeDefined();

    const textBodies = (slideXml ?? "")
      .split("<p:txBody>")
      .slice(1)
      .map((part) => part.split("</p:txBody>")[0] ?? "");

    // Both labelled lists live in one content textbox using native bullets (buChar),
    // not literal "• " characters baked into the text.
    const contentBody = textBodies.find(
      (body) =>
        body.includes("Common vulnerability classes in application code:") &&
        body.includes("Why this matters:")
    );
    expect(contentBody).toBeDefined();
    const buCharCount = (contentBody?.match(/<a:buChar/g) ?? []).length;
    expect(buCharCount).toBe(4);
    expect(contentBody?.includes("<a:t>\u2022")).toBe(false);

    // References remain in their own footer textbox.
    const referencesBody = textBodies.find((body) => body.includes("References:"));
    expect(referencesBody).toBeDefined();
    expect(referencesBody).not.toBe(contentBody);

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("renders multi-line table cells and on-page images", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-table-image-"));
    const inputPath = path.join(tempDirectory, "table-image.md");
    const outputPath = path.join(tempDirectory, "table-image.pptx");

    // 1x1 transparent PNG so the image actually embeds (no placeholder fallback).
    const pngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const assetsDir = path.join(tempDirectory, "assets");
    await import("node:fs/promises").then((fs) => fs.mkdir(assetsDir, { recursive: true }));
    await writeFile(path.join(assetsDir, "dashboard.png"), Buffer.from(pngBase64, "base64"));

    await writeFile(
      inputPath,
      `# Table & Image Deck

---
<!--
layout: table
-->
## Scope Matrix

| Scope | Enterprise |
| --- | --- |
| Dependabot | Alerts in configs<br>Centralized credentials |

---
## Dashboard

- Supporting copy

![Dashboard screenshot](assets/dashboard.png)
`,
      "utf8"
    );

    await generateFromInput({ inputPath, outputPath });

    const pptxBuffer = await import("node:fs/promises").then((fs) => fs.readFile(outputPath));
    const zip = await JSZip.loadAsync(pptxBuffer);

    // Slide 2: table cell with a <br> renders as two paragraphs in one cell.
    const tableSlideXml = (await zip.file("ppt/slides/slide2.xml")?.async("string")) ?? "";
    expect(tableSlideXml).toContain("<a:tbl>");
    const cellStart = tableSlideXml.indexOf("Alerts in configs");
    const cellOpen = tableSlideXml.lastIndexOf("<a:tc>", cellStart);
    const cellClose = tableSlideXml.indexOf("</a:tc>", cellStart) + "</a:tc>".length;
    const cellXml = tableSlideXml.slice(cellOpen, cellClose);
    expect((cellXml.match(/<a:p>/g) ?? []).length).toBe(2);
    expect(cellXml).toContain("Alerts in configs");
    expect(cellXml).toContain("Centralized credentials");

    // Slide 3: the image is embedded as a picture (not the dashed placeholder).
    const imageSlideXml = (await zip.file("ppt/slides/slide3.xml")?.async("string")) ?? "";
    expect(imageSlideXml).toContain("<p:pic>");
    expect(imageSlideXml).toContain("r:embed");
    expect(imageSlideXml).toContain("Supporting copy");

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("marks slides with hidden metadata as hidden in the pptx", async () => {
    const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "slides-pptx-hidden-"));
    const inputPath = path.join(tempDirectory, "hidden.md");
    const outputPath = path.join(tempDirectory, "hidden.pptx");

    await writeFile(
      inputPath,
      `# Backup Deck

---
## Visible Slide

- Shown in delivery

---
<!--
layout: content
hidden: true
-->
## Backup Slide

- Kept for handoff only
`,
      "utf8"
    );

    await generateFromInput({ inputPath, outputPath });

    const pptxBuffer = await import("node:fs/promises").then((fs) => fs.readFile(outputPath));
    const zip = await JSZip.loadAsync(pptxBuffer);

    const visibleXml = (await zip.file("ppt/slides/slide2.xml")?.async("string")) ?? "";
    const hiddenXml = (await zip.file("ppt/slides/slide3.xml")?.async("string")) ?? "";

    expect(visibleXml).not.toContain('show="0"');
    expect(hiddenXml).toContain('show="0"');
    expect(visibleXml).not.toContain("Backup Deck");
    expect(hiddenXml).not.toContain("Backup Deck");
    expect(visibleXml).not.toContain("hidden.md");
    expect(hiddenXml).not.toContain("hidden.md");
    expect(visibleXml).not.toContain("HIDDEN");
    expect(hiddenXml).not.toContain("HIDDEN");
    expect(visibleXml).not.toContain("Hidden slide");
    expect(hiddenXml).not.toContain("Hidden slide");

    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("omits slide footers and hidden labels in both templates", async () => {
    for (const template of ["default", "caip"] as const) {
      const tempDirectory = await mkdtemp(path.join(os.tmpdir(), `slides-pptx-footerless-${template}-`));
      const inputPath = path.join(tempDirectory, "footerless.md");
      const outputPath = path.join(tempDirectory, "footerless.pptx");

      await writeFile(
        inputPath,
        `<!--
title: Footerless Deck
template: ${template}
-->
# Footerless Deck

---
## Visible Slide

- Shown in delivery

---
<!--
hidden: true
-->
## Backup Slide

- Kept for handoff only
`,
        "utf8"
      );

      await generateFromInput({ inputPath, outputPath });

      const pptxBuffer = await import("node:fs/promises").then((fs) => fs.readFile(outputPath));
      const zip = await JSZip.loadAsync(pptxBuffer);
      const visibleXml = (await zip.file("ppt/slides/slide2.xml")?.async("string")) ?? "";
      const hiddenXml = (await zip.file("ppt/slides/slide3.xml")?.async("string")) ?? "";

      expect(visibleXml).not.toContain("Footerless Deck");
      expect(hiddenXml).not.toContain("Footerless Deck");
      expect(visibleXml).not.toContain("footerless.md");
      expect(hiddenXml).not.toContain("footerless.md");
      expect(visibleXml).not.toContain("HIDDEN");
      expect(hiddenXml).not.toContain("HIDDEN");
      expect(visibleXml).not.toContain("Hidden slide");
      expect(hiddenXml).not.toContain("Hidden slide");

      await rm(tempDirectory, { recursive: true, force: true });
    }
  });
});
