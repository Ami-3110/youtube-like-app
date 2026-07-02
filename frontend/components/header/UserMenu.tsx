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
  const [theme, setTheme] = useState<"deep" | "coral">(() => {
    if (typeof window === "undefined") return "deep";

    const savedTheme = localStorage.getItem("theme");

    return savedTheme === "coral" || savedTheme === "deep"
      ? savedTheme
      : "deep";
  });

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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function changeTheme(nextTheme: "deep" | "coral") {
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  }

  return (
    <div ref={menuRef} className="relative pt-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-(--accent) font-bold text-(--accent-text)"
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
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-(--border) bg-(--surface-1) p-2 shadow-lg">
            <div className="border-b border-(--border) px-4 py-3">
              <p className="text-sm font-semibold text-(--text-main)">
                {currentUser?.name}
              </p>
              <p className="text-sm text-(--text-sub)">
                @{currentUser?.handle}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) return;
                  setIsOpen(false);
                  router.push(`/channel/${currentUser.id}`);
                }}
                className="mt-2 text-sm text-(--accent) hover:opacity-80"
              >
                チャンネルを表示
              </button>
            </div>

            {[
              ["登録チャンネル", "/subscriptions"],
              ["アカウント設定", "/account/settings"],
              ["リクエスト", "/requests"],
            ].map(([label, href]) => (
              <button
                key={href}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push(href);
                }}
                className="w-full rounded-lg px-4 py-2 text-left text-sm text-(--text-main) hover:bg-(--surface-3)"
              >
                {label}
              </button>
            ))}

            {Boolean(currentUser.is_admin) && (
              <>
                <div className="my-1 border-b border-(--border)" />
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/admin");
                  }}
                  className="w-full rounded-lg px-4 py-2 text-left text-sm text-(--text-main) hover:bg-(--surface-3)"
                >
                  管理画面
                </button>
              </>
            )}

            <div className="my-1 border-b border-(--border)" />

            <div className="px-4 py-2">
              <p className="mb-2 text-xs text-(--text-sub)">デザイン</p>

              <button
                type="button"
                onClick={() => changeTheme("deep")}
                className="w-full rounded-lg px-2 py-2 text-left text-sm text-(--text-main) hover:bg-(--surface-3)"
              >
                {theme === "deep" ? "✓ " : ""}
                🌊 Deep Sea
              </button>

              <button
                type="button"
                onClick={() => changeTheme("coral")}
                className="w-full rounded-lg px-2 py-2 text-left text-sm text-(--text-main) hover:bg-(--surface-3)"
              >
                {theme === "coral" ? "✓ " : ""}
                🪸 Coral Sea
              </button>
            </div>

            <div className="my-1 border-b border-(--border)" />

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg px-4 py-2 text-left text-sm text-(--text-main) hover:bg-(--surface-3)"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-(--border) bg-(--surface-1) p-2 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/login");
              }}
              className="w-full rounded-lg px-4 py-2 text-left text-sm text-(--text-main) hover:bg-(--surface-3)"
            >
              ログイン
            </button>
          </div>
        ))}
    </div>
  );
}