"use client";

type Props = {
  text: string;
  onTextChange: (v: string) => void;
  onSearch: () => void;
};

export default function SearchBar({ text, onTextChange, onSearch }: Props) {
  return (
    <div className="relative flex flex-col sm:flex-row">
      <input
        type="text"
        placeholder="Enter JSON Path, Eg : user.address.city"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-inherit text-sm sm:text-base"
      />
      <button
        onClick={onSearch}
        className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-b-lg sm:rounded-r-lg sm:rounded-b-none font-semibold text-sm sm:text-base whitespace-nowrap"
      >
        Search
      </button>
    </div>
  );
}
