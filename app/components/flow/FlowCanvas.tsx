"use client";

import React, { forwardRef } from "react";
import ReactFlow, { Background, Controls, MiniMap, Edge, Node, NodeTypes, NodeChange, EdgeChange, ReactFlowInstance } from "reactflow";

type JsonNode = Node<Record<string, unknown>>;

type Props = {
  nodes: JsonNode[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  onNodesChange: (c: NodeChange[]) => void;
  onEdgesChange: (c: EdgeChange[]) => void;
  onInit: (instance: ReactFlowInstance) => void;
  onDownload: () => void;
};

const FlowCanvas = forwardRef<HTMLDivElement, Props>(function FlowCanvas(
  {
    nodes,
    edges,
    nodeTypes,
    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
    onInit: handleInit,
    onDownload: handleDownload,
  },
  ref
) {
  return (
    <div ref={ref as unknown as React.RefObject<HTMLDivElement>} style={{ width: "100%", height: "100%" }}>
      <button
        onClick={handleDownload}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-lg transition-all download-button"
        title="Download tree as image"
      >
        Download Image
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        onInit={handleInit}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const t = (node.data as Record<string, unknown> | undefined)?.type;
            if (t === "object") return "#6C63FF";
            if (t === "array") return "#00B894";
            return "#FDA65D";
          }}
        />
      </ReactFlow>
    </div>
  );
});

export default FlowCanvas;
