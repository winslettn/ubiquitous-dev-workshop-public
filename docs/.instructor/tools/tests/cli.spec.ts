import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseArgs } from "../src/cli.js";

const packageRoot = path.resolve(import.meta.dirname, "..");

describe("parseArgs", () => {
  it("defaults input to the slides folder and output to the generated slides folder", () => {
    const args = parseArgs([]);

    expect(args).toEqual({
      command: "generate",
      inputPath: path.join(packageRoot, "..", "slides"),
      outputPath: path.join(packageRoot, "..", "slides", "generated"),
      templateId: undefined
    });
  });

  it("defaults lint input to the slides folder without setting an output path", () => {
    const args = parseArgs(["lint"]);

    expect(args).toEqual({
      command: "lint",
      inputPath: path.join(packageRoot, "..", "slides"),
      outputPath: undefined,
      templateId: undefined
    });
  });
});
