// frontend/app/embed/movie/[id]/page.tsx

import { MovieDetail } from "@/types/movie";

async function getMovie(id: string): Promise<MovieDetail> {
  const res = await fetch(`http://localhost:8000/api/movies/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie");
  }

  return res.json();
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EmbedMoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovie(id);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      {movie.movie_path && (
        <video controls className="w-full max-w-4xl bg-black">
          <source src={movie.movie_path} type="video/mp4" />
        </video>
      )}
    </main>
  );
}