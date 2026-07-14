// frontend/components/comments/CommentSection.tsx
"use client";

import { useState } from "react";
import { Comment } from "@/types/comment";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type CommentSectionProps = {
  movieId: string;
  comments: Comment[];
};

export function CommentSection({ movieId, comments }: CommentSectionProps) {
  const [commentList, setCommentList] = useState<Comment[]>(() =>
    comments.flatMap((comment) => [
      comment,
      ...(comment.replies ?? []),
    ]),
  );
  const { currentUser } = useCurrentUser();

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
    setCommentList((prev) => {
      if (newComment.parent_id !== null) {
        return [...prev, newComment];
      }

      return [newComment, ...prev];
    });
  }

return (
  <section className="mt-8 max-w-4xl">
    <h2 className="text-xl font-bold text-(--text-main)">
      コメント {commentList.length}件
    </h2>

    <div className="mt-6 flex gap-3">
      <CommentForm
        movieId={movieId}
        onAddComment={handleAddComment}
        currentUser={currentUser}
      />
    </div>

    <div className="mt-2 space-y-3">
      {commentList
        .filter((comment) => comment.parent_id === null)
        .map((comment) => {
          const replies = commentList.filter(
            (reply) => reply.parent_id === comment.id,
          );

          return (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                movieId={movieId}
                currentUserId={currentUser?.id ?? null}
                currentUser={currentUser}
                onUpdate={handleUpdateComment}
                onDelete={handleDeleteComment}
                onAddComment={handleAddComment}
              />

              <div className="ml-12 mt-2 space-y-2">
                {replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    movieId={movieId}
                    currentUserId={currentUser?.id ?? null}
                    currentUser={currentUser}
                    onUpdate={handleUpdateComment}
                    onDelete={handleDeleteComment}
                    onAddComment={handleAddComment}
                  />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  </section>
);
}