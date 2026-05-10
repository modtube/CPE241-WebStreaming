import { useState } from "react";

type Movie = {
  id: number;
  title: string;
  year: number;
  rating: string;
  genre: string;
  score: number;
};

type Playlist = {
  id: string;
  name: string;
  movieIds: number[];
  visibility: "Private" | "Public";
  created: string;
};

const movieCatalog: Record<number, Movie> = {
  0: {
    id: 0,
    title: "Crimson Horizons",
    year: 2024,
    rating: "R",
    genre: "Thriller",
    score: 8.7,
  },
  1: {
    id: 1,
    title: "Neon Requiem",
    year: 2024,
    rating: "PG-13",
    genre: "Sci-Fi",
    score: 7.9,
  },
  2: {
    id: 2,
    title: "The Last Garden",
    year: 2023,
    rating: "PG",
    genre: "Drama",
    score: 8.2,
  },
  3: {
    id: 3,
    title: "Hollow Crown",
    year: 2024,
    rating: "R",
    genre: "Action",
    score: 7.5,
  },
  4: {
    id: 4,
    title: "Aurora Drift",
    year: 2023,
    rating: "PG-13",
    genre: "Romance",
    score: 8.0,
  },
  5: {
    id: 5,
    title: "Shadow Protocol",
    year: 2024,
    rating: "R",
    genre: "Action",
    score: 7.6,
  },
  7: {
    id: 7,
    title: "Echoes of Tomorrow",
    year: 2024,
    rating: "PG-13",
    genre: "Sci-Fi",
    score: 9.0,
  },
  8: {
    id: 8,
    title: "Burning Atlas",
    year: 2023,
    rating: "R",
    genre: "Thriller",
    score: 7.1,
  },
  10: {
    id: 10,
    title: "Midnight Accord",
    year: 2024,
    rating: "R",
    genre: "Crime",
    score: 8.8,
  },
  11: {
    id: 11,
    title: "The Velvet Room",
    year: 2023,
    rating: "PG",
    genre: "Comedy",
    score: 7.3,
  },
};

const initialPlaylists: Playlist[] = [
  {
    id: "watchlist-2024",
    name: "Watchlist 2024",
    movieIds: [0, 1, 7],
    visibility: "Private",
    created: "Dec 2024",
  },
  {
    id: "thrillers-dark",
    name: "Thrillers & Dark",
    movieIds: [0, 3, 5, 8, 10],
    visibility: "Private",
    created: "Oct 2024",
  },
  {
    id: "weekend-chill",
    name: "Weekend Chill",
    movieIds: [2, 4, 11],
    visibility: "Public",
    created: "Sep 2024",
  },
];

