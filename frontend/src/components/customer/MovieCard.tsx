import { useState } from "react";
import type { Movie } from "./CustomerType";
import StarRating from "./StarRating";
import AddToPlaylistModal from "./AddToPlaylistModal";
import { ListPlus, Trash2, AlertTriangle, Play, Check } from "lucide-react";

export default function MovieCard({
  movie,
  onClick,
  onAddToCart,
  inCart,
  isLibraryView = false,
  isPlaylistView = false,
  isOwned = false, // 🟢 รับสถานะว่าเป็นเจ้าของแล้วหรือไม่
  playlistName = "",
  onRefresh,
}: {
  movie: Movie;
  onClick: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
  inCart: boolean;
  isLibraryView?: boolean;
  isPlaylistView?: boolean;
  isOwned?: boolean;
  playlistName?: string;
  onRefresh?: () => void;
}) {
  const [isError, setIsError] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  const handleTopRightButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // ถ้าซื้อแล้ว และไม่ได้อยู่ในหน้าจัดการเพลย์ลิสต์ ปุ่มจะไม่ทำงานในส่วนของตะกร้า
    if (isOwned && !isLibraryView && !isPlaylistView) return;

    if (isPlaylistView) {
      setShowDeleteConfirm(true);
    } else if (isLibraryView) {
      setShowPlaylistModal(true);
    } else {
      onAddToCart(e);
    }
  };

  const handleDeleteFromPlaylist = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/playlist/remove-movie",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            playlist_name: playlistName,
            movie_id: movie.movie_id,
          }),
        },
      );
      const result = await res.json();
      if (result.success) {
        setShowDeleteConfirm(false);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className="group bg-[#111] hover:bg-[#151515] border border-white/5 hover:border-[#A3526D]/30 rounded-2xl p-3 transition-all duration-300 cursor-pointer relative shadow-lg"
      >
        <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 relative">
          {!movie.poster || movie.poster.length < 5 || isError ? (
            <div className="w-full h-full flex items-center justify-center p-4 text-center text-gray-700 font-bold uppercase text-[10px]">
              {movie.title}
            </div>
          ) : (
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setIsError(true)}
            />
          )}

          <button
            onClick={handleTopRightButtonClick}
            className={`absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center shadow-xl z-20 transition-all ${
              isOwned && !isLibraryView && !isPlaylistView
                ? "bg-[#A3526D]/30 text-[#EAB8C9] cursor-default" // ปุ่มสำหรับหนังที่ซื้อแล้ว
                : isPlaylistView
                  ? "bg-red-500/80 hover:bg-red-600 text-white"
                  : isLibraryView
                    ? "bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-[#a3526d]"
                    : inCart
                      ? "bg-green-600 text-white"
                      : "bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-[#a3526d]"
            }`}
          >
            {isOwned && !isLibraryView && !isPlaylistView ? (
              <Play size={14} fill="currentColor" />
            ) : isPlaylistView ? (
              <Trash2 size={16} />
            ) : isLibraryView ? (
              <ListPlus size={16} />
            ) : inCart ? (
              <Check size={16} />
            ) : (
              "+"
            )}
          </button>
        </div>

        <div className="pt-4 px-1 pb-1">
          <h3 className="text-sm font-bold text-white mb-1 truncate group-hover:text-[#EAB8C9] transition-colors">
            {movie.title}
          </h3>
          <p className="text-[10px] text-gray-500 mb-3">
            {movie.year} · {movie.genre}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <StarRating count={movie.stars} />
              <span className="text-[10px] text-white font-bold mt-1">
                ★ {Number(movie.score).toFixed(1)}
              </span>
            </div>
            <p className="text-xs font-bold text-white tracking-tight">
              {isOwned ? (
                <span className="text-[#A3526D] text-[10px] tracking-widest">
                  OWNED
                </span>
              ) : (
                `฿${Number(movie.price).toLocaleString()}`
              )}
            </p>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 text-center">
            <AlertTriangle size={24} className="text-red-400 mb-2" />
            <p className="text-[11px] font-bold text-white mb-4">
              Remove from list?
            </p>
            <div className="flex gap-2 w-full px-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFromPlaylist();
                }}
                className="flex-1 bg-red-600 py-2 rounded-lg text-[10px] font-bold"
              >
                REMOVE
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 bg-white/10 py-2 rounded-lg text-[10px] font-bold text-gray-400"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>

      {showPlaylistModal && (
        <AddToPlaylistModal
          movieId={movie.movie_id}
          movieTitle={movie.title}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </>
  );
}
