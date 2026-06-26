// frontend/components/header/UserMenu.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { getCurrentUser, logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();

      if (user) {
        setUserName(user.name);
        setAvatarPath(user.avatar_path);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  return (
    <div ref={menuRef} className="relative pt-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-sky-500 font-bold text-white"
      >
        {avatarPath ? (
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${avatarPath}`}
            alt={userName}
            className="h-full w-full rounded-full object-cover"
          />
        ) : userName ? (
          userName.charAt(0).toUpperCase()
        ) : (
          "?"
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 p-2 shadow-lg ring-1 ring-slate-700">
          <div className="border-b border-slate-700 px-4 py-3">
            <p className="text-sm font-semibold text-white">{userName}</p>
            <p className="text-sm text-slate-400">いずれhandle</p>
            <p className="text-sm text-sky-500 mt-2">チャンネルを表示</p>
          </div>

          <button className="w-full rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-slate-800">
            登録チャンネル
          </button>
          <div className="my-1 border-b border-slate-700" />

          <button className="w-full rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-slate-800">
            デザイン: Deep Sea
          </button>
          <button className="w-full rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-slate-800">
            設定
          </button>
          <div className="my-1 border-b border-slate-700" />
          <button className="w-full rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-slate-800">
            リクエスト
          </button>
          <div className="my-1 border-b border-slate-700" />
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