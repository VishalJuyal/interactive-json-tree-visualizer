"use client";

type Props = {
  text: string;
  onTextChange: (v: string) => void;
  onSearch: () => void;
};

export default function SearchBar({ text, onTextChange, onSearch }: Props) {
  return (
    <div className="relative flex">
      <input
        type="text"
        placeholder="Enter JSON Path, Eg : user.address.city"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-inherit"
      />
      <button
        onClick={onSearch}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg font-semibold"
      >
        Search
      </button>
    </div>
  );
}
