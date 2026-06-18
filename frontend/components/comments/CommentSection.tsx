// frontend/components/comments/CommentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { Comment } from "@/types/comment";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { getCurrentUser } from "@/lib/api/auth";

type CommentSectionProps = {
  movieId: string;
  comments: Comment[];
};

export function CommentSection({ movieId, comments }: CommentSectionProps) {
  const [commentList, setCommentList] = useState(comments);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      const user = await getCurrentUser();
      setCurrentUserId(user?.id ?? null);
    }

    fetchCurrentUser();
  }, []);

  function handleUpdateComment(updatedComment: Comment) {
    setCommentList((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    );
  }
  
  function handleDeleteComment(commentId: number) {
    setCommentList((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId),
    );
  }

  function handleAddComment(newComment: Comment) {
    setCommentList((prev) => [newComment, ...prev]);
  }

  return (
    <section className="mt-8 max-w-4xl">
      <h2 className="text-xl font-bold text-white">
        コメント {commentList.length}件
      </h2>

      <div className="mt-6 flex gap-3">
        <CommentForm movieId={movieId} onAddComment={handleAddComment} />
      </div>

      <div className="mt-4 space-y-4">
        {commentList.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
          />
        ))}
      </div>
    </section>
  );
}