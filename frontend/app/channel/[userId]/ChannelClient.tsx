// frontend/app/channel/[userId]/ChannelClient.tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Channel } from "@/types/channel";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import FollowButton from "@/components/channel/FollowButton";
import SubscriberCount from "@/components/channel/SubscriberCount";
import { mediaUrl } from "@/lib/mediaUrl";
import { updateProfile } from "@/lib/api/profile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter, useSearchParams } from "next/navigation";

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(
    channel.avatar_path ? mediaUrl(channel.avatar_path) : "",
  );
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

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
  function handleAvatarFile(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    setAvatarFile(file);
    setAvatarPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSave() {
    try {
      const formData = new FormData();
      
        formData.append("name", name);
        formData.append("handle", handle);
        formData.append("bio", bio);

        if (avatarFile) {
          formData.append("avatar", avatarFile);
        }
      
      await updateProfile(formData);
      
      router.push(`/channel/${channel.id}`);
    } catch (error) {
      console.error(error);
      alert("プロフィールの更新に失敗しました");
    }
  }

  return (
    <>
      <main className="min-h-screen bg-linear-to-b from-(--page-from) to-(--page-to) p-6 text-(--text-main)">
        <section className="mx-auto max-w-5xl">
          <div className="mx-auto flex max-w-4xl items-center gap-8 pb-6">
            <div className="flex flex-1 items-center gap-5">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleAvatarFile(file);
                  }
                }}
              />

              <button
                type="button"
                onClick={() => {
                  if (isEditing && isOwnChannel) {
                    avatarInputRef.current?.click();
                  }
                }}
                className="group relative flex size-24 items-center justify-center overflow-hidden rounded-full bg-(--accent) text-3xl font-bold text-(--accent-text)"
              >
                {avatarPreviewUrl ? (
                  <Image
                    src={avatarPreviewUrl}
                    alt={channel.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  channel.name.slice(0, 1)
                )}

                {isEditing && isOwnChannel && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    画像変更
                  </span>
                )}
              </button>

              <div className="flex-1">
                {isEditing && isOwnChannel ? (
                  <div className="space-y-3">
                    <div className="max-w-sm">
                      <label className="mb-1 block text-sm font-semibold text-(--text-sub)">
                        チャンネル名
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-(--border) bg-(--surface-1) px-3 py-2 text-sm text-(--text-main) outline-none focus:border-(--accent)"
                      />
                    </div>

                    <div className="max-w-sm">
                      <label className="mb-1 block text-sm font-semibold text-(--text-sub)">
                        ハンドル名
                      </label>
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        className="w-full rounded-lg border border-(--border) bg-(--surface-1) px-3 py-2 text-sm text-(--text-main) outline-none focus:border-(--accent)"
                      />
                    </div>

                    <div className="max-w-xl">
                      <label className="mb-1 block text-sm font-semibold text-(--text-sub)">
                        チャンネル概要
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-(--border) bg-(--surface-1) px-3 py-2 text-sm text-(--text-main) outline-none focus:border-(--accent)"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-full bg-(--accent) px-5 py-2 text-sm font-bold text-(--accent-text) hover:opacity-90"
                      >
                        保存
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push(`/channel/${channel.id}`)}
                        className="rounded-full px-5 py-2 text-sm font-bold text-(--text-main) hover:bg-(--surface-3)"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-(--text-main)">
                      {channel.name}
                    </h1>

                    <p className="mt-1 text-sm text-(--text-sub)">
                      @{channel.handle}
                    </p>

                    <SubscriberCount userId={channel.id} />

                    {channel.bio && (
                      <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm text-(--text-sub)">
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
                    className="rounded-full border border-(--border) bg-(--surface-2) px-5 py-2 text-sm font-bold text-(--text-main) hover:bg-(--surface-3)"
                  >
                    編集
                  </button>
                ) : (
                  <FollowButton userId={channel.id} />
                ))}
            </div>
          </div>

          <div className="my-8 border-t border-(--border)" />

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-(--text-main)">
                投稿動画
              </h2>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-(--border) bg-(--surface-1) px-1 py-2 text-sm text-(--text-main) outline-none focus:border-(--accent)"
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
      </main>
    </>
  );
}