function CoverSkeleton() {
  return (
    <div className="mb-4 grid h-40 grid-cols-2 gap-1 overflow-hidden rounded-xl bg-[#0f0f0f]">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden bg-[#181818] animate-pulse"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-[#A3526D]/10 to-transparent" />
          <div className="absolute left-3 top-3 h-5 w-5 rounded-full border border-white/10" />
          <div className="absolute bottom-4 left-3 h-2 w-2/3 rounded-full bg-white/10" />
          <div className="absolute bottom-8 left-3 h-2 w-1/2 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

function MovieThumbSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#101010] animate-pulse ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-[#A3526D]/10 to-transparent" />
      <div className="absolute left-2 top-2 h-3 w-3 rounded-full border border-white/10" />
      <div className="absolute bottom-3 left-2 right-2 h-1.5 rounded-full bg-white/10" />
    </div>
  );
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const selectedPlaylist = playlists.find(
    (playlist) => playlist.id === selectedPlaylistId
  );

  const createPlaylist = () => {
    const name = newPlaylistName.trim();

    if (!name) return;

    const newPlaylist: Playlist = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      movieIds: [],
      visibility: "Private",
      created: "Today",
    };

    setPlaylists((current) => [newPlaylist, ...current]);
    setNewPlaylistName("");
    setIsCreateOpen(false);
  };

  const deleteSelectedPlaylist = () => {
    if (!selectedPlaylist) return;

    setPlaylists((current) =>
      current.filter((playlist) => playlist.id !== selectedPlaylist.id)
    );
    setSelectedPlaylistId(null);
  };

  if (selectedPlaylist) {
    const playlistMovies = selectedPlaylist.movieIds
      .map((movieId) => movieCatalog[movieId])
      .filter((movie): movie is Movie => Boolean(movie));

    return (
      <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-black text-white">
        <div className="p-8">
          <button
            onClick={() => setSelectedPlaylistId(null)}
            className="mb-6 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Playlists
          </button>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">{selectedPlaylist.name}</h2>
              <p className="mt-1 text-sm text-gray-400">
                {playlistMovies.length} movies · Created{" "}
                {selectedPlaylist.created} · {selectedPlaylist.visibility}
              </p>
            </div>

            <button
              onClick={deleteSelectedPlaylist}
              className="w-fit rounded-xl border border-red-900 px-5 py-3 text-sm text-red-400 hover:border-red-600 hover:text-red-300"
            >
              Delete Playlist
            </button>
          </div>

          {playlistMovies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#0f0f0f] p-10 text-center">
              <p className="text-lg font-semibold">No movies yet</p>
              <p className="mt-1 text-sm text-gray-500">
                This is only a skeleton page. Later, connect this to your movie
                library.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {playlistMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center gap-4 rounded-2xl border border-[#1e1e1e] bg-[#141414] p-3 transition-colors hover:border-[#A3526D]/60"
                >
                  <MovieThumbSkeleton className="h-24 w-16 flex-shrink-0" />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-white">
                      {movie.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {movie.year} · {movie.rating} · {movie.genre}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#EAB8C9]">
                      ★ {movie.score}
                    </p>
                  </div>

                  <button className="rounded-xl border border-[#2a2a2a] px-4 py-2 text-sm text-gray-400 hover:border-[#A3526D] hover:text-[#EAB8C9]">
                    Watch
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-black text-white">
      <div className="p-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Playlists</h2>
            <p className="mt-1 text-sm text-gray-400">
              Organize your movies into custom collections.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-fit rounded-xl bg-[#A3526D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#7a3d52]"
          >
            + Create Playlist
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => setSelectedPlaylistId(playlist.id)}
              className="rounded-2xl border border-[#1e1e1e] bg-[#141414] p-4 text-left transition-all hover:-translate-y-1 hover:border-[#A3526D]/60 hover:shadow-2xl"
            >
              {playlist.movieIds.length > 0 ? (
                <CoverSkeleton />
              ) : (
                <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-[#0f0f0f] text-sm text-gray-600">
                  Empty Playlist
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-white">
                    {playlist.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {playlist.movieIds.length} movies · {playlist.created}
                  </p>
                </div>

                <span className="rounded-md border border-[#A3526D]/40 bg-[#A3526D]/20 px-2 py-1 text-xs font-semibold text-[#EAB8C9]">
                  {playlist.visibility}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed bottom-0 left-64 right-0 top-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#0f0f0f] p-7">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Create New Playlist</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-400">
                  Playlist Name
                </label>
                <input
                  value={newPlaylistName}
                  onChange={(event) => setNewPlaylistName(event.target.value)}
                  placeholder="e.g. Friday Night Films"
                  className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#A3526D]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-400">
                  Visibility
                </label>
                <select className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#A3526D]">
                  <option>Private</option>
                  <option>Public</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={createPlaylist}
                  className="flex-1 rounded-xl bg-[#A3526D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#7a3d52]"
                >
                  Create Playlist
                </button>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 rounded-xl border border-[#2a2a2a] px-5 py-3 text-sm text-gray-400 hover:border-[#A3526D] hover:text-[#EAB8C9]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
