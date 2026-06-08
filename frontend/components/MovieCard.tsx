// frontend/components/MovieCard.tsx
import type { Movie } from "@/types/movie";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import Image from "next/image";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  return (
    <article
      className="cursor-pointer rounded-2xl p-2 transition-all duration-500 hover:bg-slate-700 hover:shadow-xl"
    >
      <div className="relative mb-3 flex aspect-video overflow-hidden rounded-xl bg-slate-200 text-sm text-slate-500">
        {movie.thumbnail_path ? (
          <Image
            src={movie.thumbnail_path}
            alt={movie.title}
            fill
            className="object-cover transition duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No thumbnail
              </div>
        )}
      </div>

      <h2 className="line-clamp-2 text-base font-semibold">{movie.title}</h2>

      <p className="mt-1 text-sm text-slate-600">{movie.user}</p>

      <p className="text-sm text-slate-500">
        {movie.views.toLocaleString()} 回視聴・{formatRelativeTime(movie.created_at)}
      </p>
      
    </article>
  );
}
