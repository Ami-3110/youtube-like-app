// frontend/app/subscriptions/page.tsx
"use client";

import Image from "next/image";
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

      <main className="min-h-screen bg-linear-to-b from-sky-950 to-slate-950 p-6 text-slate-200">
        <h1 className="text-xl font-bold">
          登録チャンネル
        </h1>


        {users.length === 0 ? (
          <p className="text-slate-400">
            登録しているチャンネルがありません。
          </p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 rounded-xl bg-slate-900/70 p-4"
              >
                <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-sky-500 font-bold text-slate-200">
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

                <p className="font-semibold">
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}