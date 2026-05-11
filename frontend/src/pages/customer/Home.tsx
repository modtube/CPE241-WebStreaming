import { useState } from "react";
import { useCart } from "../../context/Usecart"; // ← เพิ่ม

// ── Types ──────────────────────────────────────────────
interface Movie {
  id: number;
  title: string;
  ageRating: string;
  year: string;
  genre: string;
  language: string;
  price: string;       // ยังคง string ไว้เพื่อ display ($0.00)
  priceNum: number;    // ← เพิ่ม: ตัวเลขจริงสำหรับ cart
  poster: string;
  backdrop: string;
  synopsis: string;
  score: string;
  stars: number;
}

interface Review {
  username: string;
  avatar: string;
  score: string;
  stars: number;
  text: string;
  date: string;
}

// ── Placeholder movie data ─────────────────────────────
const MOVIES: Movie[] = [
  {
    id: 0,
    title: "Movie Name 1",
    ageRating: "R",
    year: "20XX",
    genre: "Thriller",
    language: "English",
    price: "$4.99",
    priceNum: 4.99,
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
    synopsis: "Movie detail / description will appear here once real data is connected.",
    score: "0.0",
    stars: 5,
  },
  {
    id: 1,
    title: "Movie Name 2",
    ageRating: "PG-13",
    year: "20XX",
    genre: "Sci-Fi",
    language: "English",
    price: "$5.49",
    priceNum: 5.49,
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80",
    synopsis: "Movie detail / description will appear here once real data is connected.",
    score: "0.0",
    stars: 4,
  },
  {
    id: 2,
    title: "Movie Name 3",
    ageRating: "PG-13",
    year: "20XX",
    genre: "Drama",
    language: "English",
    price: "$3.99",
    priceNum: 3.99,
    poster: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=800&q=80",
    synopsis: "Movie detail / description will appear here once real data is connected.",
    score: "0.0",
    stars: 5,
  },
  {
    id: 3,
    title: "Movie Name 4",
    ageRating: "PG-13",
    year: "20XX",
    genre: "Romance",
    language: "French",
    price: "$2.99",
    priceNum: 2.99,
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&q=80",
    synopsis: "Movie detail / description will appear here once real data is connected.",
    score: "0.0",
    stars: 4,
  },
  {
    id: 4,
    title: "Movie Name 5",
    ageRating: "R",
    year: "20XX",
    genre: "Action",
    language: "English",
    price: "$6.99",
    priceNum: 6.99,
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    synopsis: "Movie detail / description will appear here once real data is connected.",
    score: "0.0",
    stars: 3,
  },
];

const PLACEHOLDER_CREW = [
  { name: "Elena Cross",  role: "Lead Actress",    avatar: "https://i.pravatar.cc/40?img=1"  },
  { name: "James Harlow", role: "Lead Actor",      avatar: "https://i.pravatar.cc/40?img=12" },
  { name: "Sofia Reyes",  role: "Supporting",      avatar: "https://i.pravatar.cc/40?img=5"  },
  { name: "Marcus Chen",  role: "Director",        avatar: "https://i.pravatar.cc/40?img=8"  },
  { name: "Anya Petrov",  role: "Cinematographer", avatar: "https://i.pravatar.cc/40?img=20" },
  { name: "David Osei",   role: "Composer",        avatar: "https://i.pravatar.cc/40?img=15" },
];

const PLACEHOLDER_REVIEWS: Review[] = [
  {
    username: "moviefan_92",
    avatar: "https://i.pravatar.cc/36?img=33",
    score: "9.2",
    stars: 5,
    text: "Absolutely gripping from start to finish. The cinematography is breathtaking and the lead performance is career-defining.",
    date: "Jan 12, 2025",
  },
  {
    username: "cineworld_k",
    avatar: "https://i.pravatar.cc/36?img=44",
    score: "7.8",
    stars: 4,
    text: "Great suspense but the third act felt rushed. Overall a solid film worth watching.",
    date: "Feb 3, 2025",
  },
];

const FEATURED = MOVIES[0];

// ── Reusable dark select ───────────────────────────────
function DarkSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "8px",
          padding: "6px 28px 6px 10px",
          fontSize: "12px",
          appearance: "none",
          WebkitAppearance: "none",
          cursor: "pointer",
          minWidth: "120px",
          outline: "none",
        }}
      >
        <option value="" style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          {label}
        </option>
        {options.map((o) => (
          <option key={o} value={o} style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
            {o}
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
        <span key={i} style={{ color: i < count ? "#efc8d5" : "#333", fontSize: "14px" }}>
          ★
        </span>
      ))}
    </span>
  );
}

