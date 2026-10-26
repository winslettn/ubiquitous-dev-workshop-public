#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateFromInput, lintInput } from "./generator.js";

interface CliArgs {
  command: "generate" | "lint";
  inputPath: string;
  outputPath?: string;
  templateId?: string;
}

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultInputPath = path.join(packageRoot, "..", "slides");
const defaultOutputPath = path.join(defaultInputPath, "generated");

if (isDirectExecution()) {
  const args = parseArgs(process.argv.slice(2));

  run(args).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
}

async function run(args: CliArgs): Promise<void> {
  if (args.command === "lint") {
    const decks = await lintInput(args.inputPath);
    for (const deck of decks) {
      console.log(`${path.basename(deck.sourcePath)} — ${deck.slides.length} slides — mode: ${deck.sourceMode}`);
      if (deck.warnings.length === 0) {
        console.log("  OK");
        continue;
      }

      for (const warning of deck.warnings) {
        console.log(`  - ${warning}`);
      }
    }
    return;
  }

  const generatedDecks = await generateFromInput({
    inputPath: args.inputPath,
    outputPath: args.outputPath,
    templateId: args.templateId
  });

  for (const generatedDeck of generatedDecks) {
    console.log(`${path.basename(generatedDeck.deck.sourcePath)} -> ${generatedDeck.outputPath}`);
    if (generatedDeck.deck.warnings.length > 0) {
      for (const warning of generatedDeck.deck.warnings) {
        console.log(`  - ${warning}`);
      }
    }
  }
}

function isDirectExecution(): boolean {
  return Boolean(process.argv[1]) && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

export function parseArgs(argv: string[]): CliArgs {
  const [commandArg, ...rest] = argv;
  const command = commandArg === "lint" ? "lint" : "generate";
  const options = new Map<string, string>();

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) {
      continue;
    }

    const nextValue = rest[index + 1];
    if (!nextValue || nextValue.startsWith("--")) {
      throw new Error(`Expected a value after ${token}.`);
    }

    options.set(token, nextValue);
    index += 1;
  }

  return {
    command,
    inputPath: options.get("--input") ?? defaultInputPath,
    outputPath: command === "generate" ? options.get("--output") ?? defaultOutputPath : undefined,
    templateId: options.get("--template")
  };
}
