// frontend/lib/api/comments.ts
import { Comment } from "@/types/comment";
import { getCookie, getCsrfCookie } from "@/lib/api/auth";

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

export async function createComment(
  movieId: string,
  body: string,
  parentId: number | null = null,
) {
  await getCsrfCookie();

  const token = getCookie("XSRF-TOKEN");

  const res = await fetch(`${API_BASE_URL}/movies/${movieId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: JSON.stringify({
      body,
      parent_id: parentId,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error(error);
    throw new Error("コメント投稿に失敗しました");
  }

  return res.json();
}

export async function updateComment(
  commentId: number,
  body: string,
) {
  await getCsrfCookie();

  const token = getCookie("XSRF-TOKEN");

  const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    throw new Error("コメント編集に失敗しました");
  }
  return res.json();
}

export async function deleteComment(commentId: number): Promise<void> {
  await getCsrfCookie();

  const token = getCookie("XSRF-TOKEN");

  const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("コメント削除に失敗しました");
  }
}