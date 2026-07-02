// frontend/app/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/auth";
import Link from "next/link";
import Logo from "@/components/header/Logo";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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

    if (password !== passwordConfirmation) {
      setMessage("パスワードが一致しません。");
      return;
    }

    try {
      await register(name, email, password, passwordConfirmation );
      router.push("/login");
    } catch (error) {
      console.error(error);
      setMessage("登録に失敗しました。入力内容を確認してください。");
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
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前"
            className="w-full rounded border border-(--border) bg-(--surface-2) p-2 text-(--text-main) outline-none focus:border-(--accent)"
          />

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

          <input
            type="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="パスワード（確認）"
            className="w-full rounded border border-(--border) bg-(--surface-2) p-2 text-(--text-main) outline-none focus:border-(--accent)"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-(--accent) px-4 py-3 font-semibold text-(--accent-text) hover:opacity-90"
          >
            登録
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-(--danger-bg)">
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
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
          }}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-(--border) bg-(--surface-2) px-4 py-3 hover:bg-(--surface-3)"
        >
          <FcGoogle size={22} />
          <span>Googleでログイン</span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-(--text-sub)">
            すでにアカウントをお持ちの方
          </p>

          <Link href="/login" className="text-sm font-semibold hover:underline">
            ログイン
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
