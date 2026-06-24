// frontend/components/relatedMovies/RelatedMovies.tsx
"use client";

import { useEffect, useState } from "react";
import { getRelatedMovies } from "@/lib/api/relatedMovies";
import { RelatedMovie } from "@/types/relatedMovie";
import RelatedMovieCard from "./RelatedMovieCard";
import RelatedTopicFilter from "./RelatedTopicFilter";

type Props = {
  movieId: number;
  topics: string[];
};

export default function RelatedMovies({ movieId, topics }: Props) {
  const [movies, setMovies] = useState<RelatedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTopics, setActiveTopics] = useState<string[]>(topics);

  function toggleTopic(topicName: string) {
    setActiveTopics((prev) =>
      prev.includes(topicName)
        ? prev.filter((topic) => topic !== topicName)
        : [...prev, topicName],
    );
  }

  const filteredMovies = movies.filter((movie) =>
    movie.topics.some((topic) => activeTopics.includes(topic.name)),
  );

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getRelatedMovies(movieId);
        setMovies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMovies();
  }, [movieId]);

  if (isLoading) {
    return <p className="text-slate-400">読み込み中...</p>;
  }

  return (
    <div className="space-y-4">
      <RelatedTopicFilter
        topics={topics}
        activeTopics={activeTopics}
        onToggleTopic={toggleTopic}
      />

      <div className="space-y-3">
        {filteredMovies.map((movie) => (
          <RelatedMovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}