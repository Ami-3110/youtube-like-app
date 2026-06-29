// frontend/app/movies/[id]/page.tsx
import Image from "next/image";
import { CommentSection } from "@/components/comments/CommentSection";
import { getComments } from "@/lib/api/comments";
import { mediaUrl } from "@/lib/mediaUrl";
import { ShareButton } from "@/components/movies/ShareButton";
import  MovieReactionButtons from "@/components/movies/MovieReactionButtons";
import type { MovieDetail } from "@/types/movie";
import Header from "@/components/header/Header";
import RelatedMovies from "@/components/relatedMovies/RelatedMovies";
import FollowButton from "@/components/movies/FollowButton";
import SubscriberCount from "@/components/movies/SubscriberCount";

async function getMovie(id: string): Promise<MovieDetail> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movie");
  }

  return res.json();
}

export default async function MovieDetailPage({
  params,
}: {
    params: Promise<{ id: string }>;
  }) {
  const { id } = await params;
  const movie = await getMovie(id);
  const comments = await getComments(id);

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-350 gap-6 px-4 pt-10 pb-6 text-white">
        <section className="min-w-0 flex-1">
          {movie.movie_path && (
            <video controls className="w-full rounded-xl bg-black">
              <source src={mediaUrl(movie.movie_path)} type="video/mp4" />
            </video>
          )}
          <h1 className="mt-4 text-2xl font-bold text-white">{movie.title}</h1>

          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-emerald-500 font-bold text-black">
                {movie.user.avatar_path ? (
                  <Image
                    src={mediaUrl(movie.user.avatar_path)}
                    alt={movie.user.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  movie.user.name.slice(0, 1)
                )}
              </div>

              <div>
                <p className="font-bold">{movie.user.name}</p>
                <SubscriberCount userId={movie.user.id} />
              </div>

              <FollowButton userId={movie.user.id} />
            </div>

            <div className="flex items-center gap-2 text-sm font-bold">
              <MovieReactionButtons movieId={movie.id} />
              <ShareButton movieId={movie.id} title={movie.title} />
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-800 p-4 text-sm">
            <div className="font-bold">
              <span>{movie.views.toLocaleString()} 回視聴 </span>
              <span>
                {new Date(movie.created_at).toLocaleDateString("ja-JP")}
              </span>
              {movie.topics.map((topic) => (
                <span key={topic.id} className="mr-1">
                  #{topic.name}
                </span>
              ))}
            </div>

            <p className="mt-2 leading-relaxed">
              {movie.description ?? "No description."}
            </p>
          </div>

          <CommentSection movieId={id} comments={comments} />
        </section>

        <aside className="hidden w-90 shrink-0 lg:block">
          <div className="rounded-xl bg-slate-900 p-4">
            <p className="font-bold">おすすめ動画</p>
            <RelatedMovies
              movieId={movie.id}
              topics={movie.topics.map((topic) => topic.name)}
            />
          </div>
        </aside>
      </main>
    </>
  );
}
