#!/usr/bin/env node
import fs from "node:fs/promises";
import readline from "node:readline/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(skillDir, "..", "..", "..");
const instructorDir = path.join(repoRoot, "docs", ".instructor");
const slidesDir = path.join(instructorDir, "slides");
const workshopDir = path.join(repoRoot, "workshop");
const generatedDir = path.join(slidesDir, "generated");

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const inventory = await buildInventory();

  if (args.listModules) {
    printInventory(inventory);
    return;
  }

  const requestedModules = args.interactive
    ? await promptForModules(inventory)
    : args.modules;

  if (requestedModules.length === 0) {
    throw new Error("No modules provided. Use --modules m21,m22,m24 or pass --interactive.");
  }

  const modules = await resolveModules(requestedModules, inventory);

  const presentationName = args.presentationName?.trim();
  const deckTitle = args.title ?? presentationName ?? `Custom Instructor Deck: ${modules.map((m) => m.moduleId.toUpperCase()).join(" + ")}`;
  const defaultBaseName = presentationName
    ? `${slugifyPresentationName(presentationName)}-slides.md`
    : `${modules.map((m) => m.moduleId).join("-")}-slides.md`;
  const outputPath = args.output
    ? path.resolve(process.cwd(), args.output)
    : path.join(generatedDir, defaultBaseName);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, buildDeck(deckTitle, args.template, modules), "utf8");

  console.log(`Wrote markdown deck: ${outputPath}`);
  console.log(`Presentation name: ${presentationName ?? deckTitle}`);
  console.log(`Included modules: ${modules.map((m) => m.moduleId.toUpperCase()).join(", ")}`);
  printResolutionSummary(modules);
}

function parseArgs(argv) {
  const args = {
    modules: [],
    output: undefined,
    presentationName: undefined,
    title: undefined,
    template: "default",
    listModules: false,
    interactive: false,
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }

    if (token === "--list-modules") {
      args.listModules = true;
      continue;
    }

    if (token === "--interactive") {
      args.interactive = true;
      continue;
    }

    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      throw new Error(`Expected a value after ${token}.`);
    }

    if (token === "--modules") {
      args.modules.push(...next.split(/[\s,]+/).map((value) => value.trim()).filter(Boolean));
      i += 1;
      continue;
    }

    if (token === "--output") {
      args.output = next;
      i += 1;
      continue;
    }

    if (token === "--presentation-name") {
      args.presentationName = next;
      i += 1;
      continue;
    }

    if (token === "--title") {
      args.title = next;
      i += 1;
      continue;
    }

    if (token === "--template") {
      args.template = next;
      i += 1;
      continue;
    }

    throw new Error(`Unsupported argument: ${token}`);
  }

  return args;
}

