// frontend/app/movies/[id]/edit/page.tsx
import { getMovie } from "@/lib/api/movies";
import MovieForm from "@/components/movies/MovieForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MovieEditPage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovie(id);

  return (
    <main className="min-h-screen bg-slate-950 p-6">
      <MovieForm initialMovie={movie} />
    </main>
  );
}