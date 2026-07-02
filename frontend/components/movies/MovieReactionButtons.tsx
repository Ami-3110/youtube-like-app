// frontend/components/movies/MovieReactionButtons.tsx

"use client";

import { useEffect, useState } from "react";
import {
  getMovieReaction,
  MovieReactionResponse,
  toggleMovieReaction,
} from "@/lib/api/movieReactions";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";

type Props = {
  movieId: number;
};

export default function MovieReactionButtons({ movieId }: Props) {
  const [reaction, setReaction] = useState<MovieReactionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLike() {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await toggleMovieReaction(movieId, "like");
      setReaction(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDislike() {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await toggleMovieReaction(movieId, "dislike");
      setReaction(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function fetchReaction() {
      const data = await getMovieReaction(movieId);
      setReaction(data);
    }

    fetchReaction();
  }, [movieId]);

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={handleLike}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-[var(--surface-3)] disabled:opacity-50"
      >
        {reaction?.my_reaction === "like" ? (
          <AiFillLike size={20} />
        ) : (
          <AiOutlineLike size={20} />
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
          <AiFillDislike size={20} />
        ) : (
          <AiOutlineDislike size={20} />
        )}
      </button>
    </div>
  );
}