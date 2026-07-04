// frontend/app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import Link from "next/link";
import Logo from "@/components/header/Logo";
import { FcGoogle } from "react-icons/fc";

  
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "deep" || savedTheme === "coral") {
      document.documentElement.dataset.theme = savedTheme;
    } else {
      document.documentElement.dataset.theme = "deep";
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await login(email, password);

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setMessage("メールアドレスまたはパスワードが正しくありません。");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-(--page-from) to-(--page-to)">
      <div className="w-full max-w-md rounded-2xl border border-(--border) bg-(--surface-1) p-8 shadow-xl">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            className="w-full rounded border border-(--border) bg-(--surface-2) p-2 text-(--text-main) outline-none focus:border-(--accent)"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            className="w-full rounded border border-(--border) bg-(--surface-2) p-2 text-(--text-main) outline-none focus:border-(--accent)"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-(--accent) px-4 py-3 font-semibold text-(--accent-text) hover:opacity-90"
          >
            ログイン
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-[var(--danger-bg)]">
            {message}
          </p>
        )}

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-(--border)" />
          <span className="mx-3 text-xs text-(--text-sub)">または</span>
          <div className="h-px flex-1 bg-(--border)" />
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/api/auth/google";
          }}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-(--border) bg-(--surface-2) px-4 py-3 hover:bg-(--surface-3)"
        >
          <FcGoogle size={22} />
          <span>Googleでログイン</span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-(--text-sub)">
            アカウントをお持ちでない方
          </p>

          <Link
            href="/register"
            className="text-sm font-semibold hover:underline"
          >
            新規登録
          </Link>
        </div>

        <div className="mt-8 border-t border-(--border) pt-6">
          <Link
            href="/dashboard"
            className="text-sm text-(--text-sub) hover:underline"
          >
            ← ダッシュボードへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}