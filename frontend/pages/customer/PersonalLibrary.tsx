import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getCurrentUserId } from "../../lib/api";

interface LibraryMovie {
  movie_id: string;
  title: string;
  img_path: string | null;
  movie_description: string | null;
  release_date: string | null;
  year: number | null;
  rating: string | null;
  country_code: string;
  purchase_date: string;
  genres: string[];
  average_rating: number;
}

function PosterSkeleton() {
  return (
    <div className="aspect-[2/3] w-full bg-gradient-to-br from-[#1a1a1a] via-[#2a1a20] to-[#0f0f0f]" />
  );
}

export default function PersonalLibrary() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();

  const [movies, setMovies] = useState<LibraryMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<LibraryMovie | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    api
      .get<{ data: LibraryMovie[] }>(`/api/me/${userId}/library`)
      .then((res) => setMovies(res.data))
      .catch((err) => setError(err.message ?? "โหลด library ไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="fixed inset-y-0 left-64 right-0 flex items-center justify-center bg-black text-gray-400">
        Loading library...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-y-0 left-64 right-0 flex items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  if (selectedMovie) {
    return (
      <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-black text-white">
        <div className="p-8">
          <button
            onClick={() => setSelectedMovie(null)}
            className="mb-6 text-sm text-gray-400 hover:text-white"
          >
            ← Back to Library
          </button>

          <div className="mx-auto max-w-5xl">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f]">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#101010] via-[#1b1518] to-black" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-[#A3526D] shadow-2xl hover:scale-110 transition-transform">
                  <span className="ml-1 text-3xl">▶</span>
                </button>
              </div>
              <div className="absolute left-5 top-5">
                <h3 className="text-lg font-semibold drop-shadow">
                  {selectedMovie.title}
                </h3>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-3xl font-bold">{selectedMovie.title}</h2>
                <p className="mt-1 text-sm text-gray-400">
                  {selectedMovie.year ?? "—"} · {selectedMovie.rating ?? "—"} ·{" "}
                  {selectedMovie.genres.join(", ") || "—"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  ⭐ {selectedMovie.average_rating.toFixed(1)} avg rating · Owned since{" "}
                  {new Date(selectedMovie.purchase_date).toLocaleDateString()}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
                  {selectedMovie.movie_description ?? "No description."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-black text-white">
      <div className="p-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Personal Library</h2>
            <p className="mt-1 text-sm text-gray-400">
              Your purchased movies are ready to watch.
            </p>
          </div>
          <span className="w-fit rounded-md border border-[#A3526D]/40 bg-[#A3526D]/20 px-3 py-1 text-xs font-semibold text-[#EAB8C9]">
            {movies.length} Movies Owned
          </span>
        </div>

        <div className="mb-6 rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your library..."
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#A3526D]"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#0f0f0f] p-10 text-center">
            <p className="text-lg font-semibold">No movies in your library</p>
            <p className="mt-1 text-sm text-gray-500">
              Purchase movies from the Home page to start your collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((movie) => (
              <button
                key={movie.movie_id}
                onClick={() => setSelectedMovie(movie)}
                className="group overflow-hidden rounded-xl border border-[#1e1e1e] bg-[#141414] text-left transition-all hover:-translate-y-1 hover:border-[#A3526D]/60 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden">
                  <PosterSkeleton />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/50">
                    <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-[#A3526D] opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                      ▶
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <span className="text-xs font-semibold text-[#EAB8C9]">Owned</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-white">{movie.title}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-gray-500">
                      {movie.year ?? "—"} · {movie.genres[0] ?? "—"}
                    </p>
                    <span className="text-xs font-semibold text-[#EAB8C9]">
                      ★ {movie.average_rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
