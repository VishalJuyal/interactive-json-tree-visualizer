import { Edge } from "reactflow";

export type NodeType = "object" | "array" | "primitive";

export interface NodeInfo {
  label: string;
  value?: unknown;
  type: NodeType;
  jsonPath: string;
  highlighted?: boolean;
}

export interface GraphNode {
  id: string;
  type: NodeType | "primitive";
  position: { x: number; y: number };
  data: NodeInfo;
}

export function buildGraphFromJson(
  data: any,
  path: string = "$",
  x: number = 0,
  y: number = 0,
  nodes: GraphNode[] = [],
  edges: Edge[] = [],
  parentId: string | null = null,
  seenObjects = new WeakMap()
): { nodes: GraphNode[]; edges: Edge[]; maxY: number } {
  const nodeId = path;
  const isArray = Array.isArray(data);
  const isObject = data !== null && typeof data === "object" && !isArray;
  const isPrimitive = !isArray && !isObject;

  const nodeType: NodeType = isArray ? "array" : isObject ? "object" : "primitive";

  if (isPrimitive) {
    nodes.push({
      id: nodeId,
      type: "primitive",
      position: { x, y },
      data: {
        label: nodeId.split(".").pop() || nodeId.split("[").pop()?.replace("]", "") || "",
        value: data,
        type: "primitive",
        jsonPath: path,
      },
    });

    if (parentId) {
      edges.push({ id: `${parentId}-${nodeId}`, source: parentId, target: nodeId });
    }

    return { nodes, edges, maxY: y };
  }

  if (seenObjects.has(data)) {
    return { nodes, edges, maxY: y };
  }
  seenObjects.set(data, true);

  nodes.push({
    id: nodeId,
    type: nodeType,
    position: { x, y },
    data: {
      label: nodeId.split(".").pop() || nodeId.split("[").pop()?.replace("]", "") || "",
      type: nodeType,
      jsonPath: path,
    },
  });

  if (parentId) {
    edges.push({ id: `${parentId}-${nodeId}`, source: parentId, target: nodeId });
  }

  let currentY = y + 120;
  const keys = isArray ? Object.keys(data).map((_, i) => i) : Object.keys(data);
  const nodeWidth = 120;
  const startX = x - ((keys.length - 1) * nodeWidth) / 2;

  keys.forEach((key, index) => {
    const childPath = isArray ? `${path}[${key}]` : `${path}.${key}`;
    const childX = startX + index * nodeWidth;
    const result = buildGraphFromJson(
      (data as any)?.[key],
      childPath,
      childX,
      currentY,
      nodes,
      edges,
      nodeId,
      seenObjects
    );
    currentY = Math.max(currentY, result.maxY + 120);
  });

  return { nodes, edges, maxY: currentY };
}

export function getValueAtPath(data: any, userPath: string): any {
  const normalizedPath = userPath.trim().startsWith("$") ? userPath.trim() : "$." + userPath.trim();
  const parts = normalizedPath.slice(1).split(/[\.\[\]]+/).filter(Boolean);

  let current: any = data;
  for (const part of parts) {
    if (current == null) return undefined;
    if (Array.isArray(current) || /^\d+$/.test(part)) {
      current = current?.[parseInt(part, 10)];
    } else {
      current = current?.[part];
    }
  }
  return current;
}
