// frontend/components/header/UserMenu.tsx
"use client";

import Image from "next/image";
import { mediaUrl } from "@/lib/mediaUrl";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { currentUser } = useCurrentUser();
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
        {currentUser?.avatar_path ? (
          <Image
            src={mediaUrl(currentUser.avatar_path)}
            alt={currentUser.name}
            width={40}
            height={40}
            className="h-full w-full rounded-full object-cover"
          />
        ) : currentUser?.name ? (
          currentUser.name.charAt(0).toUpperCase()
        ) : (
          "?"
        )}
      </button>

      {isOpen &&
        (currentUser ? (
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 p-2 shadow-lg ring-1 ring-slate-700">
            <div className="border-b border-slate-700 px-4 py-3">
              <p className="text-sm font-semibold text-white">
                {currentUser?.name}
              </p>
              <p className="text-sm text-slate-400">@{currentUser?.handle}</p>
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) return;
                  setIsOpen(false);
                  router.push(`/channel/${currentUser.id}`);
                }}
                className="mt-2 text-sm text-sky-500 hover:text-sky-400"
              >
                チャンネルを表示
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/subscriptions");
              }}
              className="w-full rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-slate-800"
            >
              登録チャンネル
            </button>
            <div className="my-1 border-b border-slate-700" />

            <button className="w-full rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-slate-800">
              デザイン: Deep Sea
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/account/settings");
              }}
              className="w-full rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-slate-800"
            >
              アカウント設定
            </button>
            <div className="my-1 border-b border-slate-700" />
            <button className="w-full rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-slate-800">
              リクエスト
            </button>

            {Boolean(currentUser.is_admin) && (
              <>
                <div className="my-1 border-b border-slate-700" />

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/admin");
                  }}
                  className="w-full rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-slate-800"
                >
                  管理画面
                </button>
              </>
            )}
            <div className="my-1 border-b border-slate-700" />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-slate-800"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 p-2 shadow-lg ring-slate-700">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/login");
              }}
              className="w-full rounded-lg px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
            >
              ログイン
            </button>
          </div>
        ))}
    </div>
  );
}