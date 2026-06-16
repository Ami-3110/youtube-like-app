// frontend/components/comments/CommentSectiom.tsx
"use client";

import { useState } from "react";
import { Comment } from "@/types/comment";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";

type CommentSectionProps = {
  movieId: string;
  comments: Comment[];
};

export function CommentSection({ movieId, comments }: CommentSectionProps) {
  const [commentList, setCommentList] = useState(comments);

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
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
          />
        ))}
      </div>
    </section>
  );
}