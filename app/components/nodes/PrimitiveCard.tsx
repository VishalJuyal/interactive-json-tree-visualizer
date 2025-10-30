"use client";

import { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";

export default function PrimitiveCard({ data }: NodeProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyPath = () => {
    navigator.clipboard.writeText(data?.jsonPath ?? "");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className={`relative px-3 sm:px-4 py-2 bg-[#FDA65D] text-gray-900 rounded-lg shadow-md font-medium transition-all cursor-pointer ${
        data?.highlighted ? "ring-4 ring-red-500 ring-offset-2 shadow-red-500 shadow-lg" : "hover:shadow-lg hover:scale-105"
      }`}
      style={{ minWidth: "100px", maxWidth: "200px" }}
      onClick={copyPath}
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-xs sm:text-sm truncate">{data?.label}</div>
      {data?.value !== undefined && (
        <div className="text-xs text-gray-700 mt-1 truncate max-w-full">
          {String(data?.value).length > 15 ? String(data?.value).slice(0, 15) + "..." : String(data?.value)}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
      {isTooltipVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap pointer-events-none z-10 max-w-[300px] overflow-hidden text-ellipsis">
          {isCopied ? "Copied!" : data?.jsonPath}
        </div>
      )}
    </div>
  );
}
