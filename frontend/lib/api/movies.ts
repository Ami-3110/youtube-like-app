// frontend/lib/api/movies.ts
import type { MovieDetail } from "@/types/movie";
import { getCookie, getCsrfCookie } from "@/lib/api/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMovie(movieId: string): Promise<MovieDetail> {
  const res = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie");
  }

  return res.json();
}

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

export async function updateMovie(
  movieId: number,
  formData: FormData,
) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update movie");
  }

  return res.json();
}

export async function deleteMovie(movieId: number) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete movie");
  }

  return res.json();
}
