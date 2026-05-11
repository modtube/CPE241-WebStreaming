import { useState, useEffect } from "react"; // 💡 ลบ React ออก เพราะไม่ได้ใช้
import type { Movie, CartItem } from "../../../components/customer/CustomerType";
import WatchDetailsModal from "../../../components/customer/WatchDetail"; 
import Banner from "../../../components/customer/Banner"; 
import FilterBar from "../../../components/customer/FilterBar";
import MovieCard from "../../../components/customer/MovieCard";

// 🦴 Skeleton Card
const SkeletonCard = () => (
  <div className="bg-[#1a1a1a]/50 border border-white/5 rounded-2xl p-3 animate-pulse">
    <div className="aspect-[2/3] w-full rounded-xl bg-white/5 mb-4" />
    <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
    <div className="h-3 bg-white/5 rounded w-1/2" />
  </div>
);

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [detailOpen, setDetailOpen] = useState<Movie | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/home")
      .then(res => res.json())
      .then(res => {
        setMovies(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const inCart = (id: string) => cart.some(c => c.id === id);
  const handleCart = (m: Movie) => {
    setCart(prev => inCart(m.id) ? prev.filter(c => c.id !== m.id) : [...prev, { ...m }]);
  };

  return (
    <div className="w-full bg-[#0d0d0d] min-h-screen pb-20 overflow-x-hidden">
      {/* Banner Section */}
      {loading ? (
        <div className="w-full h-[450px] bg-[#111] animate-pulse" />
      ) : (
        movies[0] && (
          <Banner 
            movie={movies[0]} 
            onWatchDetails={setDetailOpen} 
            onAddToCart={() => handleCart(movies[0])} 
            inCart={inCart(movies[0].id)} 
          />
        )
      )}

      {/* FilterBar (ใส่ props หลอกไว้ก่อนให้หายแดง) */}
      <FilterBar 
        search="" setSearch={() => {}} 
        language="" setLanguage={() => {}} 
        genre="" setGenre={() => {}} 
        ageRating="" setAgeRating={() => {}} 
      />

      <div className="px-8 py-8">
        <h2 className="text-xl font-serif font-bold text-white mb-6 uppercase tracking-wider">All Movies</h2>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {loading ? (
            Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            movies.map(m => (
              <MovieCard 
                key={m.id} 
                movie={m} 
                onClick={() => setDetailOpen(m)} 
                onAddToCart={(e: any) => { e.stopPropagation(); handleCart(m); }} 
                inCart={inCart(m.id)} 
              />
            ))
          )}
        </div>
      </div>

      {detailOpen && (
        <WatchDetailsModal 
          movie={detailOpen} 
          onClose={() => setDetailOpen(null)} 
          onAddToCart={handleCart} 
          inCart={inCart(detailOpen.id)} 
        />
      )}
    </div>
  );
}