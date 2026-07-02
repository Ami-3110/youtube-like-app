// frontend/components/header/UploadButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { AiOutlinePlus } from "react-icons/ai";

export default function UploadButton() {
  const router = useRouter();

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => router.push("/upload")}
        className="flex items-center gap-2 rounded-full bg-slate-800 px-5 py-2.5 text-base text-white hover:bg-slate-700"
      >
        <AiOutlinePlus size={18} />
        <span className="hidden sm:inline">作成</span>
      </button>
    </div>
  );
}