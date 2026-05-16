import { useState, useEffect } from "react";
import { Plus, ListPlus, X, CheckCircle2, ChevronRight } from "lucide-react";

interface AddToPlaylistModalProps {
  movieId: string;
  movieTitle: string;
  onClose: () => void;
}

export default function AddToPlaylistModal({
  movieId,
  movieTitle,
  onClose,
}: AddToPlaylistModalProps) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/customer/my-playlists",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setPlaylists(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistName: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/playlist/add-movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          playlist_name: playlistName,
          movie_id: movieId,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage({ text: `Added to "${playlistName}"`, type: "success" });
        setTimeout(onClose, 1500);
      } else {
        setMessage({ text: result.message || "Failed to add", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error connecting to server", type: "error" });
    }
  };

  const handleCreateAndRefresh = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/playlist/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          playlist_name: newPlaylistName,
          visibility: "Public",
        }),
      });
      if (res.ok) {
        setNewPlaylistName("");
        setIsCreating(false);
        fetchPlaylists(); // 🟢 รีเฟรชลิสต์เมื่อสร้างอันใหม่สำเร็จ
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-3xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Add to Playlist</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {message ? (
          <div className="py-10 text-center animate-in zoom-in-95">
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
            >
              <CheckCircle2 size={24} />
            </div>
            <p className="text-sm font-medium text-white">{message.text}</p>
          </div>
        ) : isCreating ? (
          <div className="space-y-4 animate-in slide-in-from-right-4">
            <input
              autoFocus
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Enter playlist name..."
              className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm outline-none focus:border-[#A3526D]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateAndRefresh}
                className="flex-1 rounded-xl bg-[#A3526D] py-2 text-xs font-bold"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 rounded-xl bg-white/5 py-2 text-xs font-bold text-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="max-h-48 overflow-y-auto pr-1 scrollbar-none">
              {loading ? (
                <p className="text-center text-xs text-gray-600 py-4">
                  Loading...
                </p>
              ) : playlists.length === 0 ? (
                <p className="text-center text-xs text-gray-600 py-4">
                  No playlists found.
                </p>
              ) : (
                playlists.map((p) => (
                  <button
                    key={p.playlist_name}
                    onClick={() => handleAddToPlaylist(p.playlist_name)}
                    className="flex w-full items-center justify-between rounded-xl p-3 text-left hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#EAB8C9]">
                        <ListPlus size={14} />
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white truncate">
                        {p.playlist_name}
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-gray-700 group-hover:text-[#A3526D]"
                    />
                  </button>
                ))
              )}
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-3 text-xs font-bold text-gray-500 hover:border-[#A3526D] hover:text-[#EAB8C9] transition-all"
            >
              <Plus size={14} /> Create New Playlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
