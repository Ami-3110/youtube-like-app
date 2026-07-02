// frontend/lib/api/adminUsers.ts
import { getCookie, getCsrfCookie } from "@/lib/api/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type AdminUser = {
  id: number;
  name: string;
  handle: string | null;
  email: string;
  avatar_path: string | null;
  is_admin: boolean;
  movies_count: number;
};

export async function getAdminUsers(): Promise<AdminUser[]> {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch admin users");
  }

  return res.json();
}

export async function deleteAdminUser(userId: number) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete admin user");
  }

  return res.json();
}