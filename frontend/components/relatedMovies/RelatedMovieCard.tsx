// frontend/components/RelatedMovies/RelatedMovieCard.tsx
import { RelatedMovie } from "@/types/relatedMovie";
import Link from "next/link";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

type Props = {
  movie: RelatedMovie;
}

export default function RelatedMovieCard({ movie }: Props) {
  return (
    <Link href={`/movies/${movie.id}`} className="block rounded-lg hover:bg-slate-800">
      <div className="flex gap-3">
        <img
          src={movie.thumbnail_path ?? "/images/no-image.png"}
          alt={movie.title}
          className="aspect-video w-48 rounded-lg object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-bold">{movie.title}</p>

          <p className="mt-1 text-xs text-slate-400">{movie.user.name}</p>

          <p className="text-xs text-slate-400">
            {movie.views.toLocaleString()} 回視聴・{formatRelativeTime(movie.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}