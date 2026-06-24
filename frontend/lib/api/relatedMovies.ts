// frontend/lib/api/relatedMovies.ts
import { RelatedMovie } from "@/types/relatedMovie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRelatedMovies(
  movieId: number,
):Promise<RelatedMovie[]> {
  const response = await fetch(`${API_BASE_URL}/movies/${movieId}/related`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("おすすめ動画の取得に失敗しました");
  }

  return response.json();
}