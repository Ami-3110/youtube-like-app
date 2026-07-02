// frontend/app/subscriptions/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import {
  FollowingUser,
  getFollowingUsers
} from "@/lib/api/follows";
import { mediaUrl } from "@/lib/mediaUrl";

export default function SubscriptionPage() {
  const [users, setUsers] = useState<FollowingUser[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getFollowingUsers();
      setUsers(data);
    }

    fetchUsers();
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-linear-to-b from-(--page-from) to-(--page-to) p-6 text-[var(--text-main)]">
        <h1 className="text-xl font-bold">登録チャンネル</h1>

        {users.length === 0 ? (
          <p className="text-[var(--text-sub)]">
            登録しているチャンネルがありません。
          </p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <Link key={user.id} href={`/channel/${user.id}`}>
                <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-4 hover:bg-[var(--surface-3)]">
                  <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-[var(--accent)] font-bold text-[var(--accent-text)]">
                    {user.avatar_path ? (
                      <Image
                        src={mediaUrl(user.avatar_path)}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>

                  <p className="font-semibold">{user.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}