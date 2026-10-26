import type { PptxSlide } from "./types.js";

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MermaidNativeOptions {
  nodeFillColor: string;
  nodeBorderColor: string;
  textColor: string;
  edgeColor: string;
  fontFace: string;
  fontSize: number;
}

type Direction = "TD" | "TB" | "BT" | "LR" | "RL";
type NodeShape = "rect" | "roundRect";

interface MermaidNode {
  id: string;
  label: string;
  shape: NodeShape;
}

interface MermaidEdge {
  from: string;
  to: string;
}

interface MermaidGraph {
  direction: Direction;
  nodes: MermaidNode[];
  edges: MermaidEdge[];
}

interface NodePosition {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export function renderNativeMermaidFlowchart(
  slide: PptxSlide,
  source: string,
  region: Region,
  options: MermaidNativeOptions
): number | undefined {
  const graph = parseMermaidFlowchart(source);
  if (!graph) {
    return undefined;
  }

  const positions = layoutNodes(graph, region);

  for (const node of graph.nodes) {
    const pos = positions.get(node.id);
    if (!pos) {
      continue;
    }

    slide.addShape(node.shape, {
      x: pos.x,
      y: pos.y,
      w: pos.w,
      h: pos.h,
      line: { color: options.nodeBorderColor, pt: 1.5 },
      fill: { color: options.nodeFillColor }
    });

    slide.addText(node.label, {
      x: pos.x + 0.05,
      y: pos.y + 0.05,
      w: pos.w - 0.1,
      h: pos.h - 0.1,
      color: options.textColor,
      fontFace: options.fontFace,
      fontSize: options.fontSize,
      align: "center",
      valign: "mid",
      fit: "shrink",
      margin: 0
    });
  }

  for (const edge of graph.edges) {
    const from = positions.get(edge.from);
    const to = positions.get(edge.to);
    if (!from || !to) {
      continue;
    }

    const { startX, startY, endX, endY } = calculateEdgePoints(graph.direction, from, to);
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    if (Math.abs(deltaX) < 0.001 && Math.abs(deltaY) < 0.001) {
      continue;
    }

    const lineGeometry = normalizeLineGeometry(startX, startY, endX, endY);
    slide.addShape("line", {
      x: lineGeometry.x,
      y: lineGeometry.y,
      w: lineGeometry.w,
      h: lineGeometry.h,
      flipH: lineGeometry.flipH,
      flipV: lineGeometry.flipV,
      line: {
        color: options.edgeColor,
        pt: 1.5,
        beginArrowType: "none",
        endArrowType: "triangle"
      }
    });
  }

  return region.h;
}

function parseMermaidFlowchart(source: string): MermaidGraph | undefined {
  const rawLines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("%%"));

  if (rawLines.length === 0) {
    return undefined;
  }

  const header = rawLines[0].match(/^flowchart\s+(TD|TB|BT|LR|RL)\b/i);
  if (!header) {
    return undefined;
  }

  const direction = header[1].toUpperCase() as Direction;
  const nodesById = new Map<string, MermaidNode>();
  const nodeOrder: string[] = [];
  const edges: MermaidEdge[] = [];

  for (const line of rawLines.slice(1)) {
    if (/^(subgraph|end)\b/i.test(line)) {
      continue;
    }

    const edgeMatch = line.match(/^(.*?)\s*-->\s*(?:\|[^|]*\|\s*)?(.*?)\s*;?$/);
    if (edgeMatch) {
      const from = parseNodeToken(edgeMatch[1]);
      const to = parseNodeToken(edgeMatch[2]);
      if (from && to) {
        addNode(from, nodesById, nodeOrder);
        addNode(to, nodesById, nodeOrder);
        edges.push({ from: from.id, to: to.id });
      }
      continue;
    }

    const standalone = parseNodeToken(line.replace(/;$/, ""));
    if (standalone) {
      addNode(standalone, nodesById, nodeOrder);
    }
  }

  const nodes = nodeOrder
    .map((id) => nodesById.get(id))
    .filter((node): node is MermaidNode => Boolean(node));

  if (nodes.length === 0) {
    return undefined;
  }

  return { direction, nodes, edges };
}

function parseNodeToken(rawToken: string): MermaidNode | undefined {
  const token = rawToken.trim();
  if (!token) {
    return undefined;
  }

  const rect = token.match(/^([A-Za-z0-9_:-]+)\[(.+)\]$/);
  if (rect) {
    return { id: rect[1], label: normalizeLabel(rect[2]), shape: "rect" };
  }

  const round = token.match(/^([A-Za-z0-9_:-]+)\((.+)\)$/);
  if (round) {
    return { id: round[1], label: normalizeLabel(round[2]), shape: "roundRect" };
  }

  const plain = token.match(/^([A-Za-z0-9_:-]+)$/);
  if (plain) {
    return { id: plain[1], label: plain[1], shape: "rect" };
  }

  return undefined;
}

