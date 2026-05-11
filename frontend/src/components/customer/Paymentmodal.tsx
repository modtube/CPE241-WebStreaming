import { useState } from "react";
import { ArrowLeft, CreditCard, QrCode, Wallet, X } from "lucide-react";
import { useCart } from "../../context/Usecart";
import ReceiptModal, { type ReceiptData } from "./ReceiptModal";
import type { TransactionRecord } from "../../context/CartContext";

// ─── Payment methods config ───────────────────────────────────────────────────

const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, Amex",
    Icon: CreditCard,
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    id: "promptpay",
    label: "PromptPay / QR",
    subtitle: "Thai QR Payment",
    Icon: QrCode,
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    id: "wallet",
    label: "Digital Wallet",
    subtitle: "TrueMoney, LINE Pay",
    Icon: Wallet,
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
  },
] as const;

type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

// ─── Props ────────────────────────────────────────────────────────────────────

interface PaymentModalProps {
  onClose: () => void;
  onBack: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateTxnId(): string {
  return `TXN-${Date.now().toString().slice(-8)}`;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function todayDisplay(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaymentModal({ onClose, onBack }: PaymentModalProps) {
  const { items, total, clearCart, addTransaction } = useCart();
  const [selected, setSelected] = useState<PaymentMethodId>("card");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selected)!;

  const handleConfirm = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 900));

    const txnId = generateTxnId();

    const receiptData: ReceiptData = {
      transactionId: txnId,
      items: items.map((i) => ({ title: i.title, price: i.price })),
      subtotal: total,
      discount: 0,
      total,
      date: todayDisplay(),
      paymentMethod: selectedMethod.label,
      status: "Completed",
    };

    const record: TransactionRecord = {
      transactionId: txnId,
      date: todayISO(),
      movieTitle: items.map((i) => i.title).join(", "),
      amount: `$${total.toFixed(2)}`,
      payment: selectedMethod.label,
      status: "Completed",
      receipt: receiptData,
    };

    addTransaction(record);
    clearCart();
    setIsProcessing(false);
    setReceipt(receiptData);
  };

  if (receipt) {
    return <ReceiptModal receipt={receipt} onClose={onClose} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl bg-[#0d0d0d] border border-[#2A2A2A] shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white"
          aria-label="Close"
        >
          <X size={14} />
        </button>

        <div className="px-6 pt-6 pb-4 border-b border-[#1e1e1e]">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Back to Cart
          </button>
          <h2 className="text-white font-semibold text-base">
            Select Payment Method
          </h2>
        </div>

        <div className="px-5 py-4 space-y-2.5">
          {PAYMENT_METHODS.map((method) => {
            const isActive = selected === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelected(method.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-150 text-left ${
                  isActive
                    ? "border-[#A3526D] bg-[#A3526D]/10"
                    : "border-[#2A2A2A] bg-[#111111] hover:border-[#3a3a3a]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive ? "border-[#A3526D]" : "border-white/20"
                  }`}
                >
                  {isActive && <div className="w-2 h-2 rounded-full bg-[#A3526D]" />}
                </div>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${method.iconBg}`}>
                  <method.Icon size={18} className={method.iconColor} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{method.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{method.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mx-5 mb-4 rounded-xl bg-[#111111] border border-[#1e1e1e] px-4 py-3 space-y-1.5">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Order Summary</p>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-white/70 truncate mr-2">{item.title}</span>
              <span className="text-white/70 flex-shrink-0">${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-[#2A2A2A] pt-2 mt-2 flex justify-between text-sm font-semibold">
            <span className="text-white">Total</span>
            <span className="text-white">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-[#A3526D] hover:bg-[#c28498] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-150 shadow-lg shadow-[#A3526D]/20 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              "Confirm Transaction"
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
}