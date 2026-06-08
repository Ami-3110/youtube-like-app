// frontend/app/dashboard/page.tsx
import type { Movie } from "@/types/movie";
import MovieCard from "@/components/MovieCard";
import Header from "@/components/Header";
import Link from "next/link";

async function getMovies(): Promise<Movie[]> {
  const res = await fetch("http://localhost:8000/api/movies", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  return res.json();
}

export default async function DashboardPage() {
  const movies = await getMovies();

  return (
    <main className="min-h-screen flex-1 bg-gradient-to-b from-slate-950 to-sky-950 p-6">
      <Header />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <MovieCard key={movie.id} movie={movie} />
          </Link>
        ))}
      </div>
    </main>
  );
}
