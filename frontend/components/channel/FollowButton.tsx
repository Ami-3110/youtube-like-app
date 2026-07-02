// frontend/components/movies/FollowButton.tsx
"use client";

import { useEffect, useState } from "react";
import { getFollowStatus, toggleFollow } from "@/lib/api/follows";
import { getCurrentUser } from "@/lib/api/auth";

type Props = {
  userId: number;
};

export default function FollowButton({ userId }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFollowStatus() {
      try {
        const currentUser = await getCurrentUser();
        setCurrentUserId(currentUser?.id ?? null);

        const data = await getFollowStatus(userId);
        setIsFollowing(data.is_following);
        setFollowersCount(data.followers_count);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFollowStatus();
  }, [userId]);

  async function handleFollow() {
    try {
      setIsLoading(true);
      const data = await toggleFollow(userId);
      setIsFollowing(data.is_following);
      setFollowersCount(data.followers_count);
      setIsMenuOpen(false);
    } catch (error) {
      console.error(error);
      alert("ログインしてください");
    } finally {
      setIsLoading(false);
    }  
  }

  if (currentUserId === userId) {
    return null;
  }

  if (!isFollowing) {
    return (
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black hover:bg-slate-200 disabled:opacity-50"
      >
        チャンネル登録
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen((prev) => !prev)}
        disabled={isLoading}
        className="rounded-full bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600 disabled:opacity-50"
      >
        登録中　▼
      </button>

      {isMenuOpen && (
        <div className="absolute left-0 top-11 z-20 w-40 overflow-hidden rounded-xl bg-slate-800 py-2 text-sm shadow-lg">
          <button className="block w-full px-4 py-2 text-left hover:bg-slate-700"
          >
            通知
          </button>

          <button
            onClick={handleFollow}
            disabled={isLoading}
            className="block w-full px-4 py-2 text-left text-red-300 hover:bg-slate-700"
          >
            登録解除
          </button>
        </div>
      )}
    </div>
  );

}

