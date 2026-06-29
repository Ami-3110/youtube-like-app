// frontend/app/dashboard/DashboardClient.tsx
"use client";

import { useState } from "react";
import type { Movie } from "@/types/movie";
import MovieCard from "@/components/MovieCard";
import TopicBar from "@/components/TopicBar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type DashboardClientProps = {
  movies: Movie[]
};

export default function DashboardClient({ movies }: DashboardClientProps) {
  const [selectedTopic, setSelectedTopic] = useState("すべて");
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  const filteredMovies = movies.filter((movie) => {
    const matchesTopic =
      selectedTopic === "すべて" ||
      movie.topics?.some((topic) => topic.name === selectedTopic);
    
    const matchesKeyword =
      keyword === "" ||
      movie.title.toLowerCase().includes(keyword.toLowerCase());
    
    return matchesTopic && matchesKeyword;
  });
  
  return (
    <>
      <TopicBar
        selectedTopic={selectedTopic}
        onSelectTopic={setSelectedTopic}
      />

      <main className="min-h-screen flex-1 bg-linier-to-b from-sky-950 to-slate-950 p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMovies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
              <MovieCard movie={movie} />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}