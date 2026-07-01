// frontend/lib/api/profile.ts
import { getCookie, getCsrfCookie } from "@/lib/api/auth";
import type { UpdateProfileRequest } from "@/types/profile";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateProfile(formData: FormData) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(`${API_BASE_URL}/me/profile`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: formData,
  });
  
  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
}
