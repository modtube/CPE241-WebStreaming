import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getCurrentUserId } from "../../lib/api";

interface Playlist {
  user_id: string;
  playlist_name: string;
  create_date: string;
  visibility: "Public" | "Unlisted" | "Hidden";
  item_count: number;
}

interface PlaylistItem {
  user_id: string;
  playlist_name: string;
  movie_id: string;
  add_date: string;
  title: string;
  year: number | null;
  rating: string | null;
  price: string;
  genres: string[];
  average_rating: number;
}

interface MovieSearchResult {
  movie_id: string;
  title: string;
  release_date: string | null;
  rating: string | null;
}

function MovieThumbSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-[#141414] ${className ?? ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-[#A3526D]/10 to-transparent" />
    </div>
  );
}

export default function Playlists() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [items, setItems] = useState<PlaylistItem[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // create form
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newVisibility, setNewVisibility] = useState<"Public" | "Unlisted" | "Hidden">(
    "Hidden"
  );

  // add movie modal
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [movieSearch, setMovieSearch] = useState("");
  const [movieResults, setMovieResults] = useState<MovieSearchResult[]>([]);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    loadPlaylists();
  }, [userId, navigate]);

  const loadPlaylists = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get<{ data: Playlist[] }>(
        `/api/users/${userId}/playlists`
      );
      setPlaylists(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async (playlistName: string) => {
    if (!userId) return;
    try {
      const res = await api.get<{ data: PlaylistItem[] }>(
        `/api/users/${userId}/playlists/${encodeURIComponent(playlistName)}/items`
      );
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPlaylist = (name: string) => {
    setSelectedName(name);
    loadItems(name);
  };

  const handleCreate = async () => {
    if (!userId || !newName.trim()) return;
    try {
      await api.post(`/api/users/${userId}/playlists`, {
        playlist_name: newName.trim(),
        visibility: newVisibility,
      });
      setNewName("");
      setNewVisibility("Hidden");
      setIsCreateOpen(false);
      loadPlaylists();
    } catch (err) {
      alert(err instanceof Error ? err.message : "สร้าง playlist ไม่สำเร็จ");
    }
  };

  const handleDeletePlaylist = async () => {
    if (!userId || !selectedName) return;
    if (!confirm(`ลบ playlist "${selectedName}"?`)) return;
    try {
      await api.delete(
        `/api/users/${userId}/playlists/${encodeURIComponent(selectedName)}`
      );
      setSelectedName(null);
      loadPlaylists();
    } catch (err) {
      alert(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    }
  };

  const handleRemoveItem = async (movieId: string) => {
    if (!userId || !selectedName) return;
    try {
      await api.delete(
        `/api/users/${userId}/playlists/${encodeURIComponent(
          selectedName
        )}/items/${movieId}`
      );
      loadItems(selectedName);
      loadPlaylists();
    } catch (err) {
      alert(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    }
  };

  const searchMovies = async (q: string) => {
    if (!q.trim()) {
      setMovieResults([]);
      return;
    }
    try {
      const res = await api.get<{ data: MovieSearchResult[] }>(
        `/api/movies?search=${encodeURIComponent(q)}&limit=10`
      );
      setMovieResults(res.data ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMovie = async (movieId: string) => {
    if (!userId || !selectedName) return;
    try {
      await api.post(
        `/api/users/${userId}/playlists/${encodeURIComponent(selectedName)}/items`,
        { movie_id: movieId }
      );
      setIsAddMovieOpen(false);
      setMovieSearch("");
      setMovieResults([]);
      loadItems(selectedName);
      loadPlaylists();
    } catch (err) {
      alert(err instanceof Error ? err.message : "เพิ่มไม่สำเร็จ");
    }
  };

  const selected = playlists.find((p) => p.playlist_name === selectedName);

  // ===== ดูรายละเอียด playlist =====
  if (selected) {
    return (
      <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-black text-white">
        <div className="p-8">
          <button
            onClick={() => setSelectedName(null)}
            className="mb-6 text-sm text-gray-400 hover:text-white"
          >
            ← Back to Playlists
          </button>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">{selected.playlist_name}</h2>
              <p className="mt-1 text-sm text-gray-400">
                {selected.item_count} movies · Created{" "}
                {new Date(selected.create_date).toLocaleDateString()} ·{" "}
                {selected.visibility}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsAddMovieOpen(true)}
                className="rounded-xl border border-[#A3526D] px-4 py-2 text-sm text-[#EAB8C9] hover:bg-[#A3526D]/20"
              >
                + Add Movie
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="rounded-xl border border-red-900 px-4 py-2 text-sm text-red-400 hover:border-red-600 hover:text-red-300"
              >
                Delete Playlist
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#0f0f0f] p-10 text-center">
              <p className="text-lg font-semibold">No movies yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Click "Add Movie" to start adding to this playlist.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.movie_id}
                  className="flex items-center gap-4 rounded-2xl border border-[#1e1e1e] bg-[#141414] p-3 transition-colors hover:border-[#A3526D]/60"
                >
                  <MovieThumbSkeleton className="h-24 w-16 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-white">
                      {it.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {it.year ?? "—"} · {it.rating ?? "—"} · {it.genres[0] ?? "—"} · ⭐{" "}
                      {it.average_rating.toFixed(1)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(it.movie_id)}
                    className="text-sm text-red-400 hover:text-red-300 px-3 py-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Movie Modal */}
        {isAddMovieOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl w-full max-w-lg p-6 mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add a Movie</h3>
                <button
                  onClick={() => {
                    setIsAddMovieOpen(false);
                    setMovieSearch("");
                    setMovieResults([]);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <input
                type="text"
                value={movieSearch}
                onChange={(e) => {
                  setMovieSearch(e.target.value);
                  searchMovies(e.target.value);
                }}
                placeholder="Search by title..."
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white outline-none focus:border-[#A3526D]"
              />

              <div className="mt-4 max-h-64 overflow-y-auto space-y-2">
                {movieResults.map((m) => (
                  <button
                    key={m.movie_id}
                    onClick={() => handleAddMovie(m.movie_id)}
                    className="w-full text-left p-3 rounded-lg border border-[#2a2a2a] hover:border-[#A3526D] hover:bg-[#A3526D]/10"
                  >
                    <p className="font-semibold">{m.title}</p>
                    <p className="text-xs text-gray-500">
                      {m.movie_id} · {m.rating ?? "—"} ·{" "}
                      {m.release_date?.slice(0, 4) ?? "—"}
                    </p>
                  </button>
                ))}
                {movieSearch && movieResults.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No results</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===== หน้ารวม playlists =====
  return (
    <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-black text-white">
      <div className="p-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">My Playlists</h2>
            <p className="mt-1 text-sm text-gray-400">
              Organize your movies into custom collections.
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl bg-[#A3526D] hover:bg-[#7a3d52] px-5 py-3 text-sm font-semibold"
          >
            + New Playlist
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading playlists...</p>
        ) : playlists.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#0f0f0f] p-10 text-center">
            <p className="text-lg font-semibold">No playlists yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first playlist to organize your favorite movies.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((pl) => (
              <button
                key={pl.playlist_name}
                onClick={() => handleSelectPlaylist(pl.playlist_name)}
                className="rounded-2xl border border-[#1e1e1e] bg-[#141414] p-5 text-left transition-all hover:-translate-y-1 hover:border-[#A3526D]/60 hover:shadow-2xl"
              >
                <MovieThumbSkeleton className="h-32 w-full mb-4" />
                <h3 className="text-lg font-semibold">{pl.playlist_name}</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {pl.item_count} movies · {pl.visibility}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Created {new Date(pl.create_date).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Playlist Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">New Playlist</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="My Favorites"
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white outline-none focus:border-[#A3526D]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Visibility
                </label>
                <select
                  value={newVisibility}
                  onChange={(e) =>
                    setNewVisibility(
                      e.target.value as "Public" | "Unlisted" | "Hidden"
                    )
                  }
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white outline-none focus:border-[#A3526D]"
                >
                  <option value="Hidden">Hidden (only me)</option>
                  <option value="Unlisted">Unlisted (link only)</option>
                  <option value="Public">Public (everyone)</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleCreate}
                className="flex-1 bg-[#A3526D] hover:bg-[#7a3d52] text-white rounded-lg py-3 text-sm font-semibold"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="flex-1 border border-[#2a2a2a] text-gray-400 hover:text-white rounded-lg py-3 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