function normalizeLabel(label: string): string {
  return label
    .replace(/^["']|["']$/g, "")
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .trim();
}

function addNode(node: MermaidNode, nodesById: Map<string, MermaidNode>, order: string[]): void {
  const existing = nodesById.get(node.id);
  if (!existing) {
    nodesById.set(node.id, node);
    order.push(node.id);
    return;
  }

  if (existing.label === existing.id && node.label !== node.id) {
    existing.label = node.label;
    existing.shape = node.shape;
  }
}

function layoutNodes(graph: MermaidGraph, region: Region): Map<string, NodePosition> {
  const horizontal = graph.direction === "LR" || graph.direction === "RL";
  const reverse = graph.direction === "RL" || graph.direction === "BT";
  const orderedNodes = graph.nodes;
  const orderById = new Map<string, number>(orderedNodes.map((node, index) => [node.id, index]));
  const positions = new Map<string, NodePosition>();
  const levelsById = assignNodeLevels(graph, orderedNodes);
  const maxLevel = Math.max(0, ...Array.from(levelsById.values()));
  const { predecessorsById, successorsById } = buildAdjacency(graph, orderedNodes);
  const nodesByLevel = groupNodesByLevel(orderedNodes, levelsById, maxLevel);
  const orderedIdsByLevel = buildLevelOrdering(
    nodesByLevel,
    levelsById,
    predecessorsById,
    successorsById,
    orderById,
    maxLevel
  );
  const maxNodesInLevel = Math.max(1, ...orderedIdsByLevel.map((nodes) => nodes.length));
  const majorLaneCount = maxLevel + 1;

  if (horizontal) {
    const laneW = region.w / majorLaneCount;
    const laneH = region.h / maxNodesInLevel;
    const nodeW = Math.max(1.2, Math.min(2.6, laneW * 0.68));
    const nodeH = Math.max(0.5, Math.min(0.95, laneH * 0.72));

    for (let level = 0; level <= maxLevel; level += 1) {
      const nodes = orderedIdsByLevel[level] ?? [];
      if (nodes.length === 0) {
        continue;
      }

      const displayLevel = reverse ? maxLevel - level : level;
      const x = region.x + laneW * displayLevel + (laneW - nodeW) / 2;
      const levelLaneH = region.h / nodes.length;
      for (let index = 0; index < nodes.length; index += 1) {
        const y = region.y + index * levelLaneH + (levelLaneH - nodeH) / 2;
        positions.set(nodes[index]!, toNodePosition(x, y, nodeW, nodeH));
      }
    }

    return positions;
  }

  const laneH = region.h / majorLaneCount;
  const laneW = region.w / maxNodesInLevel;
  const nodeH = Math.max(0.46, Math.min(0.85, laneH * 0.62));
  const nodeW = Math.max(1.8, Math.min(4.2, laneW * 0.78));

  for (let level = 0; level <= maxLevel; level += 1) {
    const nodes = orderedIdsByLevel[level] ?? [];
    if (nodes.length === 0) {
      continue;
    }

    const displayLevel = reverse ? maxLevel - level : level;
    const y = region.y + laneH * displayLevel + (laneH - nodeH) / 2;
    const levelLaneW = region.w / nodes.length;
    for (let index = 0; index < nodes.length; index += 1) {
      const x = region.x + index * levelLaneW + (levelLaneW - nodeW) / 2;
      positions.set(nodes[index]!, toNodePosition(x, y, nodeW, nodeH));
    }
  }

  return positions;
}

function assignNodeLevels(graph: MermaidGraph, orderedNodes: MermaidNode[]): Map<string, number> {
  const levels = new Map<string, number>();
  const indegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of orderedNodes) {
    levels.set(node.id, 0);
    indegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  for (const edge of graph.edges) {
    if (!levels.has(edge.from) || !levels.has(edge.to)) {
      continue;
    }

    adjacency.get(edge.from)!.push(edge.to);
    indegree.set(edge.to, (indegree.get(edge.to) ?? 0) + 1);
  }

  const queue: string[] = orderedNodes
    .filter((node) => (indegree.get(node.id) ?? 0) === 0)
    .map((node) => node.id);
  let queueIndex = 0;

  while (queueIndex < queue.length) {
    const nodeId = queue[queueIndex++]!;
    const nextNodes = adjacency.get(nodeId) ?? [];
    const fromLevel = levels.get(nodeId) ?? 0;
    for (const nextId of nextNodes) {
      levels.set(nextId, Math.max(levels.get(nextId) ?? 0, fromLevel + 1));
      const nextIndegree = (indegree.get(nextId) ?? 0) - 1;
      indegree.set(nextId, nextIndegree);
      if (nextIndegree === 0) {
        queue.push(nextId);
      }
    }
  }

  return levels;
}

function normalizeLineGeometry(startX: number, startY: number, endX: number, endY: number): {
  x: number;
  y: number;
  w: number;
  h: number;
  flipH?: boolean;
  flipV?: boolean;
} {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const minExtent = 0.001;

  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const w = Math.max(Math.abs(deltaX), minExtent);
  const h = Math.max(Math.abs(deltaY), minExtent);

  return {
    x,
    y,
    w,
    h,
    flipH: deltaX < 0 ? true : undefined,
    flipV: deltaY < 0 ? true : undefined
  };
}

function buildAdjacency(
  graph: MermaidGraph,
  nodes: MermaidNode[]
): {
  predecessorsById: Map<string, string[]>;
  successorsById: Map<string, string[]>;
} {
  const predecessorsById = new Map<string, string[]>();
  const successorsById = new Map<string, string[]>();
  for (const node of nodes) {
    predecessorsById.set(node.id, []);
    successorsById.set(node.id, []);
  }

  for (const edge of graph.edges) {
    if (!predecessorsById.has(edge.to) || !successorsById.has(edge.from)) {
      continue;
    }

    predecessorsById.get(edge.to)!.push(edge.from);
    successorsById.get(edge.from)!.push(edge.to);
  }

  return { predecessorsById, successorsById };
}

function groupNodesByLevel(
  orderedNodes: MermaidNode[],
  levelsById: Map<string, number>,
  maxLevel: number
): string[][] {
  const grouped: string[][] = Array.from({ length: maxLevel + 1 }, () => []);
  for (const node of orderedNodes) {
    const level = levelsById.get(node.id) ?? 0;
    grouped[level]!.push(node.id);
  }
  return grouped;
}

function buildLevelOrdering(
  nodesByLevel: string[][],
  levelsById: Map<string, number>,
  predecessorsById: Map<string, string[]>,
  successorsById: Map<string, string[]>,
  orderById: Map<string, number>,
  maxLevel: number
): string[][] {
  const ordered = nodesByLevel.map((nodes) => [...nodes]);
  const sweeps = 4;
  for (let sweep = 0; sweep < sweeps; sweep += 1) {
    for (let level = 1; level <= maxLevel; level += 1) {
      sortLevelByNeighborBarycenter(ordered, level, predecessorsById, levelsById, orderById, -1);
    }
    for (let level = maxLevel - 1; level >= 0; level -= 1) {
      sortLevelByNeighborBarycenter(ordered, level, successorsById, levelsById, orderById, 1);
    }
  }

  return ordered;
}

function sortLevelByNeighborBarycenter(
  orderedByLevel: string[][],
  level: number,
  neighborsById: Map<string, string[]>,
  levelsById: Map<string, number>,
  orderById: Map<string, number>,
  levelOffset: 1 | -1
): void {
  const current = orderedByLevel[level];
  const neighborLevel = orderedByLevel[level + levelOffset];
  if (!current || current.length <= 1 || !neighborLevel) {
    return;
  }

  const neighborOrder = new Map<string, number>(neighborLevel.map((id, index) => [id, index]));

  current.sort((a, b) => {
    const aBary = calculateBarycenterForLevel(a, level, neighborsById, levelsById, neighborOrder);
    const bBary = calculateBarycenterForLevel(b, level, neighborsById, levelsById, neighborOrder);
    if (aBary !== bBary) {
      return aBary - bBary;
    }

    return (orderById.get(a) ?? 0) - (orderById.get(b) ?? 0);
  });
}

function calculateBarycenterForLevel(
  nodeId: string,
  nodeLevel: number,
  neighborsById: Map<string, string[]>,
  levelsById: Map<string, number>,
  neighborOrder: Map<string, number>
): number {
  const neighbors = neighborsById.get(nodeId) ?? [];
  const relatedOrders = neighbors
    .filter((neighborId) => Math.abs((levelsById.get(neighborId) ?? 0) - nodeLevel) === 1)
    .map((neighborId) => neighborOrder.get(neighborId))
    .filter((value): value is number => value !== undefined);

  if (relatedOrders.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  const sum = relatedOrders.reduce((total, value) => total + value, 0);
  return sum / relatedOrders.length;
}

function toNodePosition(x: number, y: number, w: number, h: number): NodePosition {
  return {
    x,
    y,
    w,
    h,
    cx: x + w / 2,
    cy: y + h / 2
  };
}

function calculateEdgePoints(direction: Direction, from: NodePosition, to: NodePosition): {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
} {
  const horizontal = direction === "LR" || direction === "RL";

  if (horizontal) {
    const leftToRight = from.cx <= to.cx;
    return {
      startX: leftToRight ? from.x + from.w : from.x,
      startY: from.cy,
      endX: leftToRight ? to.x : to.x + to.w,
      endY: to.cy
    };
  }

  const topToBottom = from.cy <= to.cy;
  return {
    startX: from.cx,
    startY: topToBottom ? from.y + from.h : from.y,
    endX: to.cx,
    endY: topToBottom ? to.y : to.y + to.h
  };
}
