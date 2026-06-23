// frontend/components/header/UserMenu.tsx
"use client";

import { useState } from "react";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("ログアウトに失敗しました");
    }
  }

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
        A
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 rounded-xl be-slate-900 p-2 shadow-lg ring-1 ring-slate-700">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-slate-800"
          >
            ログアウト
          </button>
          </div>
      )}
    </div>
  );
}