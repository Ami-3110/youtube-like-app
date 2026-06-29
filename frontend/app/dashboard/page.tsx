// frontend/app/dashboard/page.tsx
import type { Movie } from "@/types/movie";
import Header from "@/components/header/Header";
import DashboardClient from "./DashboardClient";

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
    <>
      <Header />
      <DashboardClient movies={movies} />
    </>
  );
}