async function buildInventory() {
  const slideFiles = (await fs.readdir(slidesDir))
    .filter((name) => name.endsWith("-slides.md"));
  const noteFiles = (await fs.readdir(instructorDir))
    .filter((name) => /^m\d{2}-.+-notes\.md$/i.test(name));
  const workshopFiles = (await fs.readdir(workshopDir))
    .filter((name) => /^m\d{2}-.+\.md$/i.test(name));

  const inventory = new Map();

  for (const fileName of slideFiles) {
    const moduleId = extractModuleId(fileName);
    if (!moduleId) {
      continue;
    }
    inventory.set(moduleId, {
      moduleId,
      slidePath: path.join(slidesDir, fileName),
      notePath: undefined,
      workshopPath: undefined
    });
  }

  for (const fileName of noteFiles) {
    const moduleId = extractModuleId(fileName);
    if (!moduleId) {
      continue;
    }
    const item = inventory.get(moduleId) ?? {
      moduleId,
      slidePath: undefined,
      notePath: undefined,
      workshopPath: undefined
    };
    item.notePath = path.join(instructorDir, fileName);
    inventory.set(moduleId, item);
  }

  for (const fileName of workshopFiles) {
    const moduleId = extractModuleId(fileName);
    if (!moduleId) {
      continue;
    }
    const item = inventory.get(moduleId) ?? {
      moduleId,
      slidePath: undefined,
      notePath: undefined,
      workshopPath: undefined
    };
    item.workshopPath = path.join(workshopDir, fileName);
    inventory.set(moduleId, item);
  }

  return new Map([...inventory.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

async function resolveModules(requestedModules, inventory) {
  const normalized = dedupePreserveOrder(requestedModules.map((value) => value.toLowerCase()));
  const resolved = [];

  for (const rawId of normalized) {
    const moduleId = /^m\d{2}$/i.test(rawId) ? rawId.toLowerCase() : normalizeToModuleId(rawId);
    if (!moduleId) {
      throw new Error(`Module '${rawId}' is ambiguous. Use values like m21,m22,m24.`);
    }

    const item = inventory.get(moduleId);
    if (!item) {
      throw new Error(`Unknown module '${moduleId}'. Run with --list-modules to see valid options.`);
    }
    if (!item.slidePath) {
      throw new Error(`Module '${moduleId}' has no slide markdown in ${slidesDir}.`);
    }

    const source = await fs.readFile(item.slidePath, "utf8");
    const noteContent = item.notePath ? await fs.readFile(item.notePath, "utf8") : "";
    const workshopContent = item.workshopPath ? await fs.readFile(item.workshopPath, "utf8") : "";

    resolved.push({
      moduleId,
      moduleTitle: extractFirstHeading(source) ?? prettyName(path.basename(item.slidePath)),
      slidePath: item.slidePath,
      notePath: item.notePath,
      workshopPath: item.workshopPath,
      facilitatorFocus: extractTopicsFromNotes(noteContent),
      workshopObjectives: extractObjectivesFromWorkshop(workshopContent),
      body: stripDeckPreambleAndTitle(source)
    });
  }

  return resolved;
}

function buildDeck(title, template, modules) {
  const agenda = modules
    .map((m) => `- ${m.moduleId.toUpperCase()} - ${m.moduleTitle}`)
    .join("\n");

  const prepContext = modules
    .map((m) => {
      const focus = m.facilitatorFocus.length > 0
        ? `Focus: ${m.facilitatorFocus.join("; ")}`
        : "Focus: Use module notes for facilitator talking points.";
      const objectives = m.workshopObjectives.length > 0
        ? `Workshop objectives: ${m.workshopObjectives.join("; ")}`
        : "Workshop objectives: Review the corresponding workshop module for exercises and outcomes.";
      return `- ${m.moduleId.toUpperCase()} - ${focus} ${objectives}`;
    })
    .join("\n");

  const moduleSections = modules
    .map((m) => [
      "---",
      "<!--",
      "layout: section",
      "-->",
      `## ${m.moduleId.toUpperCase()} - ${m.moduleTitle}`,
      "",
      "---",
      m.body.trim()
    ].join("\n"))
    .join("\n\n");

  return [
    "<!--",
    `title: \"${escapeQuotes(title)}\"`,
    `template: ${template}`,
    "-->",
    "",
    `# ${title}`,
    "",
    "---",
    "<!--",
    "layout: content",
    "-->",
    "## Agenda",
    "",
    agenda,
    "",
    "---",
    "<!--",
    "layout: content",
    "-->",
    "## Facilitator Prep Context",
    "",
    prepContext,
    "",
    "```speaker-notes",
    "This deck was generated from workshop module selection plus instructor slides and notes context.",
    "Use module notes and workshop guides to tailor delivery depth and exercise time.",
    "```",
    "",
    moduleSections,
    ""
  ].join("\n");
}

function stripDeckPreambleAndTitle(source) {
  let content = source.replace(/^\uFEFF/, "").trim();

  if (content.startsWith("<!--")) {
    content = content.replace(/^<!--[\s\S]*?-->\s*/u, "");
  }

  content = content.replace(/^#\s+.+\n+/u, "");
  return content.trim();
}

function extractFirstHeading(source) {
  const match = source.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : undefined;
}

function prettyName(fileName) {
  return fileName
    .replace(/-slides\.md$/i, "")
    .replace(/^m\d{2}-/i, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeToModuleId(input) {
  const match = input.match(/m\d{2}/i);
  return match ? match[0].toLowerCase() : undefined;
}

function extractModuleId(fileName) {
  const match = fileName.match(/^m\d{2}/i);
  return match ? match[0].toLowerCase() : undefined;
}

function extractTopicsFromNotes(noteContent) {
  if (!noteContent) {
    return [];
  }

  const block = noteContent.match(/- \*\*Topics:\*\*([\s\S]*?)(\n- \*\*|\n-->|$)/i);
  if (!block) {
    return [];
  }

  return block[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^-\s+/, "").trim())
    .slice(0, 4);
}

function extractObjectivesFromWorkshop(workshopContent) {
  if (!workshopContent) {
    return [];
  }

  const lines = workshopContent.split("\n").map((line) => line.trim());
  const bullets = [];

  for (const line of lines) {
    if (line.startsWith("- ") || line.startsWith("* ")) {
      bullets.push(line.replace(/^[-*]\s+/, "").trim());
    }
    if (bullets.length >= 3) {
      break;
    }
  }

  return bullets;
}

function dedupePreserveOrder(values) {
  const seen = new Set();
  const output = [];

  for (const value of values) {
    if (seen.has(value)) {
      continue;
    }
    seen.add(value);
    output.push(value);
  }

  return output;
}

function slugifyPresentationName(value) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "custom-instructor-deck";
}

function escapeQuotes(value) {
  return value.replaceAll("\"", "\\\"");
}

function printHelp() {
  console.log([
    "Compose a facilitator-ready multi-module instructor markdown deck from workshop module selection.",
    "",
    "Usage:",
    "  node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --modules m21,m22,m24 --presentation-name \"Agentic Automation Workshop\"",
    "  node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --interactive",
    "  node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --list-modules",
    "",
    "Options:",
    "  --modules             Required. Comma or space-separated module IDs.",
    "  --interactive         Ask which modules to include.",
    "  --list-modules        Show available modules discovered from workshop/slides/notes.",
    "  --presentation-name   Optional. Presentation name used for the deck title and default file name.",
    "  --output              Optional. Target markdown output path.",
    "  --title               Optional. Deck title override.",
    "  --template            Optional. Template name (default: default).",
    "  --help                Show this help message."
  ].join("\n"));
}

async function promptForModules(inventory) {
  printInventory(inventory);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question("Enter module IDs to include (comma-separated, e.g. m21,m22,m24): ");
  rl.close();

  return answer
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function printInventory(inventory) {
  console.log("Available modules:");
  for (const item of inventory.values()) {
    const flags = [
      item.slidePath ? "slides" : "no-slides",
      item.notePath ? "notes" : "no-notes",
      item.workshopPath ? "workshop" : "no-workshop"
    ];
    console.log(`  - ${item.moduleId.toUpperCase()} (${flags.join(", ")})`);
  }
}

function printResolutionSummary(modules) {
  console.log("Resolved context:");
  for (const module of modules) {
    console.log(`  - ${module.moduleId.toUpperCase()}:`);
    console.log(`      slides:   ${module.slidePath}`);
    console.log(`      notes:    ${module.notePath ?? "(not found)"}`);
    console.log(`      workshop: ${module.workshopPath ?? "(not found)"}`);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});