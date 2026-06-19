// frontend/lib/api/movieReactions.ts
import { getCookie, getCsrfCookie } from "@/lib/api/auth";

export type MovieReactionType = "like" | "dislike";

export type MovieReactionResponse = {
  like_count: number;
  dislike_count: number;
  my_reaction: MovieReactionType | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMovieReaction(
  movieId: number
): Promise<MovieReactionResponse> {
  const res = await fetch(`${API_BASE_URL}/movies/${movieId}/reactions`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie reaction");
  }
  
  return res.json();
}

export async function toggleMovieReaction(
  movieId: number,
  type: MovieReactionType
): Promise<MovieReactionResponse> {
  await getCsrfCookie();

  const token = getCookie("XSRF-TOKEN");
  
  const res = await fetch(`${API_BASE_URL}/movies/${movieId}/reactions`, {
    method: "POST",
    headers: {
      "Content-Type": "applocation/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: JSON.stringify({ type }),
  });
  
  if (!res.ok) {
    throw new Error("Failed to toggle movie reaction");
  }

  return res.json();
}