// frontend/lib/api/movies.ts

import { getCookie, getCsrfCookie } from "@/lib/api/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function uploadMovie(formData: FormData) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(`${API_BASE_URL}/movies`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload movie");
  }

  return res.json();
}
