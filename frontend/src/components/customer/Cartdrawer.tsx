import { useEffect, useRef, useState } from "react";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../../context/Usecart";
import PaymentModal from "./Paymentmodal";

export default function CartDrawer() {
  const { items, removeItem, clearCart, total, isCartOpen, closeCart } =
    useCart();
  const [showPayment, setShowPayment] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeCart]);

  // Trap scroll when open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleProceed = () => {
    if (items.length === 0) return;
    setShowPayment(true);
  };

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* ── Drawer panel ─────────────────────────────────────────────── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className="fixed top-0 right-0 z-50 h-full w-full max-w-[360px] flex flex-col bg-[#0d0d0d] border-l border-[#2A2A2A] shadow-2xl animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#A3526D]" />
            <h2 className="text-white font-semibold text-base tracking-wide">
              Shopping Cart
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X size={14} />
          </button>
        </div>

        {/* Total + Proceed */}
        <div className="px-5 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">
              Total
            </p>
            <p className="text-white font-bold text-xl">
              ${total.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleProceed}
            disabled={items.length === 0}
            className="px-5 py-2.5 rounded-xl bg-[#A3526D] hover:bg-[#c28498] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-150 shadow-lg shadow-[#A3526D]/20"
          >
            Proceed to Payment
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-white/30">
              <ShoppingCart size={40} strokeWidth={1.5} />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#111111] border border-[#1e1e1e] hover:border-[#2A2A2A] transition-colors group"
              >
                {/* Thumbnail */}
                <div className="w-14 h-[72px] rounded-lg bg-[#1a1a1a] border border-[#2A2A2A] overflow-hidden flex-shrink-0">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                      🎬
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-sm font-medium leading-snug line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-[#A3526D] text-sm font-semibold mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Clear all */}
        {items.length > 0 && (
          <div className="px-5 py-3 border-t border-[#1e1e1e]">
            <button
              onClick={clearCart}
              className="text-xs text-white/30 hover:text-red-400 transition-colors"
            >
              Clear all items
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal (screen 3) */}
      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onBack={() => setShowPayment(false)}
        />
      )}

      {/* Slide-in animation */}
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </>
  );
}