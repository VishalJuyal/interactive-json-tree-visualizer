"use client";

import React, { forwardRef } from "react";
import ReactFlow, { Background, Controls, MiniMap, Edge, Node, NodeTypes, NodeChange, EdgeChange } from "reactflow";

type Props = {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  onNodesChange: (c: NodeChange[]) => void;
  onEdgesChange: (c: EdgeChange[]) => void;
  onInit: (instance: any) => void;
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
    <div ref={ref as any} style={{ width: "100%", height: "100%" }}>
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
            if ((node.data as any)?.type === "object") return "#6C63FF";
            if ((node.data as any)?.type === "array") return "#00B894";
            return "#FDA65D";
          }}
        />
      </ReactFlow>
    </div>
  );
});

export default FlowCanvas;
