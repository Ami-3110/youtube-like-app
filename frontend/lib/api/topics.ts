// frontend/libn/api/topics.ts
import type { Topic } from "@/types/topic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTopics(): Promise<Topic[]> {
  const res = await fetch(`${API_BASE_URL}/topics`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch topics");
  }

  return res.json();
}