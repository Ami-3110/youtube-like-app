// frontend/lib/api/adminTopics.ts
import { getCookie, getCsrfCookie } from "@/lib/api/auth";
import type { Topic } from "@/types/topic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAdminTopics(): Promise<Topic[]> {
  const res = await fetch(`${API_BASE_URL}/admin/topics`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch admin topics");
  }

  return res.json();
}

export async function createAdminTopic(name: string) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(`${API_BASE_URL}/admin/topics`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Failed to create admin topic");
  }

  return res.json();
}

export async function deleteAdminTopic(topicId: number) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(`${API_BASE_URL}/admin/topics/${topicId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete admin topic");
  }

  return res.json();
}