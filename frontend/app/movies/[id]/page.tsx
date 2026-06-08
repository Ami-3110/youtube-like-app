// frontend/app/movies/[id]/page.tsx

interface MovieDetail {
  id: number;
  title: string;
  description: string | null;
  user: string;
  movie_path: string | null;
  topics: string[];
  views: number;
  created_at: string;
}

async function getMovie(id: string): Promise<MovieDetail> {
  const res = await fetch(`http://localhost:8000/api/movies/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fewtch movie");
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

  return (
    <main className="mx-auto flex max-w-7xl gap-6 px-4 py-6 text-white">
      <section className="min-w-0 flex-1">
        {movie.movie_path && (
          <video controls className="w-full max-w-4xl rounded-xl bg-black">
            <source src={movie.movie_path} type="video/mp4" />
          </video>
        )}
        <h1 className="mt-4 text-2xl font-bold text-white">
          {movie.title}
        </h1>

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-centrer md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500 font-bold text-black">
              {movie.user.slice(0,1)}
            </div>

            <div>
              <p className="font-bold">{movie.user}</p>
              <p className="text-xs text-slate-400">チャンネル登録者数 216万人</p>
            </div>

            <button className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black hover:bg-slate-200">
              チャンネル登録
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm font-bold">
            <button className="rounded-full bg-slate-800 px-4 py-2 hover:bg-slate-700">
              👍 3282
            </button>
            <button className="rounded-full bg-slate-800 px-4 py-2 hover:bg-slate-700">
              👎
            </button>
            <button className="rounded-full bg-slate-800 px-4 py-2 hover:bg-slate-700">
              共有
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-800 p-4 text-sm">
          <p className="font-bold">
            <span>{movie.views.toLocaleString()} 回視聴 </span>
            <span>
              {new Date(movie.created_at).toLocaleDateString("ja-JP")}
            </span>
            <span className="mt-2">
              {movie.topics.map((topic) => (
                <span key={topic}> #{topic} </span>
              ))}
            </span>
          </p>

          <p className="mt-2 leading-relaxxed">
            {movie.description ?? "No description."}
          </p>
        </div>

        <section className="mt-8">
          <div className="flex item-center gap-6">
            <h2 className="text-xl font-bold">153 件のコメント</h2>
            <button className="text-sm font-bold text-slate-300">
              並べ替え
            </button>
          </div>

          <div className="mt-6 flex gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-500 text-sm font-bold">
              A
            </div>
            <div className="flex-1 border-b border-slate-600 pb-2 text-sm text-slate-400">
              コメントする...
            </div>
          </div>
        </section>
      </section>   

      <aside className="hidden w-90 shrink-0 lg:block">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="font-bold">おすすめ動画</p>
          <p className="mt-2 text-sm text-slate-400">
            ここは後でMovieCardの横長版を作る
          </p>
        </div>
      </aside>

    </main>
  );
}
