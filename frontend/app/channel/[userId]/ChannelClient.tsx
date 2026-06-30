// frontend/app/channel/[userId]/ChannelClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { Channel } from "@/types/channel";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import FollowButton from "@/components/channel/FollowButton";
import SubscriberCount from "@/components/channel/SubscriberCount";
import { mediaUrl } from "@/lib/mediaUrl";
import { updateProfile, deleteProfile } from "@/lib/api/profile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter, useSearchParams } from "next/navigation";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

type Props = {
  channel: Channel;
};

export default function ChannelClient({ channel }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useCurrentUser();
  const isEditing = searchParams.get("edit") === "true";
  const isOwnChannel = currentUser?.id === channel.id;

  const [name, setName] = useState(channel.name);
  const [handle, setHandle] = useState(channel.handle ?? "");
  const [bio, setBio] = useState(channel.bio ?? "");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [sortBy, setSortBy] = useState("newest");
  const sortedMovies = [...channel.movies].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return (
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        );
      
      case "views":
        return b.views - a.views;
      
      default:
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
    }
  });

  async function handleSave() {
    try {
      await updateProfile({
        name,
        handle,
        bio,
      });
      
      router.push(`/channel/${channel.id}`);
    } catch (error) {
      console.error(error);
      alert("プロフィールの更新に失敗しました");
    }
  }

  async function handleDeleteAccount() {
    try {
      await deleteProfile();

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("アカウント削除に失敗しました");
    }
  }

  return (
    <>
      <main className="min-h-screen bg-linear-to-b from-sky-950 to-slate-950 p-6 text-slate-200">
        <section className="mx-auto max-w-5xl">
          <div className="mx-auto flex max-w-4xl items-center gap-8 pb-6">
            <div className="flex flex-1 items-center gap-5">
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-emerald-500 text-3xl font-bold text-black">
                {channel.avatar_path ? (
                  <Image
                    src={mediaUrl(channel.avatar_path)}
                    alt={channel.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  channel.name.slice(0, 1)
                )}
              </div>

              <div className="flex-1">
                {isEditing && isOwnChannel ? (
                  <div className="space-y-3">
                    <div className="max-w-sm">
                      <label className="mb-1 block text-sm font-semibold text-slate-300">
                        チャンネル名
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none"
                      />
                    </div>

                    <div className="max-w-sm">
                      <label className="mb-1 block text-sm font-semibold text-slate-300">
                        ハンドル名
                      </label>
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none"
                      />
                    </div>

                    <div className="max-w-xl">
                      <label className="mb-1 block text-sm font-semibold text-slate-300">
                        チャンネル概要
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-full bg-slate-200 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-white"
                      >
                        保存
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push(`/channel/${channel.id}`)}
                        className="rounded-full px-5 py-2 text-sm font-bold text-slate-200 hover:bg-slate-800"
                      >
                        キャンセル
                      </button>
                    </div>

                    <div className="mt-8 flex justify-end border-t border-slate-700 pt-6">
                      <button
                        type="button"
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="rounded-full px-5 py-2 bg-red-700 text-sm font-semibold text-red-400 hover:bg-red-950"
                      >
                        アカウント削除
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-slate-200">
                      {channel.name}
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                      @{channel.handle}
                    </p>

                    <SubscriberCount userId={channel.id} />

                    {channel.bio && (
                      <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm text-slate-300">
                        {channel.bio}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="md:ml-8">
              {!isEditing &&
                (isOwnChannel ? (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/channel/${channel.id}?edit=true`)
                    }
                    className="rounded-full bg-slate-200 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-white"
                  >
                    編集
                  </button>
                ) : (
                  <FollowButton userId={channel.id} />
                ))}
            </div>
          </div>

          <div className="my-8 border-t border-slate-400" />
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-200">投稿動画</h2>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-1 py-2 text-sm text-slate-200 outline-none"
              >
                <option value="newest">新しい順</option>
                <option value="oldest">古い順</option>
                <option value="views">再生回数順</option>
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedMovies.map((movie) => (
                <Link key={movie.id} href={`/movies/${movie.id}`}>
                  <MovieCard movie={movie} />
                </Link>
              ))}
            </div>
          </div>
        </section>
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="アカウント削除"
          message="本当にアカウントを削除しますか？この操作は取消できません。"
          onConfirm={handleDeleteAccount}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      </main>
    </>
  );
}
