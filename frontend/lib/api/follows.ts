// frontend/lib/api/follows.ts
import { getCookie, getCsrfCookie } from "@/lib/api/auth";

export type FollowResponse = {
  is_following: boolean;
  followers_count: number;
};

export type FollowingUser = {
  id: number;
  name: string;
  avatar_path: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getFollowStatus(
  userId: number
): Promise<FollowResponse> {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
    cache: "no-store",
    credentials: "include",
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch follow status");
  }

  return res.json();
}

export async function toggleFollow(
  userId: number
): Promise<FollowResponse> {
  await getCsrfCookie();

  const token = getCookie("XSRF-TOKEN");

  const res = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to toggle follow");
  }

  return res.json();
}

export async function getFollowingUsers(): Promise<FollowingUser[]> {
  const res = await fetch(`${API_BASE_URL}/me/following`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch following users");
  }

  return res.json();
}