import { useState, useEffect, useCallback } from "react";
import { Trash2, AlertCircle, CheckCircle2, X } from "lucide-react";
import MovieCard from "../../components/customer/MovieCard";
import MoviePlayerOverlay from "../../components/customer/MoviePlayerOverlay";

type PlaylistItem = {
  movie_id: string;
  title: string;
  img_path: string;
  release_date: string;
  add_date: string;
  price?: string | number;
  average_rating?: number;
};

type ApiPlaylist = {
  playlist_name: string;
  create_date: string;
  visibility: "Public" | "Unlisted" | "Hidden";
  total_movies: string;
};

type Playlist = {
  id: string;
  name: string;
  visibility: "Public" | "Unlisted" | "Hidden";
  created: string;
  totalMovies: number;
};

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
        </div>
      ))}
    </div>
  );
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null,
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [visibility, setVisibility] = useState<
    "Public" | "Unlisted" | "Hidden"
  >("Public");

  const [alertMsg, setAlertMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  // 1. ดึงรายการเพลย์ลิสต์ทั้งหมด
  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/customer/my-playlists",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data: ApiPlaylist[] = await res.json();
      const mapped: Playlist[] = data.map((p) => ({
        id: p.playlist_name.toLowerCase().replace(/\s+/g, "-"),
        name: p.playlist_name,
        visibility: p.visibility,
        created: new Date(p.create_date).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        totalMovies: Number(p.total_movies),
      }));
      setPlaylists(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);

  // 🟢 2. ดึงรายการหนังพร้อมข้อมูล Metadata (Enrichment)
  const fetchItems = useCallback(async () => {
    if (!selectedPlaylist) return;
    setItemsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/playlist?playlist_name=${encodeURIComponent(selectedPlaylist.name)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const items: PlaylistItem[] = await res.json();

      // ดึงข้อมูลราคาและคะแนนขนานกันเพื่อให้ MovieCard แสดงผลครบ
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const detailRes = await fetch(
              `http://localhost:5000/api/movies/${item.movie_id}`,
            );
            const detail = await detailRes.json();
            return {
              ...item,
              price: detail.price,
              average_rating: detail.average_rating,
            };
          } catch {
            return item;
          }
        }),
      );
      setPlaylistItems(enrichedItems);
    } catch (error) {
      console.error(error);
    } finally {
      setItemsLoading(false);
    }
  }, [selectedPlaylist, token]);

  useEffect(() => {
    if (selectedPlaylistId) fetchItems();
  }, [selectedPlaylistId, fetchItems]);

  const handleCreatePlaylist = async () => {
    const name = newPlaylistName.trim();
    if (!name || !userId) return;

    try {
      const res = await fetch("http://localhost:5000/api/playlist/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          playlist_name: name,
          visibility,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setAlertMsg({
          text: "Playlist created successfully!",
          type: "success",
        });
        setNewPlaylistName("");
        setIsCreateOpen(false);
        fetchPlaylists();
      } else {
        setAlertMsg({
          text: result.message || "Failed to create",
          type: "error",
        });
      }
    } catch (error) {
      setAlertMsg({ text: "Something went wrong!", type: "error" });
    }
  };

  const confirmDeletePlaylist = async () => {
    if (!selectedPlaylist) return;
    try {
      const res = await fetch("http://localhost:5000/api/playlist/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          playlist_name: selectedPlaylist.name,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setAlertMsg({ text: "Playlist deleted.", type: "success" });
        setIsConfirmOpen(false);
        setSelectedPlaylistId(null);
        fetchPlaylists();
      }
    } catch (error) {
      setAlertMsg({ text: "Failed to delete", type: "error" });
    }
  };

  return (
    <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-black text-white p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Playlists</h2>
          <p className="mt-1 text-sm text-gray-400">
            Organize your movies into collections.
          </p>
        </div>
        {!selectedPlaylist && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl bg-[#A3526D] px-5 py-3 text-sm font-semibold hover:bg-[#7a3d52]"
          >
            + Create Playlist
          </button>
        )}
      </div>

      {selectedPlaylist ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setSelectedPlaylistId(null)}
            className="mb-6 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Playlists
          </button>

          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">{selectedPlaylist.name}</h2>
              <p className="text-sm text-gray-500">
                {selectedPlaylist.totalMovies} movies ·{" "}
                {selectedPlaylist.visibility}
              </p>
            </div>
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-red-900/40 px-5 py-3 text-sm text-red-400 hover:bg-red-900/10 transition-all"
            >
              <Trash2 size={16} /> Delete Playlist
            </button>
          </div>

          {itemsLoading ? (
            <div className="grid grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] animate-pulse rounded-2xl bg-zinc-900"
                />
              ))}
            </div>
          ) : playlistItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#0f0f0f] p-10 text-center text-gray-500 italic">
              No movies in this playlist yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {playlistItems.map((item) => (
                <MovieCard
                  key={item.movie_id}
                  movie={{
                    movie_id: item.movie_id,
                    title: item.title,
                    poster: item.img_path,
                    year: new Date(item.release_date).getFullYear(),
                    genre: "In List",
                    price: item.price ?? 0,
                    score: item.average_rating ?? 0,
                    stars: Math.round(Number(item.average_rating) || 0),
                    rating: 5,
                  }}
                  isPlaylistView={true}
                  playlistName={selectedPlaylist.name}
                  // 🟢 รีเฟรชทั้งหนังในหน้านี้และจำนวนหนังในหน้าหลัก
                  onRefresh={() => {
                    fetchItems();
                    fetchPlaylists();
                  }}
                  onClick={() => setSelectedMovieId(item.movie_id)}
                  onAddToCart={(e) => e.stopPropagation()}
                  inCart={false}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlaylistId(p.id)}
              className="rounded-2xl border border-[#1e1e1e] bg-[#141414] p-4 text-left hover:border-[#A3526D]/60 transition-all group"
            >
              {p.totalMovies > 0 ? (
                <CoverSkeleton />
              ) : (
                <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-[#0f0f0f] text-gray-600">
                  Empty
                </div>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white group-hover:text-[#EAB8C9]">
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {p.totalMovies} movies
                  </p>
                </div>
                <span className="rounded-md bg-[#A3526D]/20 px-2 py-1 text-[10px] text-[#EAB8C9]">
                  {p.visibility}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Popups (เหมือนเดิม) */}
      {alertMsg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xs rounded-3xl border border-white/10 bg-[#141414] p-6 text-center shadow-2xl">
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${alertMsg.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
            >
              {alertMsg.type === "success" ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
            </div>
            <p className="mb-6 text-sm font-medium text-white">
              {alertMsg.text}
            </p>
            <button
              onClick={() => setAlertMsg(null)}
              className="w-full rounded-xl bg-white/5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xs rounded-3xl border border-white/10 bg-[#141414] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <Trash2 size={24} />
            </div>
            <h3 className="mb-2 text-lg font-bold">Delete Playlist?</h3>
            <p className="mb-6 text-xs text-gray-400">
              This will permanently delete "{selectedPlaylist?.name}"
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDeletePlaylist}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600 transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-bold text-gray-400 hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-5 animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#0f0f0f] p-7 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">New Playlist</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5">
              <input
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist Name"
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-3 text-sm outline-none focus:border-[#A3526D]"
              />
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-3 text-sm outline-none"
              >
                <option value="Public">Public</option>
                <option value="Unlisted">Unlisted</option>
                <option value="Hidden">Hidden</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreatePlaylist}
                  className="flex-1 rounded-xl bg-[#A3526D] py-3 text-sm font-semibold hover:bg-[#7a3d52]"
                >
                  Create
                </button>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 rounded-xl border border-[#2a2a2a] py-3 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMovieId && (
        <MoviePlayerOverlay
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </div>
  );
}
