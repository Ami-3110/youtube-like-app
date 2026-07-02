// frontend/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import {
  getAdminFeatureRequests,
  updateAdminFeatureRequest,
} from "@/lib/api/adminFeatureRequests";
import {
  createAdminTopic,
  deleteAdminTopic,
  getAdminTopics,
} from "@/lib/api/adminTopics";
import type { AdminFeatureRequest } from "@/lib/api/adminFeatureRequests";
import type { Topic } from "@/types/topic";
import type { FeatureRequestStatus } from "@/lib/api/featureRequests";
import Link from "next/link";
import { getAdminUsers, deleteAdminUser } from "@/lib/api/adminUsers";
import type { AdminUser } from "@/lib/api/adminUsers";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

const statusLabels: Record<FeatureRequestStatus, string> = {
  pending: "未対応",
  reviewing: "確認中",
  done: "対応済み",
  rejected: "却下",
  withdrawn: "取り下げ",
};

const statuses: FeatureRequestStatus[] = [
  "pending",
  "reviewing",
  "done",
  "rejected",
  "withdrawn",
];

export default function AdminPage() {
  const [requests, setRequests] = useState<AdminFeatureRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminFeatureRequest | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<FeatureRequestStatus>("pending");
  const [adminComment, setAdminComment] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const router = useRouter();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const [isAdminDataLoading, setIsAdminDataLoading] = useState(true);

  async function refreshRequests(pageNumber = page) {
    const result = await getAdminFeatureRequests(pageNumber);

    setRequests(result.data);
    setPage(result.current_page);
    setLastPage(result.last_page);
  }

  async function refreshTopics() {
    const data = await getAdminTopics();

    setTopics(data);
  }

  async function refreshUsers() {
    const data = await getAdminUsers();
    setUsers(data);
  }

  async function handleDeleteUser(userId: number) {
    if (!confirm("このユーザーを削除しますか？")) return;

    try {
      await deleteAdminUser(userId);
      await refreshUsers();
    } catch (error) {
      console.error(error);
      alert("ユーザー削除に失敗しました");
    }
  }

  useEffect(() => {
    async function load() {
      try {
        await Promise.all([
          refreshRequests(1),
          refreshTopics(),
          refreshUsers(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsAdminDataLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!isCurrentUserLoading && !currentUser?.is_admin) {
      router.replace("/dashboard");
    }
  }, [currentUser, isCurrentUserLoading, router]);

  function openStatusModal(
    request: AdminFeatureRequest,
    status: FeatureRequestStatus,
  ) {
    setSelectedRequest(request);
    setSelectedStatus(status);
    setAdminComment(request.admin_comment ?? "");
  }

  async function handleUpdateRequest() {
    if (!selectedRequest) return;

    try {
      await updateAdminFeatureRequest(selectedRequest.id, {
        status: selectedStatus,
        admin_comment: adminComment || null,
      });

      setSelectedRequest(null);
      setAdminComment("");
      await refreshRequests();

      alert("リクエストを更新しました");
    } catch (error) {
      console.error(error);
      alert("リクエストの更新に失敗しました");
    }
  }

  async function handleCreateTopic() {
    if (!newTopic.trim()) return;

    try {
      await createAdminTopic(newTopic);

      setNewTopic("");
      await refreshTopics();
    } catch (error) {
      console.error(error);
      alert("トピックの追加に失敗しました");
    }
  }

  async function handleDeleteTopic() {
    if (!selectedTopicId) return;

    try {
      await deleteAdminTopic(selectedTopicId);

      setSelectedTopicId(null);
      await refreshTopics();
    } catch (error) {
      console.error(error);
      alert("トピックの削除に失敗しました");
    }
  }

  if (!isCurrentUserLoading && !currentUser?.is_admin) {
    return null;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-linear-to-b from-sky-950 to-slate-950 py-10 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-2xl font-bold">管理画面</h1>

          <section className="mt-8 rounded-2xl bg-slate-900 p-6 shadow-xl">
            <h2 className="text-lg font-semibold">リクエスト管理</h2>

            {isAdminDataLoading ? (
              <p className="mt-4 text-sm text-slate-400">読み込み中...</p>
            ) : requests.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                リクエストはありません。
              </p>
            ) : (
              <>
                <div className="mt-4 hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-700 text-slate-400">
                      <tr>
                        <th className="px-3 py-2">送信日</th>
                        <th className="px-3 py-2">ユーザー</th>
                        <th className="px-3 py-2">種類</th>
                        <th className="px-3 py-2">内容</th>
                        <th className="px-3 py-2">ステータス</th>
                      </tr>
                    </thead>

                    <tbody>
                      {requests.map((request) => (
                        <tr
                          key={request.id}
                          className="border-b border-slate-800 align-top"
                        >
                          <td className="px-3 py-3 text-slate-400">
                            {new Date(request.created_at).toLocaleDateString(
                              "ja-JP",
                            )}
                          </td>

                          <td className="px-3 py-3">
                            <p className="font-semibold">{request.user.name}</p>
                            {request.user.handle && (
                              <p className="text-xs text-slate-400">
                                @{request.user.handle}
                              </p>
                            )}
                          </td>

                          <td className="px-3 py-3 font-semibold">
                            {request.title}
                          </td>

                          <td className="px-3 py-3">
                            <p className="whitespace-pre-wrap text-slate-300">
                              {request.body}
                            </p>

                            {request.admin_comment && (
                              <div className="mt-2 rounded-lg bg-slate-800 p-2 text-xs text-slate-300">
                                管理者コメント: {request.admin_comment}
                              </div>
                            )}
                          </td>

                          <td className="px-3 py-3">
                            <select
                              value={request.status}
                              onChange={(e) =>
                                openStatusModal(
                                  request,
                                  e.target.value as FeatureRequestStatus,
                                )
                              }
                              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none"
                            >
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {statusLabels[status]}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-4 md:hidden">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold">{request.user.name}</p>
                          {request.user.handle && (
                            <p className="text-xs text-slate-400">
                              @{request.user.handle}
                            </p>
                          )}
                        </div>

                        <p className="shrink-0 text-xs text-slate-400">
                          {new Date(request.created_at).toLocaleDateString("ja-JP")}
                        </p>
                      </div>

                      <p className="mt-3 font-bold text-sky-300">{request.title}</p>

                      <p className="mt-2 whitespace-pre-wrap text-slate-300">
                        {request.body}
                      </p>

                      {request.admin_comment && (
                        <div className="mt-3 rounded-lg bg-slate-800 p-2 text-xs text-slate-300">
                          管理者コメント: {request.admin_comment}
                        </div>
                      )}

                      <div className="mt-4">
                        <label className="mb-1 block text-xs text-slate-400">
                          ステータス
                        </label>
                        <select
                          value={request.status}
                          onChange={(e) =>
                            openStatusModal(
                              request,
                              e.target.value as FeatureRequestStatus,
                            )
                          }
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => refreshRequests(page - 1)}
                    className="rounded-full bg-slate-700 px-4 py-2 text-sm disabled:opacity-50"
                  >
                    ← 前へ
                  </button>

                  <span className="self-center">
                    {page} / {lastPage}
                  </span>

                  <button
                    disabled={page === lastPage}
                    onClick={() => refreshRequests(page + 1)}
                    className="rounded-full bg-slate-700 px-4 py-2 text-sm disabled:opacity-50"
                  >
                    次へ →
                  </button>
                </div>
              </>
            )}
          </section>

          <section className="mt-8 rounded-2xl bg-slate-900 p-6 shadow-xl">
            <h2 className="text-lg font-semibold">トピック管理</h2>

            <div className="mt-4 flex gap-2">
              <input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="新しいトピック"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
              />

              <button
                onClick={handleCreateTopic}
                className="rounded-full bg-slate-200 px-4 py-2 text-sm text-slate-950"
              >
                追加
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {topics.map((topic) => (
                <label
                  key={topic.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 hover:border-sky-500"
                >
                  <input
                    type="radio"
                    checked={selectedTopicId === topic.id}
                    onChange={() => setSelectedTopicId(topic.id)}
                  />

                  {topic.name}
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDeleteTopic}
                disabled={!selectedTopicId}
                className="rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-red-400 hover:bg-red-950 disabled:opacity-50"
              >
                削除
              </button>
            </div>
          </section>

          <section className="mt-8 rounded-2xl bg-slate-900 p-6 shadow-xl">
            <h2 className="text-lg font-semibold">ユーザー管理</h2>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-700 text-slate-400">
                  <tr>
                    <th className="px-3 py-2">ユーザー</th>
                    <th className="px-3 py-2">メール</th>
                    <th className="px-3 py-2">投稿数</th>
                    <th className="px-3 py-2">権限</th>
                    <th className="px-3 py-2">操作</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-800">
                      <td className="px-3 py-3">
                        <Link
                          href={`/channel/${user.id}`}
                          className="font-semibold text-sky-400 hover:text-sky-300"
                        >
                          {user.name}
                        </Link>

                        {user.handle && (
                          <p className="text-xs text-slate-400">
                            @{user.handle}
                          </p>
                        )}
                      </td>

                      <td className="px-3 py-3 text-slate-300">{user.email}</td>

                      <td className="px-3 py-3">{user.movies_count}</td>

                      <td className="px-3 py-3">
                        {user.is_admin ? "管理者" : "一般"}
                      </td>

                      <td className="px-3 py-3">
                        {user.id === currentUser?.id ? (
                          <span className="text-xs text-slate-500">
                            自分自身
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            className="rounded-full bg-red-700 px-4 py-1 text-xs font-semibold text-red-400 hover:bg-red-950"
                          >
                            削除
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-slate-800 p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold">ステータス変更</h2>

            <p className="mt-4 text-sm text-slate-300">
              {selectedRequest.title} を「{statusLabels[selectedStatus]}」に変更します。
            </p>

            <textarea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              rows={4}
              placeholder="管理者コメント"
              className="mt-4 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="text-sm text-slate-300 hover:text-white"
              >
                キャンセル
              </button>

              <button
                type="button"
                onClick={handleUpdateRequest}
                className="rounded-full bg-slate-200 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-white"
              >
                更新
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}