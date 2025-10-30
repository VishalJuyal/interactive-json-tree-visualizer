"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, ReactFlowInstance } from "reactflow";
import "reactflow/dist/style.css";
import ObjectCard from "./nodes/ObjectCard";
import ArrayCard from "./nodes/ArrayCard";
import PrimitiveCard from "./nodes/PrimitiveCard";
import { buildGraphFromJson, getValueAtPath } from "../lib/json-utils";

const FlowCanvas = dynamic(() => import("./flow/FlowCanvas"), { ssr: false });

interface JsonNode extends Node {
  data: {
    label: string;
    value?: unknown;
    type: "object" | "array" | "primitive";
    jsonPath: string;
    highlighted?: boolean;
  };
}

const nodeTypes = {
  object: ObjectCard,
  array: ArrayCard,
  primitive: PrimitiveCard,
};

const starterJson = `{
  "user": {
    "id": 1,
    "name": "Vishal Juyal",
    "address": {
      "city": "Delhi",
      "country": "India"
    }
  },
  "items": [
    { "name": "Bike" },
    { "name": "Car" }
  ]
}`;

export function JsonTreeVisualizer() {
  const [jsonText, setJsonText] = useState(starterJson);
  const [searchText, setSearchText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [nodes, setNodes] = useState<JsonNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [flow, setFlow] = useState<ReactFlowInstance | null>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((prev) => applyNodeChanges(changes, prev));
  }, []);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((prev) => applyEdgeChanges(changes, prev));
  }, []);

  const generateTree = () => {
    setErrorText("");
    setActiveNodeId(null);
    try {
      const parsed = JSON.parse(jsonText || starterJson);
      const result = buildGraphFromJson(parsed);
      setNodes(result.nodes as unknown as JsonNode[]);
      setEdges(result.edges);
      setTimeout(() => {
        if (flow && result.nodes.length > 0) flow.fitView({ padding: 0.2, duration: 300 });
      }, 200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorText(`Invalid JSON: ${msg}`);
      setNodes([]);
      setEdges([]);
    }
  };

  const searchPath = () => {
    setActiveNodeId(null);
    setErrorText("");
    setSuccessText("");
    if (!searchText.trim()) return;
    try {
      const parsed = JSON.parse(jsonText || starterJson);
      const normalizedPath = searchText.trim().startsWith("$") ? searchText.trim() : "$." + searchText.trim();
      const result = getValueAtPath(parsed, searchText);
      if (result === undefined) {
        setErrorText(`No match found for path: ${normalizedPath}`);
        setActiveNodeId(null);
        return;
      }
      const targetId = normalizedPath;
      const match = nodes.find((n) => n.id === targetId);
      if (match) {
        setActiveNodeId(targetId);
        setSuccessText("Match found!");
        setNodes((prev) => prev.map((n) => (n.id === targetId ? { ...n, data: { ...n.data, highlighted: true } } : n)));
        if (flow) setTimeout(() => flow.setCenter(match.position.x, match.position.y, { zoom: 1.2, duration: 800 }), 100);
      } else {
        setErrorText("Path exists in JSON but not in visualization");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorText(`Invalid JSON or search path: ${msg}`);
    }
  };

  const resetAll = () => {
    setJsonText(starterJson);
    setNodes([]);
    setEdges([]);
    setSearchText("");
    setErrorText("");
    setSuccessText("");
    setActiveNodeId(null);
  };

  const downloadImage = async () => {
    if (!flowRef.current || nodes.length === 0 || !flow) return;
    try {
      const { toPng } = await import("html-to-image");
      const container = flowRef.current.parentElement as HTMLElement;
      if (!container) throw new Error("Could not find container element");
      const originalOverflow = container.style.overflow;
      const originalHeight = container.style.height;
      const originalMaxHeight = container.style.maxHeight;
      const originalWrapperHeight = flowRef.current.style.height;
      const originalWrapperWidth = flowRef.current.style.width;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      const viewport = flowRef.current.querySelector('.react-flow__viewport') as HTMLElement;
      let nodeWidth = 150;
      let nodeHeight = 100;
      if (viewport) {
        const firstNodeEl = viewport.querySelector('.react-flow__node') as HTMLElement;
        if (firstNodeEl) {
          const rect = firstNodeEl.getBoundingClientRect();
          nodeWidth = rect.width;
          nodeHeight = rect.height;
        }
      }
      nodes.forEach((n) => {
        minX = Math.min(minX, n.position.x);
        minY = Math.min(minY, n.position.y);
        maxX = Math.max(maxX, n.position.x + nodeWidth);
        maxY = Math.max(maxY, n.position.y + nodeHeight);
      });
      const padding = 150;
      const fullWidth = (maxX - minX) + padding * 2;
      const fullHeight = (maxY - minY) + padding * 2;
      const originalViewport = flow.getViewport();
      try {
        container.style.overflow = 'visible';
        container.style.height = `${fullHeight}px`;
        container.style.maxHeight = 'none';
        flowRef.current.style.height = `${fullHeight}px`;
        flowRef.current.style.width = `${fullWidth}px`;
        const panX = -minX + padding;
        const panY = -minY + padding;
        flow.setViewport({ x: panX, y: panY, zoom: 1.0 }, { duration: 0 });
        await new Promise((r) => setTimeout(r, 500));
        const dataUrl = await toPng(flowRef.current, {
          backgroundColor: "#ffffff",
          pixelRatio: 2,
          cacheBust: true,
          quality: 1,
          filter: (node) => {
            const exclude = [
              "react-flow__controls",
              "react-flow__minimap",
              "react-flow__controls-button",
              "react-flow__minimap-mask",
            ];
            const el = node as HTMLElement;
            return !exclude.some((c) => el?.classList?.contains(c)) && !el?.classList?.contains("download-button");
          },
        });
        const a = document.createElement("a");
        a.download = `json-tree-${Date.now()}.png`;
        a.href = dataUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setSuccessText("Image downloaded successfully!");
        setTimeout(() => setSuccessText(""), 3000);
      } finally {
        container.style.overflow = originalOverflow;
        container.style.height = originalHeight || '600px';
        container.style.maxHeight = originalMaxHeight;
        if (flowRef.current) {
          flowRef.current.style.height = originalWrapperHeight || '100%';
          flowRef.current.style.width = originalWrapperWidth || '100%';
        }
        flow.setViewport(originalViewport, { duration: 300 });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorText(`Failed to download image: ${msg}`);
      console.error("Download error:", err);
    }
  };

  const paintedNodes = useMemo(() => {
    return nodes.map((n) => ({ ...n, data: { ...n.data, highlighted: n.id === activeNodeId } }));
  }, [nodes, activeNodeId]);

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 pt-12 sm:pt-4 md:pt-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center">JSON Tree Visualizer</h1>
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-full max-w-2xl">
              <div className="relative flex flex-col sm:flex-row">
                <input
                  type="text"
                  placeholder="Enter JSON Path, Eg : user.address.city"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchPath()}
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-inherit text-sm sm:text-base"
                />
                <button 
                  onClick={searchPath} 
                  className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-b-lg sm:rounded-r-lg sm:rounded-b-none font-semibold text-sm sm:text-base whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200">
            <label className="block text-base sm:text-lg font-semibold mb-2">Paste or type JSON data</label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full h-64 sm:h-80 md:h-96 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-inherit"
              placeholder="Enter JSON data..."
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
              <button 
                onClick={generateTree} 
                className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base"
              >
                Generate Tree
              </button>
              <button 
                onClick={resetAll} 
                className="px-4 sm:px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold text-sm sm:text-base"
              >
                Reset
              </button>
            </div>
            {errorText && (
              <div className="mt-4 p-2 sm:p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base">
                {errorText}
              </div>
            )}
            {successText && (
              <div className="mt-4 p-2 sm:p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold text-sm sm:text-base">
                {successText}
              </div>
            )}
          </div>

          <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200 relative h-[400px] sm:h-[500px] lg:h-[600px]">
            {nodes.length > 0 ? (
              <FlowCanvas
                ref={flowRef}
                nodes={paintedNodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onInit={setFlow}
                onDownload={downloadImage}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm sm:text-base px-4 text-center">
                Click &quot;Generate Tree&quot; to visualize JSON
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

