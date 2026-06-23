// frontend/components/header/SearchBar.tsx
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchBar() {
  return (
    <form className="flex w-full max-w-md pt-1">
      <input
        type="text"
        placeholder="検索"
        className="min-w-0 flex-1 rounded-l-full border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none"
      />

      <button
        type="submit"
        className="flex w-16 items-center justify-center rounded-r-full border border-l-0 border-slate-700 bg-slate-800 text-white">
        <AiOutlineSearch size={30} />
      </button>
    </form>
  );
}