// frontend/lib/api/profile.ts
import { getCookie, getCsrfCookie } from "@/lib/api/auth";
import type { UpdateProfileRequest } from "@/types/profile";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateProfile(
  data: UpdateProfileRequest,
) {
  await getCsrfCookie();

  const token = getCookie("XSRF-TOKEN");

  const res = await fetch(`${API_BASE_URL}/me/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
}
