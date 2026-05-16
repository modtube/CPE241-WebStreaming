import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/Usecart";

export default function CartButton() {
  const { count, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      aria-label={`Open cart (${count} items)`}
      className="relative p-2 rounded-full bg-[#A3526D] hover:bg-white border-white/10 hover:border-[#A3526D] transition-all duration-200 text-white hover:text-[#A3526D]"
    >
      <ShoppingCart size={30} strokeWidth={2} />

      {/* Badge */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#A3526D] text-white text-[10px] font-bold px-1 leading-none shadow-lg shadow-[#A3526D]/40">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}