// frontend/app/requests/page.tsx
"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import {
  createFeatureRequest,
  getMyFeatureRequests,
  withdrawFeatureRequest,
} from "@/lib/api/featureRequests";
import type { FeatureRequest } from "@/lib/api/featureRequests";

const statusLabels: Record<FeatureRequest["status"], string> = {
  pending: "未対応",
  reviewing: "確認中",
  done: "対応済み",
  rejected: "却下",
  withdrawn: "取り下げ",
};

export default function RequestsPage() {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [title, setTitle] = useState("");
  const requestTitles = [
    "トピック追加",
    "動画・コメントの削除依頼",
    "ユーザーの違反報告",
    "バグ報告",
    "機能追加",
    "その他",
  ];
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function refreshFeatureRequests() {
    const data = await getMyFeatureRequests();
    setFeatureRequests(data);
  }

  useEffect(() => {
    async function loadFeatureRequests() {
      try {
        await refreshFeatureRequests();
      } catch (error) {
        console.error(error);
        alert("リクエスト一覧の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    }

    loadFeatureRequests();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      alert("リクエストの種類と内容を入力してください");
      return;
    }

    try {
      await createFeatureRequest({
        title,
        body,
      });

      setTitle("");
      setBody("");

      await refreshFeatureRequests();

      alert("リクエストを送信しました");
    } catch (error) {
      console.error(error);
      alert("リクエストの送信に失敗しました");
    }
  }

  async function handleWithdraw(featureRequestId: number) {
    try {
      await withdrawFeatureRequest(featureRequestId);

      await refreshFeatureRequests();
    } catch (error) {
      console.error(error);
      alert("リクエストの取り下げに失敗しました");
    }
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 text-white">
        <h1 className="text-2xl font-bold">リクエスト</h1>

        <section className="mt-8 rounded-2xl bg-slate-900 p-6 shadow-xl">
          <h2 className="text-lg font-semibold">新しいリクエスト</h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm outline-none focus:border-sky-500"
            >
              <option value="">リクエストの種類を選択</option>
              {requestTitles.map((requestTitle) => (
                <option key={requestTitle} value={requestTitle}>
                  {requestTitle}
                </option>
              ))}
            </select>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="内容"
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm outline-none focus:border-sky-500"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-slate-200 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-white"
              >
                送信
              </button>
            </div>
          </form>
        </section>

        <section className="mt-8 rounded-2xl bg-slate-900 p-6 shadow-xl">
          <h2 className="text-lg font-semibold">送信済みリクエスト</h2>

          {isLoading ? (
            <p className="mt-4 text-sm text-slate-400">読み込み中...</p>
          ) : featureRequests.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              まだリクエストはありません。
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-700 text-slate-400">
                  <tr>
                    <th className="px-3 py-2">送信日</th>
                    <th className="px-3 py-2">タイトル</th>
                    <th className="px-3 py-2">ステータス</th>
                    <th className="px-3 py-2">操作</th>
                  </tr>
                </thead>

                <tbody>
                  {featureRequests.map((featureRequest) => (
                    <tr
                      key={featureRequest.id}
                      className="border-b border-slate-800"
                    >
                      <td className="px-3 py-3 text-slate-400">
                        {new Date(featureRequest.created_at).toLocaleDateString(
                          "ja-JP",
                        )}
                      </td>

                      <td className="px-3 py-3">
                        <div className="font-semibold">
                          {featureRequest.title}
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-slate-400">
                          {featureRequest.body}
                        </div>

                        {featureRequest.admin_comment && (
                          <div className="mt-2 rounded-lg bg-slate-800 p-2 text-xs text-slate-300">
                            管理者コメント: {featureRequest.admin_comment}
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-3">
                        {statusLabels[featureRequest.status]}
                      </td>

                      <td className="px-3 py-3">
                        {["pending", "reviewing"].includes(
                          featureRequest.status,
                        ) ? (
                          <button
                            type="button"
                            onClick={() => handleWithdraw(featureRequest.id)}
                            className="rounded-full border border-red-500 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                          >
                            取り下げ
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}