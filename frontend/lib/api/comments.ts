// frontend/lib/api/comments.ts
import { Comment } from "@/types/comment";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function getComments(movieId: string): Promise<Comment[]> {
  const res = await fetch(
    `${API_BASE_URL}/movies/${movieId}/comments`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return res.json();
}

export async function updateComment(
  commentId: number,
  body: string,
) {
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    }
  );

  if (!res.ok) {
    throw new Error("コメント編集に失敗しました");
  }
  return res.json();
}

export async function deleteComment(commentId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("コメント削除に失敗しました");
  }
}