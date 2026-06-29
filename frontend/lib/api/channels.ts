// frontend/lib/api/channels.ts
import type { Channel } from "@/types/channel";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getChannel(
  userId: number,
): Promise<Channel> {
  const res = await fetch(
    `${API_BASE_URL}/users/${userId}/channel`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch channel");
  }

  return res.json();
}