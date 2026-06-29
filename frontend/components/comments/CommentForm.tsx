// frontend/components/comments/CommentForm.tsx
"use client";

import { useState } from "react";
import { Comment } from "@/types/comment";
import { mediaUrl } from "@/lib/mediaUrl";
import { createComment } from "@/lib/api/comments";

type CommentFormProps = {
  movieId: string;
  parentId?: number | null;
  onAddComment: (comment: Comment) => void;
  currentUser: {
    id: number;
    name: string;
    avatar_path: string | null;
  } | null;
};

export function CommentForm({
  movieId,
  parentId = null,
  onAddComment,
  currentUser,
}: CommentFormProps) {
  const [body, setBody] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const newComment = await createComment(
        movieId,
        body,
        parentId,
      );

      onAddComment(newComment);
      setBody("");
    } catch {
      alert("コメントの投稿に失敗しました");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex w-full gap-3">
      <div className="flex shrink-0 size-9 items-center justify-center overflow-hidden rounded-full bg-slate-500 text-sm font-bold text-white">
        {currentUser?.avatar_path ? (
          <img
            src={mediaUrl(currentUser.avatar_path)}
            alt={currentUser.name}
            className="h-full w-full object-cover"
          />
        ) : (
            currentUser?.name?.slice(0,1) ?? "A"
        )}
      </div>

      <div className="flex-1">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="コメントする..."
          rows={1}
          className="
            block
            w-full
            resize-none
            border-b
            border-slate-600
            bg-transparent        
            pb-2
            text-sm
            text-white
            placeholder:text-slate-400
            focus:outline-none
            focus:border-slate-300
          "
        />
        {body.trim() && (
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setBody("")}
              className="rounded-full px-4 py-2 text-sm hover:bg-slate-800"
            >
              キャンセル
            </button>

            <button
              type="submit"
              className="rounded-full bg-slate-700 px-4 py-2 text-sm font-bold text-slate-400"
            >
              コメント
            </button>
          </div>
        )}
      </div>
    </form>
  );
}


