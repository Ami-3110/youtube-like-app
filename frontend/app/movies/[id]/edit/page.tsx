// frontend/app/movies/[id]/edit/page.tsx
import { getMovie } from "@/lib/api/movies";
import Header from "@/components/header/Header";
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
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-b from-(--page-from) to-(--page-to) p-6">
        <MovieForm initialMovie={movie} />
      </main>
    </>
  );
}