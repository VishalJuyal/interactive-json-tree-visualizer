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
  data: unknown,
  path: string = "$",
  x: number = 0,
  y: number = 0,
  nodes: GraphNode[] = [],
  edges: Edge[] = [],
  parentId: string | null = null,
  seenObjects = new WeakMap<object, boolean>()
): { nodes: GraphNode[]; edges: Edge[]; maxY: number } {
  const nodeId = path;
  const isArray = Array.isArray(data);
  const isObject = typeof data === "object" && data !== null && !isArray;
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

    if (parentId) edges.push({ id: `${parentId}-${nodeId}`, source: parentId, target: nodeId });
    return { nodes, edges, maxY: y };
  }

  if (isObject && seenObjects.has(data as object)) return { nodes, edges, maxY: y };
  if (isObject) seenObjects.set(data as object, true);

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

  if (parentId) edges.push({ id: `${parentId}-${nodeId}`, source: parentId, target: nodeId });

  let currentY = y + 120;
  const keys = isArray ? Object.keys(data as unknown[]) : Object.keys(data as Record<string, unknown>);
  const nodeWidth = 120;
  const startX = x - ((keys.length - 1) * nodeWidth) / 2;

  keys.forEach((rawKey, index) => {
    const key = isArray ? Number(rawKey) : rawKey;
    const childPath = isArray ? `${path}[${key}]` : `${path}.${String(key)}`;
    const childX = startX + index * nodeWidth;

    let childValue: unknown;
    if (isArray) {
      childValue = (data as unknown[])[Number(key)];
    } else {
      childValue = (data as Record<string, unknown>)[String(key)];
    }

    const result = buildGraphFromJson(
      childValue,
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

export function getValueAtPath(data: unknown, userPath: string): unknown {
  const normalizedPath = userPath.trim().startsWith("$") ? userPath.trim() : "$." + userPath.trim();
  const parts = normalizedPath.slice(1).split(/[\.\[\]]+/).filter(Boolean);

  let current: unknown = data;
  for (const part of parts) {
    if (current == null) return undefined;
    if (Array.isArray(current) || /^\d+$/.test(part)) {
      const arr = current as unknown[];
      current = arr[parseInt(part, 10)];
    } else {
      const obj = current as Record<string, unknown>;
      current = obj[part];
    }
  }
  return current;
}
