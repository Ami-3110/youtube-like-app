// frontend/components/comments/CommentForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CommentFormProps = {
  movieId: string;
};

export function CommentForm({ movieId }: CommentFormProps) {
  const [body, setBody] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:8000/api/movies/${movieId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
      }
    );

    if (!res.ok) {
      alert("コメントの投稿に失敗しました");
      return;
    }

    setBody("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex w-full gap-3">
      <div className="flex size-9 items-center justify-center rounded-full bg-slate-500 text-sm font-bold">
        A
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


