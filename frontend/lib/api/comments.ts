// frontend/lib/api/comments.ts
import { Comment } from "@/types/comment";

export async function getComments(movieId: string): Promise<Comment[]> {
  const res = await fetch(
    `http://localhost:8000/api/movies/${movieId}/comments`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return res.json();
}

