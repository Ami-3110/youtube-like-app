// frontend/components/RelatedMovies/RelatedMovieCard.tsx
import Image from "next/image";
import { RelatedMovie } from "@/types/relatedMovie";
import Link from "next/link";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { mediaUrl } from "@/lib/mediaUrl";

type Props = {
  movie: RelatedMovie;
}

export default function RelatedMovieCard({ movie }: Props) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="block rounded-lg hover:bg-(--surface-3)"
    >
      <div className="flex gap-3">
        <Image
          src={
            movie.thumbnail_path
              ? mediaUrl(movie.thumbnail_path)
              : "/images/no-image.png"
          }
          alt={movie.title}
          width={192}
          height={108}
          className="aspect-video w-48 rounded-lg object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-bold">{movie.title}</p>

          <p className="mt-1 text-xs text-(--text-sub)">
            {movie.user.name}
          </p>

          <p className="text-xs text-(--text-sub)">
            {movie.views.toLocaleString()} 回視聴・
            {formatRelativeTime(movie.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}