// ── Interactive Star Picker ────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      <span style={{ color: "#666", fontSize: "12px", marginRight: "6px" }}>Rating:</span>
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
            transition: "color 0.15s, transform 0.1s",
            transform: i < (hover || value) ? "scale(1.15)" : "scale(1)",
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
  movie: Movie;
  onClose: () => void;
  onAddToCart: (m: Movie) => void;
  inCart: boolean;
}) {
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(3);
  const [reviews, setReviews] = useState<Review[]>(PLACEHOLDER_REVIEWS);

  const handlePostReview = () => {
    if (!reviewText.trim()) return;
    const newReview: Review = {
      username: "You",
      avatar: "https://i.pravatar.cc/36?img=70",
      score: (reviewStars * 2).toFixed(1),
      stars: reviewStars,
      text: reviewText.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewText("");
    setReviewStars(3);
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
          scrollbarWidth: "thin",
          scrollbarColor: "#2a2a2a transparent",
        }}
      >
        {/* Backdrop image */}
        <div
          style={{
            position: "relative",
            height: "220px",
            overflow: "hidden",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <img
            src={movie.backdrop}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, transparent 20%, #0f0f0f 100%)",
            }}
          />
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "0 28px 28px", marginTop: "-48px", position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <img
              src={movie.poster}
              alt="poster"
              style={{
                width: "100px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
                {movie.title}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#efc8d5", fontWeight: 600, fontSize: "13px" }}>
                  ★ {movie.score}
                </span>
                <span style={{ color: "#888", fontSize: "13px" }}>{movie.year}</span>
                {[movie.ageRating, movie.genre].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "2px 8px",
                      fontSize: "11px",
                      color: "#ccc",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.6, margin: "0 0 14px" }}>
                {movie.synopsis}
              </p>
              {/* ✅ ใช้ onAddToCart ที่รับมาจาก Home (เชื่อม CartContext แล้ว) */}
              <button
                onClick={() => onAddToCart(movie)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: inCart ? "#835a6c" : "#a3526d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "9px 18px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {inCart ? "Added to Cart ✓" : `Add to Cart · ${movie.price}`}
              </button>
            </div>
          </div>

          {/* Cast & Crew */}
          <div style={{ marginTop: "28px" }}>
            <h3
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Cast &amp; Crew
            </h3>
            <div
              style={{
                display: "flex",
                gap: "10px",
                overflowX: "auto",
                paddingBottom: "8px",
                scrollbarWidth: "none",
              }}
            >
              {PLACEHOLDER_CREW.map((person) => (
                <div
                  key={person.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexShrink: 0,
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "10px 14px",
                  }}
                >
                  <img
                    src={person.avatar}
                    alt={person.name}
                    style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <p style={{ color: "#fff", fontSize: "12px", fontWeight: 600, margin: 0 }}>
                      {person.name}
                    </p>
                    <p style={{ color: "#666", fontSize: "11px", margin: 0 }}>{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Reviews */}
          <div style={{ marginTop: "28px" }}>
            <h3
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              User Reviews
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reviews.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px" }}>
                    <img
                      src={r.avatar}
                      alt={r.username}
                      style={{ width: "36px", height: "36px", borderRadius: "50%" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: 0 }}>
                          {r.username}
                        </p>
                        <StarRating count={r.stars} />
                        <span style={{ color: "#efc8d5", fontSize: "12px" }}>{r.score}</span>
                      </div>
                      <p style={{ color: "#999", fontSize: "13px", lineHeight: 1.5, margin: "0 0 6px" }}>
                        {r.text}
                      </p>
                      <p style={{ color: "#555", fontSize: "11px", margin: 0 }}>{r.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Review */}
            <div
              style={{
                marginTop: "16px",
                background: "#111",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>
                Add Your Review
              </p>
              <StarPicker value={reviewStars} onChange={setReviewStars} />
              <textarea
                rows={3}
                placeholder="Share your thoughts…"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: "12px",
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
              <button
                onClick={handlePostReview}
                style={{
                  marginTop: "10px",
                  backgroundColor: "#a3526d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Post Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function Home() {
  const [search, setSearch]         = useState("");
  const [language, setLanguage]     = useState("");
  const [genre, setGenre]           = useState("");
  const [ageRating, setAgeRating]   = useState("");
  const [detailOpen, setDetailOpen] = useState<Movie | null>(null);

  // ✅ แทนที่ local cart state ด้วย CartContext
  const { addItem, items } = useCart();

  // ✅ helper: check ว่า movie อยู่ใน global cart แล้วหรือยัง
  const inCart = (id: number) => items.some((c) => c.id === String(id));

  // ✅ addToCart: แปลง Movie → CartItem ของ Context แล้วเปิด drawer
  const addToCart = (movie: Movie) => {
    addItem({
      id: String(movie.id),
      title: movie.title,
      price: movie.priceNum,
      thumbnail: movie.poster,
    });
    // ไม่เปิด CartDrawer เมื่อกด Add to Cart
    // ให้เปิดเฉพาะเมื่อกดไอคอนมุมขวาบน (CartButton)
  };

  const filtered = MOVIES.filter(
    (m) =>
      (search    === "" || m.title.toLowerCase().includes(search.toLowerCase())) &&
      (language  === "" || m.language  === language)  &&
      (genre     === "" || m.genre     === genre)     &&
      (ageRating === "" || m.ageRating === ageRating)
  );

  return (
    <div className="w-full bg-[#0d0d0d] text-white font-sans">

      {/* ── Hero Banner ── */}
      <div className="relative z-0 w-full h-56 overflow-hidden">
        <img src={FEATURED.poster} alt="hero" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 60%, transparent 100%)",
          }}
        />

        <div className="absolute bottom-0 left-0 p-6">
          <span
            className="inline-flex items-center gap-1 mb-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(6px)",
            }}
          >
            ⭐ Featured Film
          </span>

          <h1 className="text-xl font-black mb-1 text-white">{FEATURED.title}</h1>
          <p className="text-gray-400 text-xs mb-3 max-w-sm leading-relaxed">{FEATURED.synopsis}</p>

          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setDetailOpen(FEATURED)}
              className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition"
              style={{ backgroundColor: "#a3526d" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#835a6c")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#a3526d")}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
              Watch Details
            </button>

            {/* ✅ ใช้ addToCart ที่เชื่อม Context แล้ว */}
            <button
              onClick={() => addToCart(FEATURED)}
              className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition"
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                background: inCart(FEATURED.id) ? "rgba(34,197,94,0.2)" : "transparent",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {inCart(FEATURED.id) ? "Added ✓" : "Add to Cart"}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="text-yellow-400">★★★★★</span>
            <span>{FEATURED.year}</span>
            {[FEATURED.ageRating, FEATURED.genre, FEATURED.language].map((t) => (
              <span
                key={t}
                className="px-1.5 py-0.5 rounded text-[10px]"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div
        className="px-5 py-3 flex items-center gap-2 flex-wrap"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="relative flex-1" style={{ minWidth: "160px" }}>
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#666"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
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
              paddingLeft: "32px",
              paddingRight: "12px",
              paddingTop: "6px",
              paddingBottom: "6px",
              fontSize: "12px",
              color: "#fff",
              outline: "none",
            }}
          />
        </div>
        <DarkSelect value={language}  onChange={setLanguage}  label="All Languages" options={["English", "Thai", "Japanese", "Korean", "French"]} />
        <DarkSelect value={genre}     onChange={setGenre}     label="All Genres"    options={["Action", "Thriller", "Drama", "Comedy", "Horror", "Sci-Fi", "Romance"]} />
        <DarkSelect value={ageRating} onChange={setAgeRating} label="All Ratings"   options={["G", "PG", "PG-13", "R", "NC-17"]} />
      </div>

      {/* ── Movie Grid ── */}
      <div className="p-5">
        <h2 className="text-base font-bold mb-4 text-white">All Movies</h2>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
          {filtered.map((movie) => (
            <div
              key={movie.id}
              className="rounded-2xl overflow-hidden transition hover:scale-[1.02] cursor-pointer"
              style={{
                background: "#161616",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
              onClick={() => setDetailOpen(movie)}
            >
              <div className="relative">
                <img
                  src={movie.poster}
                  alt="poster"
                  className="w-full object-cover"
                  style={{ aspectRatio: "3/4" }}
                />
                <span
                  className="absolute top-2 left-2 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-md"
                  style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
                >
                  {movie.ageRating}
                </span>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-bold text-white mb-1 truncate">{movie.title}</h3>
                <p className="text-[11px] text-gray-500 mb-2">
                  {movie.year} · {movie.genre}&nbsp;
                  <span style={{ color: "#efc8d5" }}>★</span>
                  <span className="text-gray-400 ml-0.5">{movie.stars}</span>
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: "#efc8d5" }}>
                    {movie.price}
                  </span>

                  {/* ✅ ใช้ addToCart ที่เชื่อม Context แล้ว */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(movie);
                    }}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      backgroundColor: inCart(movie.id) ? "#835a6c" : "#a3526d",
                      border: "none",
                      cursor: "pointer",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                    }}
                    onMouseEnter={(e) =>
                      !inCart(movie.id) && (e.currentTarget.style.backgroundColor = "#8f4860")
                    }
                    onMouseLeave={(e) =>
                      !inCart(movie.id) && (e.currentTarget.style.backgroundColor = "#a3526d")
                    }
                  >
                    {inCart(movie.id) ? (
                      <span style={{ fontSize: "14px", lineHeight: 1 }}>✓</span>
                    ) : (
                      <span style={{ fontSize: "14px", lineHeight: 1 }}>🛒</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-12 text-sm">No movies found.</p>
          )}
        </div>
      </div>

      {/* ── Watch Details Modal ── */}
      {detailOpen && (
        <WatchDetailsModal
          movie={detailOpen}
          onClose={() => setDetailOpen(null)}
          onAddToCart={addToCart}
          inCart={inCart(detailOpen.id)}
        />
      )}
    </div>
  );
}