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

type Props = {
  channel: Channel;
};

export default function ChannelClient({ channel }: Props) {
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


  return (
    <>
      <main className="min-h-screen bg-linear-to-b from-sky-950 to-slate-950 p-6 text-slate-200">
        <section className="mx-auto max-w-5xl">
          <div className="mx-auto flex max-w-4xl items-center gap-8 pb-6">
            <div className="flex items-center gap-5">
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

              <div>
                <h1 className="text-3xl font-bold text-slate-200">
                  {channel.name}
                </h1>
                <p className="mt-1 text-sm text-slate-400">@{channel.handle}</p>
                <SubscriberCount userId={channel.id} />
              </div>
            </div>

            <div className="md:ml-8">
              <FollowButton userId={channel.id} />
            </div>
          </div>

          <div className="my-8 border-t border-slate-400" />
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="mb-4 text-xl font-bold text-slate-200">
                投稿動画
              </h2>

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
      </main>
    </>
  );
}
