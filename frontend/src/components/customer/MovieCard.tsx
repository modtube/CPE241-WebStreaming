import { useState } from 'react';
import type { Movie } from './CustomerType';
import StarRating from './StarRating';

export default function MovieCard({ movie, onClick, onAddToCart, inCart }: {
  movie: Movie; 
  onClick: () => void; 
  onAddToCart: (e: React.MouseEvent) => void; 
  inCart: boolean;
}) {
  const [isError, setIsError] = useState(false);

  return (
    <div 
      onClick={onClick} 
      className="group bg-[#111] hover:bg-[#151515] border border-white/5 hover:border-customer-border-pink/20 rounded-2xl p-3 transition-all duration-300 cursor-pointer relative shadow-lg"
    >
      {/* Image Section */}
      <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 relative">
        {(!movie.poster || movie.poster.length < 5 || isError) ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
             <p className="text-[10px] text-gray-600 font-bold uppercase mb-1">{movie.title}</p>
             <div className="border border-gray-800 px-2 py-1 rounded">
                <p className="text-[9px] text-gray-700">img not rendered</p>
             </div>
          </div>
        ) : (
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="w-full h-full object-cover"
            onError={() => setIsError(true)} 
          />
        )}

        <button
          onClick={onAddToCart}
          className={`absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-xl z-20 ${
            inCart 
              ? "bg-green-600 text-white" 
              : "bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-[#a3526d]"
          }`}
        >
          {inCart ? "✓" : "+"}
        </button>
      </div>

      {/* Info */}
      <div className="pt-4 px-1 pb-1">
        <h3 className="text-sm font-bold text-white mb-1 truncate group-hover:text-customer-primary-pink transition-colors">
          {movie.title}
        </h3>
        <p className="text-[10px] text-gray-500 mb-3">{movie.year} · {movie.genre}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <StarRating count={movie.stars} />
            <span className="text-[10px] text-white font-bold mt-1">★ {movie.score}</span>
          </div>
          <p className="text-xs font-bold text-white tracking-tight">${movie.price}</p>
        </div>
      </div>
    </div>
  );
}