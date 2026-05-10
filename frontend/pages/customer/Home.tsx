import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getCurrentUser, getCurrentUserId } from "../../lib/api";

// ── Types ──────────────────────────────────────────────
interface ApiMovie {
  movie_id: string;
  title: string;
  release_date: string | null;
  price: string;
  rating: string | null; // rating_label เช่น 'PG-13'
  country: string;
  create_date: string;
  update_date: string;
  genres: string[];
  average_rating: number;
  total_reviews: number;
}

interface CartItem {
  movie_id: string;
  title: string;
  price: number;
}

interface ApiReview {
  review_id: string;
  user_id: string | null;
  username: string | null;
  movie_id: string;
  rating: string;
  comment_text: string | null;
  post_time: string;
  post_status: string;
}

interface Genre {
  genre_id: string;
  genre_name: string;
}
interface Rating {
  rating_id: string;
  rating_label: string;
}

// ── Dark Select ────────────────────────────────────────
function DarkSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          backgroundColor: "#1a1a1a",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
          padding: "6px 28px 6px 10px",
          fontSize: "12px",
          appearance: "none",
          WebkitAppearance: "none",
          cursor: "pointer",
          minWidth: "140px",
          outline: "none",
        }}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "#aaa",
          fontSize: "10px",
        }}
      >
        ▾
      </span>
    </div>
  );
}

