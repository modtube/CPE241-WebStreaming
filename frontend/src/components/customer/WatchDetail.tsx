import { useState, useEffect } from "react";
import type { Movie, Review } from "./CustomerType";
import { PLACEHOLDER_CREW } from "./CustomerMockupData";
import StarRating from "./StarRating";
import StarPicker from "./StarPicker";

export default function WatchDetailsModal({
  movie,
  onClose,
  onAddToCart,
  inCart,
}: {
  movie: Movie;
  onClose: () => void;
  onAddToCart: (m: Movie) => void;
  inCart: boolean;
}) {
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasReviewed, setHasReviewed] = useState(false);

  // 🟢 1. ดึงรีวิวจาก Database
  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/home/${movie.id}/reviews`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();

      if (result && Array.isArray(result.data)) {
        setReviews(result.data);
        const currentUsername = localStorage.getItem("username");
        const alreadyDone = result.data.some(
          (rev: any) => rev.username === currentUsername,
        );
        setHasReviewed(alreadyDone);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Fetch reviews error:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    if (movie?.id) fetchReviews();
  }, [movie?.id]);

  // 🟢 2. บันทึกรีวิว
  const handlePostReview = async () => {
    if (!reviewText.trim() || reviewStars === 0) {
      alert("กรุณาเลือกดาวและพิมพ์ข้อความก่อนโพสต์ครับ");
      return;
    }

    const userId = localStorage.getItem("id");
    try {
      const response = await fetch("http://localhost:5000/api/home/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie.id,
          userId: userId,
          rating: reviewStars,
          text: reviewText,
        }),
      });

      if (response.ok) {
        setReviewText("");
        setReviewStars(0);
        fetchReviews();
      }
    } catch (error) {
      console.error("Post review error:", error);
    }
  };

  const movieTitle = encodeURIComponent(movie.title);
  const posterImg =
    movie.poster && movie.poster.startsWith("http")
      ? movie.poster
      : `https://loremflickr.com/400/600/${movieTitle},movie,poster/all`;

  const backdropImg =
    movie.backdrop && movie.backdrop.startsWith("http")
      ? movie.backdrop
      : `https://loremflickr.com/1200/600/${movieTitle},landscape,cinema/all`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl scrollbar-none"
      >
        {/* Banner Section */}
        <div className="relative h-60 overflow-hidden rounded-t-2xl bg-[#111]">
          <img
            src={backdropImg}
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#a3526d] transition-all border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* Movie Info Section */}
        <div className="px-8 pb-8 -mt-16 relative z-10">
          <div className="flex gap-6 items-start">
            <img
              src={posterImg}
              alt="poster"
              className="w-28 rounded-xl border border-white/10 shadow-2xl flex-shrink-0 bg-[#1a1a1a]"
            />
            <div className="flex-1 mt-4">
              <h2 className="text-3xl font-serif font-bold text-white mb-2">
                {movie.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
                <span className="text-[#a3526d] font-bold">
                  ★ {movie.score}
                </span>
                <span className="text-gray-500">{movie.year}</span>
                <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">
                  {movie.ageRating}
                </span>
                <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">
                  {movie.genre}
                </span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-6 line-clamp-3">
                {movie.synopsis}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onAddToCart(movie)}
                  className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                    inCart
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-[#a3526d] hover:bg-[#8f4860] text-white"
                  }`}
                >
                  {inCart ? "ADDED ✓" : `ADD TO CART · ${movie.price}`}
                </button>
                {/* ❌ นำปุ่ม + PLAYLIST ออกแล้ว */}
              </div>
            </div>
          </div>

          {/* Cast Section */}
          <div className="mt-8">
            <h3 className="text-[10px] font-bold text-white tracking-widest uppercase mb-4 opacity-40">
              Cast & Crew
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {PLACEHOLDER_CREW.map((person) => (
                <div
                  key={person.name}
                  className="flex items-center gap-3 flex-shrink-0 bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-2"
                >
                  <img
                    src={person.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white text-[11px] font-semibold">
                      {person.name}
                    </p>
                    <p className="text-gray-500 text-[9px] uppercase">
                      {person.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-10">
            <h3 className="text-[10px] font-bold text-white tracking-widest uppercase mb-4 opacity-40">
              User Reviews
            </h3>
            <div className="space-y-3">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div
                    key={rev.review_id}
                    className="bg-[#151515] border border-white/5 rounded-2xl p-5 hover:border-[#a3526d]/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-xs font-bold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#a3526d] to-[#4a2a35] flex items-center justify-center text-[10px]">
                            {rev.username?.charAt(0).toUpperCase() || "U"}
                          </span>
                          @{rev.username}
                        </span>
                        <span className="text-[10px] text-gray-500 ml-8">
                          {new Date(rev.post_time).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                        <StarRating count={parseFloat(rev.rating)} />
                      </div>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed ml-8 italic">
                      "{rev.comment_text}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-gray-600 italic">
                  ยังไม่มีรีวิวสำหรับหนังเรื่องนี้...
                </div>
              )}
            </div>

            {/* Add Review Box */}
            {hasReviewed ? (
              <div className="mt-8 bg-[#a3526d]/10 border border-[#a3526d]/30 rounded-xl p-6 text-center shadow-lg">
                <p className="text-[#EAB8C9] text-xs font-bold flex items-center justify-center gap-2">
                  ✨ ขอบคุณ! คุณได้ส่งรีวิวเรียบร้อยแล้ว
                </p>
              </div>
            ) : (
              <div className="mt-8 bg-[#111] border border-white/10 rounded-xl p-5 shadow-inner">
                <p className="text-white text-xs font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-3 bg-[#a3526d] rounded-full"></span>
                  Write a Review
                </p>
                <StarPicker value={reviewStars} onChange={setReviewStars} />
                <textarea
                  rows={3}
                  placeholder="คุณคิดยังไงกับหนังเรื่องนี้..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full mt-4 bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-[#a3526d] outline-none transition-all"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handlePostReview}
                    className="bg-[#a3526d] hover:bg-[#8f4860] text-white px-8 py-2 rounded-lg text-xs font-bold shadow-lg transition-all active:scale-95"
                  >
                    Post Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
