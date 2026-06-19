// frontend/app/login/page.tsx
"use client";

import { useState } from "react";
import { getCurrentUser, login } from "@/lib/api/auth";
import Link from "next/link";
  
export default function LoginPage() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await login(email, password);

      const user = await getCurrentUser();

      setMessage(`ログイン成功:${user.name}`);
      setIsLoggedIn(true);
    } catch {
      setMessage("ログイン失敗");
      setIsLoggedIn(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold"></h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          className="w-full rounded border p-2"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          className="w-full rounded border p-2"
        />

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          ログイン
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      {isLoggedIn && (
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="rounded bg-green-600 px-4 py-2 text-center text-white"
          >
            ダッシュボードへ
          </Link>

          <Link
            href="/movies/1"
            className="rounded bg-slate-700 px-4 py-2 text-center text-white"
          >
            動画詳細へ
          </Link>
        </div>
      )}
    </main>
  );
}