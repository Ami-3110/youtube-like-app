// frontend/app/account/settings/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateEmail,
  updatePassword,
  deleteAccount,
} from "@/lib/api/account";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Header from "@/components/header/Header";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function handleUpdateEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await updateEmail(email);
      alert("メールアドレスを変更しました");
    } catch (error) {
      console.error(error);
      alert("メールアドレスの変更に失敗しました");
    }
  }

  async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await updatePassword(currentPassword, password, passwordConfirmation);
      alert("パスワードを変更しました");

      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (error) {
      console.error(error);
      alert("パスワードの変更に失敗しました");
    }
  }

  async function handleDeleteAccount() {
    try {
      await deleteAccount();
      alert("アカウントを削除しました");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("アカウント削除に失敗しました");
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-linear-to-b from-(--page-from) to-(--page-to) py-10 text-(--text-main)">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="text-2xl font-bold">アカウント設定</h1>

          <div className="mt-8 space-y-8 rounded-2xl border border-(--border) bg-(--surface-1) p-6 shadow-xl">
            <section>
              <h2 className="text-lg font-semibold">メールアドレス変更</h2>

              <p className="mt-2 text-sm text-(--text-sub)">
                現在のメールアドレス: {currentUser?.email ?? "取得中..."}
              </p>

              <form onSubmit={handleUpdateEmail} className="mt-4 space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="新しいメールアドレス"
                  className="w-full rounded-lg border border-(--border) bg-(--surface-2) px-4 py-2 text-sm outline-none focus:border-(--accent)"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-full border border-(--border) bg-(--surface-2) px-5 py-2 text-sm font-semibold text-(--text-main) hover:bg-(--surface-3)"
                  >
                    メールアドレスを変更
                  </button>
                </div>
              </form>
            </section>

            <div className="border-t border-(--border)" />

            <section>
              <h2 className="text-lg font-semibold">パスワード変更</h2>

              <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="現在のパスワード"
                  className="w-full rounded-lg border border-(--border) bg-(--surface-2) px-4 py-2 text-sm outline-none focus:border-(--accent)"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="新しいパスワード"
                  className="w-full rounded-lg border border-(--border) bg-(--surface-2) px-4 py-2 text-sm outline-none focus:border-(--accent)"
                />

                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="新しいパスワード（確認）"
                  className="w-full rounded-lg border border-(--border) bg-(--surface-2) px-4 py-2 text-sm outline-none focus:border-(--accent)"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-full border border-(--border) bg-(--surface-2) px-5 py-2 text-sm font-semibold text-(--text-main) hover:bg-(--surface-3)"
                  >
                    パスワードを変更
                  </button>
                </div>
              </form>
            </section>

            <div className="border-t border-(--border)" />

            <section>
              <h2 className="text-lg font-semibold text-(--danger-text)">
                アカウント削除
              </h2>

              <p className="mt-2 text-sm text-(--text-sub)">
                アカウントを削除すると、元に戻すことはできません。
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="rounded-full bg-(--danger-bg) px-5 py-2 text-sm font-semibold text-(--danger-text) hover:bg-(--danger-hover)"
                >
                  アカウント削除
                </button>
              </div>
            </section>
          </div>

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            title="アカウント削除"
            message="本当にアカウントを削除しますか？この操作は取消できません。"
            onConfirm={handleDeleteAccount}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        </div>
      </main>
    </>
  );
}