import type { Movie } from "./CustomerType";

interface BannerProps {
  movie: Movie | null;
  onWatchDetails: (movie: Movie) => void;
  onAddToCart: (movie: Movie) => void;
  inCart: boolean;
}

export default function Banner({ movie, onWatchDetails, onAddToCart, inCart }: BannerProps) {
  if (!movie) return null;

  return (
    <div className="relative w-full h-[450px] overflow-hidden bg-[#0d0d0d]">
      <img 
        src={movie.backdrop} 
        alt={movie.title} 
        className="absolute inset-0 w-full h-full object-cover object-center" 
      />
      
      {/* 💡 1. ลดความกว้างเงาดำเหลือแค่ครึ่งจอ (w-1/2) และให้ค่อยๆ จางลง เพื่อไม่ให้บังรูป */}
      <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[#0d0d0d]/90 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0d0d0d] to-transparent" />

      {/* 💡 2. ขยับข้อความให้ชิดซ้ายขึ้น (จาก left-10 เป็น left-8) */}
      <div className="absolute bottom-10 left-8 max-w-2xl z-10">
        <span className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded bg-[#1a1a1a]/60 border border-white/10 text-[10px] font-bold text-white tracking-widest backdrop-blur-md">
          <span className="text-yellow-500 text-xs">★</span> Featured Film
        </span>

        <h1 className="text-5xl font-serif font-bold mb-3 text-white tracking-tight drop-shadow-lg">
          {movie.title}
        </h1>
        
        <p className="text-gray-300 text-sm mb-6 leading-relaxed line-clamp-2 max-w-lg drop-shadow">
          {movie.synopsis}
        </p>

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onWatchDetails(movie)}
            className="flex items-center gap-2 bg-[#a3526d] hover:bg-[#83465b] text-white text-sm font-semibold px-6 py-2 rounded-lg transition-all shadow-lg"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            Watch Details
          </button>

          <button
            onClick={() => onAddToCart(movie)}
            className={`flex items-center gap-2 text-sm font-semibold px-6 py-2 rounded-lg border transition-all ${
              inCart ? "bg-white/10 border-white/50 text-white" : "border-white/30 hover:bg-white/10 text-white"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {inCart ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-300">
          <span className="flex items-center gap-1.5 text-white">
            <span className="text-[#a3526d] text-sm">★</span> {movie.score}
          </span>
          <span>{movie.year}</span>
          <span className="bg-[#1a1a1a]/80 border border-white/10 px-2 py-0.5 rounded text-gray-400 backdrop-blur-sm">{movie.ageRating}</span>
          <span className="bg-[#1a1a1a]/80 border border-white/10 px-2 py-0.5 rounded text-gray-400 backdrop-blur-sm">{movie.genre}</span>
          <span className="bg-[#1a1a1a]/80 border border-white/10 px-2 py-0.5 rounded text-gray-400 backdrop-blur-sm">{movie.language}</span>
        </div>
      </div>
    </div>
  );
}