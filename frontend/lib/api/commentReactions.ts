// frontend/lib/api/commentReactions.ts
import { getCookie, getCsrfCookie } from "@/lib/api/auth";

export type CommentReactionType = "like" | "dislike";

export type CommentReactionResponse = {
  like_count: number;
  dislike_count: number;
  my_reaction: CommentReactionType | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCommentReaction(
  commentId: number
): Promise<CommentReactionResponse> {
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}/reactions`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch comment reaction");
  }
  
  return res.json();
}

export async function toggleCommentReaction(
  commentId: number,
  type: CommentReactionType
): Promise<CommentReactionResponse> {
  await getCsrfCookie();

  const token = getCookie("XSRF-TOKEN");
  
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}/reactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: JSON.stringify({ type }),
  });
  
  if (!res.ok) {
    throw new Error("Failed to toggle comment reaction");
  }

  return res.json();
}