import { useState, useEffect } from "react";
import MovieCard from "../../components/customer/MovieCard";
import Banner from "../../components/customer/Banner";
import WatchDetailsModal from "../../components/customer/WatchDetail";
import type { Movie } from "../../components/customer/CustomerType";
import { useCart } from "../../context/Usecart";

// ── Types ─────────────────────────────────────
type ApiMovie = {
  movie_id: string;
  title: string;
  release_date: string;
  price: string;
  rating: string;
  country: string;
  create_date: string;
  update_date: string;
  genres: string[];
  average_rating: number;
  total_reviews: number;
  poster?: string;
};

type Pagination = {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
};

type Genre = { genre_id: string; genre_name: string };
type Country = { country_code: string; country_name: string };
type Rating = {
  rating_id: string;
  rating_label: string;
  maturity_level: number;
  rating_description: string;
};

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
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#1a1a1a] text-white border border-white/15 rounded-lg px-3 py-1.5 text-[12px] appearance-none cursor-pointer min-w-[120px] outline-none"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#aaa] text-[10px]">
        ▾
      </span>
    </div>
  );
}

const mapApiMovie = (m: ApiMovie): Movie => ({
  id: m.movie_id as any,
  movie_id: m.movie_id,
  title: m.title,
  year: new Date(m.release_date).getFullYear(),
  genre: m.genres?.[0] ?? "",
  language: "",
  poster:
    m.poster ||
    `https://loremflickr.com/400/600/${encodeURIComponent(m.title)},movie,poster/all`,
  backdrop: "",
  synopsis: "",
  ageRating: m.rating,
  price: m.price,
  score: m.average_rating ?? 0,
  stars: Math.round(m.average_rating ?? 0),
  rating: 5,
});

export default function Home() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [ageRating, setAgeRating] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [movies, setMovies] = useState<ApiMovie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [detailOpen, setDetailOpen] = useState<Movie | null>(null);

  const [ownedMovieIds, setOwnedMovieIds] = useState<string[]>([]);
  const { items, addItem, removeItem } = useCart();

  const token = localStorage.getItem("token");

  // 🟢 ดึงข้อมูลหนังที่ซื้อแล้วจาก API: /api/customer/my-movies
  useEffect(() => {
    const fetchOwnedMovies = async () => {
      if (!token) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/customer/my-movies`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        // API คืนค่าเป็น Array โดยตรงตามตัวอย่างผลลัพธ์ที่ให้มา
        if (Array.isArray(data)) {
          setOwnedMovieIds(data.map((m: any) => m.movie_id));
        }
      } catch (error) {
        console.error("Failed to fetch owned movies:", error);
      }
    };
    fetchOwnedMovies();
  }, [token]);

  const toggleCart = (movie: Movie) => {
    if (ownedMovieIds.includes(movie.movie_id)) return;

    const isAlreadyIn = items.some((item) => item.id === movie.movie_id);
    if (isAlreadyIn) {
      removeItem(movie.movie_id);
    } else {
      addItem({
        id: movie.movie_id,
        title: movie.title,
        price: Number(movie.price),
        thumbnail: movie.poster,
      });
    }
  };

  const isInCart = (movieId: string) =>
    items.some((item) => item.id === movieId);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [gRes, cRes, rRes] = await Promise.all([
          fetch("http://localhost:5000/api/genres"),
          fetch("http://localhost:5000/api/countries"),
          fetch("http://localhost:5000/api/ratings"),
        ]);
        const [gJson, cJson, rJson] = await Promise.all([
          gRes.json(),
          cRes.json(),
          rRes.json(),
        ]);
        setGenres(gJson.data ?? []);
        setCountries(cJson.data ?? []);
        setRatings(rJson.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoadingMovies(true);
      try {
        // สร้าง Query Parameters
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        // 🟢 ส่งค่าการกรองต่างๆ ไปที่ API เพื่อให้หาจากหนังทั้งหมดใน DB
        if (search) params.set("search", search);
        if (genre) params.set("genre", genre);
        if (country) params.set("country", country);
        if (ageRating) params.set("rating", ageRating); // หรือ parameter ที่ backend กำหนด

        const res = await fetch(
          `http://localhost:5000/api/movies?${params.toString()}`,
        );
        const json = await res.json();

        setMovies(json.data ?? []);
        setPagination(json.pagination ?? null);
      } catch (error) {
        setMovies([]);
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchMovies();
  }, [page, limit, genre, search, country, ageRating]);

  useEffect(() => {
    setPage(1);
  }, [genre, country, search]);

  const selectedRatingLabel = ratings.find(
    (r) => r.rating_id === ageRating,
  )?.rating_label;
  const filteredMovies = movies;

  return (
    <div className="w-full bg-[#0d0d0d] text-white font-sans min-h-screen">
      <Banner
        movie={null}
        onWatchDetails={(m) => setDetailOpen(m)}
        onAddToCart={toggleCart}
        inCart={false}
      />

      <div className="px-5 py-3 flex items-center gap-2 flex-wrap border-b border-white/10 sticky top-0 bg-[#0d0d0d]/80 backdrop-blur-md z-20">
        <div className="relative flex-1 min-w-[160px]">
          <input
            type="text"
            placeholder="Search movies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-white outline-none focus:border-[#A3526D]"
          />
        </div>
        <DarkSelect
          value={genre}
          onChange={setGenre}
          label="All Genres"
          options={genres.map((g) => ({
            value: g.genre_name,
            label: g.genre_name,
          }))}
        />
        <DarkSelect
          value={country}
          onChange={setCountry}
          label="All Countries"
          options={countries.map((c) => ({
            value: c.country_code,
            label: c.country_name,
          }))}
        />
        <DarkSelect
          value={ageRating}
          onChange={setAgeRating}
          label="All Ratings"
          options={ratings.map((r) => ({
            value: r.rating_label,
            label: r.rating_label,
          }))}
        />
      </div>

      <div className="p-5">
        <h2 className="text-base font-bold mb-4">All Movies</h2>
        {loadingMovies ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] animate-pulse rounded-2xl bg-zinc-900"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMovies.map((apiMovie) => (
                <MovieCard
                  key={apiMovie.movie_id}
                  movie={mapApiMovie(apiMovie)}
                  onClick={() => setDetailOpen(mapApiMovie(apiMovie))}
                  onAddToCart={(e) => {
                    e.stopPropagation();
                    toggleCart(mapApiMovie(apiMovie));
                  }}
                  inCart={isInCart(apiMovie.movie_id)}
                  isOwned={ownedMovieIds.includes(apiMovie.movie_id)}
                />
              ))}
            </div>

            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10 mb-5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-white/10 bg-[#1a1a1a] hover:bg-[#a3526d] disabled:opacity-30 transition-all"
                >
                  ← Prev
                </button>
                <span className="text-xs text-gray-400">
                  Page <span className="text-white font-bold">{page}</span> of{" "}
                  {pagination.total_pages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.total_pages, p + 1))
                  }
                  disabled={page >= pagination.total_pages}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-white/10 bg-[#1a1a1a] hover:bg-[#a3526d] disabled:opacity-30 transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {detailOpen && (
        <WatchDetailsModal
          movie={detailOpen}
          onClose={() => setDetailOpen(null)}
          onAddToCart={toggleCart}
          inCart={isInCart(detailOpen.movie_id)}
          isOwned={ownedMovieIds.includes(detailOpen.movie_id)}
        />
      )}
    </div>
  );
}
