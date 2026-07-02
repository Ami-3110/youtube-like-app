// frontend/components/comments/CommentReactionButtons.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getCommentReaction,
  CommentReactionResponse,
  toggleCommentReaction,
} from "@/lib/api/commentReactions";
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from "react-icons/ai";

type Props = {
  commentId: number;
};

export default function CommentReactionButton({ commentId }: Props) {
  const [reaction, setReaction] = useState<CommentReactionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLike() {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await toggleCommentReaction(commentId, "like");
      setReaction(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDislike() {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await toggleCommentReaction(commentId, "dislike");
      setReaction(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function fetchReaction() {
      const data = await getCommentReaction(commentId);
      setReaction(data);
    }

    fetchReaction();
  }, [commentId]);

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={handleLike}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-[var(--surface-3)] disabled:opacity-50"
      >
        {reaction?.my_reaction === "like" ? (
          <AiFillLike size={16} />
        ) : (
          <AiOutlineLike size={16} />
        )}

        {reaction?.like_count ?? 0}
      </button>

      <button
        type="button"
        onClick={handleDislike}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-[var(--surface-3)] disabled:opacity-50"
      >
        {reaction?.my_reaction === "dislike" ? (
          <AiFillDislike size={16} />
        ) : (
          <AiOutlineDislike size={16} />
        )}
      </button>
    </div>
  );
}