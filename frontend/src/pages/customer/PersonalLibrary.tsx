import { useState } from "react";

type Movie = {
  id: number;
  title: string;
  year: number;
  rating: string;
  genre: string;
  duration: string;
  score: number;
  synopsis: string;
};

const ownedMovies: Movie[] = [
  {
    id: 0,
    title: "Crimson Horizons",
    year: 2024,
    rating: "R",
    genre: "Thriller",
    duration: "1h 52m",
    score: 8.7,
    synopsis:
      "A haunting odyssey across fractured timelines. When detective Elena Cross unearths an impossible photograph, reality begins to unravel.",
  },
  {
    id: 1,
    title: "Neon Requiem",
    year: 2024,
    rating: "PG-13",
    genre: "Sci-Fi",
    duration: "1h 46m",
    score: 7.9,
    synopsis:
      "In a cyberpunk dystopia, a rogue AI composes its final symphony.",
  },
  {
    id: 3,
    title: "Hollow Crown",
    year: 2024,
    rating: "R",
    genre: "Action",
    duration: "2h 03m",
    score: 7.5,
    synopsis:
      "A deposed king wages a one-man war to reclaim his throne.",
  },
  {
    id: 7,
    title: "Echoes of Tomorrow",
    year: 2024,
    rating: "PG-13",
    genre: "Sci-Fi",
    duration: "1h 58m",
    score: 9.0,
    synopsis:
      "Earth's last astronaut receives transmissions from the future.",
  },
  {
    id: 10,
    title: "Midnight Accord",
    year: 2024,
    rating: "R",
    genre: "Crime",
    duration: "2h 10m",
    score: 8.8,
    synopsis:
      "A jazz musician becomes the linchpin of an assassination plot.",
  },
  {
    id: 4,
    title: "Aurora Drift",
    year: 2023,
    rating: "PG-13",
    genre: "Romance",
    duration: "1h 41m",
    score: 8.0,
    synopsis:
      "Two strangers share identical dreams every night until they decide to find each other.",
  },
];

function PosterSkeleton() {
  return (
    <div className="relative aspect-[2/3] overflow-hidden bg-[#101010]">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#181818] via-[#242024] to-[#0b0b0b]" />
      <div className="absolute left-4 top-4 h-8 w-8 rounded-full border border-[#A3526D]/40" />
      <div className="absolute bottom-14 left-4 right-4 h-2 rounded-full bg-white/10" />
      <div className="absolute bottom-9 left-4 h-2 w-2/3 rounded-full bg-white/10" />
      <div className="absolute bottom-4 left-4 h-2 w-1/2 rounded-full bg-[#A3526D]/30" />
    </div>
  );
}

export default function PersonalLibrary() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  if (selectedMovie) {
    return (
      <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-black text-white">
        <div className="p-8">
          <button
            onClick={() => setSelectedMovie(null)}
            className="mb-6 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Library
          </button>

          <div className="mx-auto max-w-5xl">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f]">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#101010] via-[#1b1518] to-black" />

              <div className="absolute inset-8 rounded-2xl border border-white/5 bg-black/20" />

              <div className="absolute inset-0 flex items-center justify-center">
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-[#A3526D] shadow-2xl hover:scale-110 transition-transform">
                  <span className="ml-1 text-3xl">▶</span>
                </button>
              </div>

              <div className="absolute left-5 top-5 flex items-center gap-3">
                <h3 className="text-lg font-semibold drop-shadow">
                  {selectedMovie.title}
                </h3>
                <span className="rounded-md border border-[#A3526D]/40 bg-[#A3526D]/20 px-3 py-1 text-xs font-semibold text-[#EAB8C9]">
                  Skeleton Preview
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-5">
                <div className="mb-4 h-1.5 w-full rounded-full bg-[#333]">
                  <div className="h-full w-[38%] rounded-full bg-[#A3526D]" />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div className="flex items-center gap-4">
                    <button className="hover:text-[#EAB8C9]">⏮</button>
                    <button className="rounded-full bg-[#A3526D] px-3 py-2 hover:bg-[#7a3d52]">
                      ⏸
                    </button>
                    <button className="hover:text-[#EAB8C9]">⏭</button>
                    <span>38:24 / {selectedMovie.duration}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="hover:text-white">CC</button>
                    <button className="hover:text-white">⛶</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-3xl font-bold">{selectedMovie.title}</h2>
                <p className="mt-1 text-sm text-gray-400">
                  {selectedMovie.year} · {selectedMovie.rating} ·{" "}
                  {selectedMovie.genre} · {selectedMovie.duration}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
                  {selectedMovie.synopsis}
                </p>
              </div>

              <button className="rounded-xl border border-[#2a2a2a] px-5 py-3 text-sm text-gray-300 hover:border-[#A3526D] hover:text-[#EAB8C9]">
                + Add to Playlist
              </button>
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
            {ownedMovies.length} Movies Owned
          </span>
        </div>

        <div className="mb-6 rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-4">
          <input
            type="text"
            placeholder="Search your library..."
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#A3526D]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {ownedMovies.map((movie) => (
            <button
              key={movie.id}
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
                  <span className="text-xs font-semibold text-[#EAB8C9]">
                    Owned
                  </span>
                </div>
              </div>

              <div className="p-3">
                <p className="truncate text-sm font-semibold text-white">
                  {movie.title}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-gray-500">
                    {movie.year} · {movie.genre}
                  </p>
                  <span className="text-xs font-semibold text-[#EAB8C9]">
                    ★ {movie.score}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
