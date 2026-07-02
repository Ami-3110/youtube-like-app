// frontend/components/movies/SubscriberCount.tsx
"use client";

import { useEffect, useState } from "react";
import { getFollowStatus } from "@/lib/api/follows";

type Props = {
  userId: number;
};

export default function SubscriberCount({ userId }: Props) {
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    async function fetchFollowStatus() {
      try {
        const data = await getFollowStatus(userId);
        setFollowersCount(data.followers_count);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFollowStatus();
  }, [userId]);

  return (
    <p className="text-xs text-(--text-sub)">
      チャンネル登録者数 {followersCount.toLocaleString()}人
    </p>
  );
}