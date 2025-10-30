"use client";

type Props = {
  text: string;
  onTextChange: (v: string) => void;
  onGenerateTree: () => void;
  onResetAll: () => void;
  errorText?: string;
  successText?: string;
};

export default function JsonEditor({ text, onTextChange, onGenerateTree, onResetAll, errorText, successText }: Props) {
  return (
    <div className="rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200">
      <label className="block text-base sm:text-lg font-semibold mb-2">Paste or type JSON data</label>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full h-64 sm:h-80 md:h-96 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-inherit"
        placeholder="Enter JSON data..."
      />
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
        <button 
          onClick={onGenerateTree} 
          className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base"
        >
          Generate Tree
        </button>
        <button 
          onClick={onResetAll} 
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
  );
}