// ── Star Rating display ────────────────────────────────
function StarRating({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <span>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{
            color: i < count ? "#efc8d5" : "#333",
            fontSize: "14px",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

// ── Star Picker ────────────────────────────────────────
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      <span style={{ color: "#666", fontSize: "12px", marginRight: "6px" }}>
        Rating:
      </span>
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i + 1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: i < (hover || value) ? "#efc8d5" : "#333",
            padding: "0 1px",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── Watch Details Modal ────────────────────────────────
function WatchDetailsModal({
  movie,
  onClose,
  onAddToCart,
  inCart,
}: {
  movie: ApiMovie;
  onClose: () => void;
  onAddToCart: (m: ApiMovie) => void;
  inCart: boolean;
}) {
  const userId = getCurrentUserId();
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(3);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [posting, setPosting] = useState(false);
  const [postErr, setPostErr] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ data: ApiReview[] }>(
        `/api/reviews?movie_id=${movie.movie_id}&post_status=Published&limit=20`
      )
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]));
  }, [movie.movie_id]);

  const handlePostReview = async () => {
    if (!userId) {
      setPostErr("กรุณา login ก่อน");
      return;
    }
    if (!reviewText.trim()) {
      setPostErr("กรุณาใส่ความเห็น");
      return;
    }
    setPosting(true);
    setPostErr(null);
    try {
      const result = await api.post<{ review: ApiReview }>("/api/reviews", {
        user_id: userId,
        movie_id: movie.movie_id,
        rating: reviewStars,
        comment_text: reviewText.trim(),
      });
      setReviews((prev) => [result.review, ...prev]);
      setReviewText("");
      setReviewStars(3);
    } catch (err) {
      setPostErr(err instanceof Error ? err.message : "โพสต์ไม่สำเร็จ");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "180px",
            background:
              "linear-gradient(135deg, #2a1a20 0%, #1a0a14 50%, #0a0a0a 100%)",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.6)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 700 }}>
            {movie.title}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "8px 0",
              fontSize: "12px",
              color: "#999",
            }}
          >
            <StarRating count={Math.round(movie.average_rating)} />
            <span>{movie.average_rating.toFixed(1)}</span>
            <span>·</span>
            <span>{movie.total_reviews} reviews</span>
            <span>·</span>
            <span>{movie.rating ?? "—"}</span>
            <span>·</span>
            <span>${parseFloat(movie.price).toFixed(2)}</span>
          </div>
          <p style={{ color: "#bbb", fontSize: "13px" }}>
            {movie.genres.join(", ")} · {movie.country} ·{" "}
            {movie.release_date?.slice(0, 4) ?? "—"}
          </p>

          <button
            onClick={() => onAddToCart(movie)}
            disabled={inCart}
            style={{
              marginTop: "14px",
              background: inCart ? "rgba(34,197,94,0.2)" : "#a3526d",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: inCart ? "not-allowed" : "pointer",
            }}
          >
            {inCart ? "Added to cart ✓" : `Add to Cart · $${parseFloat(movie.price).toFixed(2)}`}
          </button>

          {/* Reviews */}
          <div style={{ marginTop: "24px" }}>
            <p
              style={{
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              User Reviews ({reviews.length})
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {reviews.length === 0 && (
                <p style={{ color: "#666", fontSize: "12px" }}>
                  No reviews yet — be the first!
                </p>
              )}
              {reviews.map((r) => (
                <div
                  key={r.review_id}
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <p
                      style={{
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      {r.username ?? "Anonymous"}
                    </p>
                    <StarRating count={Math.round(parseFloat(r.rating))} />
                    <span style={{ color: "#efc8d5", fontSize: "12px" }}>
                      {parseFloat(r.rating).toFixed(1)}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#bbb",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      margin: "0 0 6px",
                    }}
                  >
                    {r.comment_text}
                  </p>
                  <p style={{ color: "#555", fontSize: "11px", margin: 0 }}>
                    {new Date(r.post_time).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Post review form */}
            <div
              style={{
                marginTop: "16px",
                background: "#111",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "14px",
              }}
            >
              <p
                style={{
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                Add Your Review
              </p>
              <StarPicker value={reviewStars} onChange={setReviewStars} />
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts…"
                style={{
                  width: "100%",
                  marginTop: "10px",
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  color: "#fff",
                  fontSize: "13px",
                  resize: "none",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
              {postErr && (
                <p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>
                  {postErr}
                </p>
              )}
              <button
                onClick={handlePostReview}
                disabled={posting}
                style={{
                  marginTop: "10px",
                  background: "#a3526d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: posting ? 0.5 : 1,
                }}
              >
                {posting ? "Posting..." : "Post Review"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cart Drawer ────────────────────────────────────────
function CartDrawer({
  cart,
  onClose,
  onRemove,
  onCheckout,
  checkingOut,
  error,
}: {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (movieId: string) => void;
  onCheckout: (paymentMethod: string) => void;
  checkingOut: boolean;
  error: string | null;
}) {
  const [payment, setPayment] = useState("credit_card");
  const total = cart.reduce((s, c) => s + c.price, 0);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 40,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100vh",
          width: "400px",
          maxWidth: "100vw",
          background: "#0f0f0f",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Your Cart</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="text-sm text-gray-500">Cart is empty</p>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {cart.map((c) => (
                <div
                  key={c.movie_id}
                  className="flex items-center justify-between p-2 rounded border border-[#2a2a2a]"
                >
                  <div>
                    <p className="text-sm text-white">{c.title}</p>
                    <p className="text-xs text-gray-500">
                      ${c.price.toFixed(2)} · {c.movie_id}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(c.movie_id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-[#2a2a2a] pt-3 mt-3">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-400">Total</span>
                <span className="text-white font-bold">${total.toFixed(2)}</span>
              </div>

              <label className="block text-xs text-gray-400 mb-1">
                Payment Method
              </label>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="w-full mb-3 bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#A3526D]"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>

              {error && (
                <p className="text-xs text-red-400 mb-2">{error}</p>
              )}

              <button
                onClick={() => onCheckout(payment)}
                disabled={checkingOut}
                className="w-full bg-[#A3526D] hover:bg-[#7a3d52] text-white rounded-lg py-3 text-sm font-semibold disabled:opacity-50"
              >
                {checkingOut ? "Processing..." : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [movies, setMovies] = useState<ApiMovie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [detailOpen, setDetailOpen] = useState<ApiMovie | null>(null);

  // โหลด dropdown options ครั้งเดียว
  useEffect(() => {
    Promise.all([
      api.get<{ data: Genre[] }>("/api/genres"),
      api.get<{ data: Rating[] }>("/api/ratings"),
    ]).then(([g, r]) => {
      setGenres(g.data);
      setRatings(r.data);
    });
  }, []);

  // โหลด movies เมื่อ filter/search เปลี่ยน
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (search.trim()) params.set("search", search.trim());
    if (genre) params.set("genre", genre);
    if (rating) params.set("rating", rating);

    api
      .get<{ data: ApiMovie[] }>(`/api/movies?${params.toString()}`)
      .then((res) => setMovies(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [search, genre, rating]);

  const addToCart = (movie: ApiMovie) => {
    setCart((prev) =>
      prev.find((c) => c.movie_id === movie.movie_id)
        ? prev
        : [
            ...prev,
            {
              movie_id: movie.movie_id,
              title: movie.title,
              price: parseFloat(movie.price),
            },
          ]
    );
  };

  const removeFromCart = (movieId: string) => {
    setCart((prev) => prev.filter((c) => c.movie_id !== movieId));
  };

  const inCart = (movieId: string) =>
    cart.some((c) => c.movie_id === movieId);

  const handleCheckout = async (paymentMethod: string) => {
    if (!user) {
      setCheckoutError("กรุณา login ก่อน");
      return;
    }
    if (cart.length === 0) return;

    setCheckingOut(true);
    setCheckoutError(null);
    try {
      await api.post("/api/cart/checkout", {
        user_id: user.user_id,
        payment_method: paymentMethod,
        items: cart.map((c) => ({
          movie_id: c.movie_id,
          original_price: c.price,
          discount_applied: 0,
          sold_price: c.price,
        })),
      });
      setCart([]);
      setCartOpen(false);
      alert("ชำระเงินสำเร็จ! ดูได้ที่ Personal Library");
      navigate("/customer/personal-library");
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="w-full bg-[#0d0d0d] text-white font-sans min-h-screen">
      {/* Top bar */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <h1 className="text-xl font-bold">
          MOD<span className="text-[#a3526d]">TUBE</span>
        </h1>
        <button
          onClick={() => setCartOpen(true)}
          className="relative px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm hover:bg-[#252525]"
        >
          🛒 Cart
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#a3526d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Bar */}
      <div
        className="px-5 py-3 flex items-center gap-2 flex-wrap"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="relative flex-1" style={{ minWidth: "160px" }}>
          <input
            type="text"
            placeholder="Search movies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              color: "#fff",
              outline: "none",
            }}
          />
        </div>

        <DarkSelect
          value={genre}
          onChange={setGenre}
          label="All Genres"
          options={genres.map((g) => ({ value: g.genre_name, label: g.genre_name }))}
        />
        <DarkSelect
          value={rating}
          onChange={setRating}
          label="All Ratings"
          options={ratings.map((r) => ({
            value: r.rating_label,
            label: r.rating_label,
          }))}
        />
      </div>

      {/* Movie Grid */}
      <div className="p-5">
        <h2 className="text-base font-bold mb-4 text-white">All Movies</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : movies.length === 0 ? (
          <p className="text-gray-500">No movies found</p>
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
          >
            {movies.map((movie) => (
              <div
                key={movie.movie_id}
                onClick={() => setDetailOpen(movie)}
                className="rounded-2xl overflow-hidden transition hover:scale-[1.02] cursor-pointer"
                style={{
                  background: "#161616",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                <div
                  className="relative"
                  style={{
                    aspectRatio: "3/4",
                    background:
                      "linear-gradient(135deg, #2a1a20 0%, #1a0a14 50%, #0a0a0a 100%)",
                  }}
                >
                  <span
                    className="absolute top-2 left-2 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-md"
                    style={{
                      background: "rgba(0,0,0,0.75)",
                    }}
                  >
                    {movie.rating ?? "—"}
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-bold text-white mb-1 truncate">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    {movie.release_date?.slice(0, 4) ?? "—"} ·{" "}
                    {movie.genres[0] ?? "—"}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-[#efc8d5]">
                      ★ {movie.average_rating.toFixed(1)}
                    </span>
                    <span className="text-xs font-bold text-white">
                      ${parseFloat(movie.price).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(movie);
                    }}
                    disabled={inCart(movie.movie_id)}
                    className="w-full mt-2 text-xs py-1.5 rounded-md"
                    style={{
                      background: inCart(movie.movie_id)
                        ? "rgba(34,197,94,0.2)"
                        : "#a3526d",
                      color: "#fff",
                    }}
                  >
                    {inCart(movie.movie_id) ? "In Cart ✓" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {detailOpen && (
        <WatchDetailsModal
          movie={detailOpen}
          onClose={() => setDetailOpen(null)}
          onAddToCart={addToCart}
          inCart={inCart(detailOpen.movie_id)}
        />
      )}

      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => {
            setCartOpen(false);
            setCheckoutError(null);
          }}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
          checkingOut={checkingOut}
          error={checkoutError}
        />
      )}
    </div>
  );
}
