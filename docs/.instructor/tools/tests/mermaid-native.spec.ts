import { describe, expect, it } from "vitest";
import { renderNativeMermaidFlowchart } from "../src/mermaid-native.js";
import type { PptxSlide, PptxTextRun } from "../src/types.js";

interface ShapeCall {
  shapeName: string;
  options: Record<string, unknown>;
}

interface TextCall {
  text: string;
  options: Record<string, unknown>;
}

function createSlideRecorder(): { slide: PptxSlide; shapes: ShapeCall[]; texts: TextCall[] } {
  const shapes: ShapeCall[] = [];
  const texts: TextCall[] = [];
  const slide: PptxSlide = {
    addShape(shapeName: string, options: Record<string, unknown>) {
      shapes.push({ shapeName, options });
      return undefined;
    },
    addText(text: string | PptxTextRun[], options: Record<string, unknown>) {
      if (typeof text === "string") {
        texts.push({ text, options });
      }
      return undefined;
    },
    addTable() {
      return undefined;
    },
    addImage() {
      return undefined;
    },
    addNotes() {
      return undefined;
    }
  };
  return { slide, shapes, texts };
}

describe("renderNativeMermaidFlowchart", () => {
  it("uses line shapes with triangle arrowheads for edges", () => {
    const { slide, shapes } = createSlideRecorder();

    renderNativeMermaidFlowchart(
      slide,
      `flowchart LR
        A[Start] --> B[Middle]
        B --> C[End]`,
      { x: 1, y: 1, w: 8, h: 4 },
      {
        nodeFillColor: "E2E8F0",
        nodeBorderColor: "334155",
        textColor: "0F172A",
        edgeColor: "334155",
        fontFace: "Aptos",
        fontSize: 14
      }
    );

    const edgeShapes = shapes.filter((shape) => shape.shapeName === "line");
    expect(edgeShapes.length).toBe(2);
    for (const edge of edgeShapes) {
      expect(edge.options.line).toMatchObject({
        beginArrowType: "none",
        endArrowType: "triangle"
      });
      expect(Number(edge.options.w)).toBeGreaterThan(0);
      expect(Number(edge.options.h)).toBeGreaterThan(0);
    }
  });

  it("spreads branched nodes across multiple lanes instead of a single line", () => {
    const { slide, shapes } = createSlideRecorder();

    renderNativeMermaidFlowchart(
      slide,
      `flowchart TB
        A[Start] --> B[Path 1]
        A --> C[Path 2]
        B --> D[Done]
        C --> D`,
      { x: 1, y: 1, w: 8, h: 5 },
      {
        nodeFillColor: "E2E8F0",
        nodeBorderColor: "334155",
        textColor: "0F172A",
        edgeColor: "334155",
        fontFace: "Aptos",
        fontSize: 14
      }
    );

    const nodeRects = shapes.filter((shape) => shape.shapeName === "rect");
    const uniqueX = new Set(nodeRects.map((shape) => Number(shape.options.x).toFixed(3)));
    const uniqueY = new Set(nodeRects.map((shape) => Number(shape.options.y).toFixed(3)));

    expect(nodeRects.length).toBe(4);
    expect(uniqueX.size).toBeGreaterThan(1);
    expect(uniqueY.size).toBeGreaterThan(2);
  });

  it("honors reverse horizontal direction (RL)", () => {
    const { slide, texts } = createSlideRecorder();

    renderNativeMermaidFlowchart(
      slide,
      `flowchart RL
        A[Start] --> B[End]`,
      { x: 1, y: 1, w: 8, h: 3 },
      {
        nodeFillColor: "E2E8F0",
        nodeBorderColor: "334155",
        textColor: "0F172A",
        edgeColor: "334155",
        fontFace: "Aptos",
        fontSize: 14
      }
    );

    const start = texts.find((call) => call.text === "Start");
    const end = texts.find((call) => call.text === "End");
    expect(start).toBeDefined();
    expect(end).toBeDefined();
    expect(Number(start?.options.x)).toBeGreaterThan(Number(end?.options.x));
  });

  it("keeps sibling ordering stable with parent branches", () => {
    const { slide, texts } = createSlideRecorder();

    renderNativeMermaidFlowchart(
      slide,
      `flowchart TB
        A[Root] --> B[Left]
        A --> C[Right]
        B --> D[Leaf L]
        C --> E[Leaf R]`,
      { x: 1, y: 1, w: 8, h: 5 },
      {
        nodeFillColor: "E2E8F0",
        nodeBorderColor: "334155",
        textColor: "0F172A",
        edgeColor: "334155",
        fontFace: "Aptos",
        fontSize: 14
      }
    );

    const left = texts.find((call) => call.text === "Left");
    const right = texts.find((call) => call.text === "Right");
    const leafLeft = texts.find((call) => call.text === "Leaf L");
    const leafRight = texts.find((call) => call.text === "Leaf R");
    expect(left).toBeDefined();
    expect(right).toBeDefined();
    expect(leafLeft).toBeDefined();
    expect(leafRight).toBeDefined();
    expect(Number(left?.options.x)).toBeLessThan(Number(right?.options.x));
    expect(Number(leafLeft?.options.x)).toBeLessThan(Number(leafRight?.options.x));
  });

  it("normalizes reverse-direction edges to non-negative line extents", () => {
    const { slide, shapes } = createSlideRecorder();

    renderNativeMermaidFlowchart(
      slide,
      `flowchart RL
        A[Start] --> B[Middle]
        B --> C[End]`,
      { x: 1, y: 1, w: 8, h: 4 },
      {
        nodeFillColor: "E2E8F0",
        nodeBorderColor: "334155",
        textColor: "0F172A",
        edgeColor: "334155",
        fontFace: "Aptos",
        fontSize: 14
      }
    );

    const edgeShapes = shapes.filter((shape) => shape.shapeName === "line");
    expect(edgeShapes.length).toBe(2);
    for (const edge of edgeShapes) {
      expect(Number(edge.options.w)).toBeGreaterThan(0);
      expect(Number(edge.options.h)).toBeGreaterThan(0);
    }
  });

  it("renders escaped newline sequences in labels as actual new lines", () => {
    const { slide, texts } = createSlideRecorder();

    renderNativeMermaidFlowchart(
      slide,
      `flowchart LR
        A[Line 1\\nLine 2] --> B[End]`,
      { x: 1, y: 1, w: 8, h: 4 },
      {
        nodeFillColor: "E2E8F0",
        nodeBorderColor: "334155",
        textColor: "0F172A",
        edgeColor: "334155",
        fontFace: "Aptos",
        fontSize: 14
      }
    );

    const multilineLabel = texts.find((call) => call.text.includes("Line 1"));
    expect(multilineLabel).toBeDefined();
    expect(multilineLabel?.text).toContain("Line 1\nLine 2");
  });
});
