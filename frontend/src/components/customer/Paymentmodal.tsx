// components/customer/Paymentmodal.tsx
import { useState } from "react";
import { ArrowLeft, CreditCard, Landmark, Wallet, X } from "lucide-react";
import { useCart } from "../../context/Usecart";
import ReceiptModal, { type ReceiptData } from "./ReceiptModal";
import type { TransactionRecord } from "../../context/CartContext";

const PAYMENT_METHODS = [
  {
    id: "credit_card",
    label: "Credit Card",
    subtitle: "Visa, Mastercard, JCB",
    Icon: CreditCard,
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    id: "debit_card",
    label: "Debit Card",
    subtitle: "Local & International Debit",
    Icon: CreditCard,
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    id: "paypal",
    label: "PayPal",
    subtitle: "Digital Payment Gateway",
    Icon: Wallet,
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    subtitle: "Direct Deposit / Mobile Banking",
    Icon: Landmark,
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
  },
] as const;

type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

interface PaymentModalProps {
  onClose: () => void;
  onBack: () => void;
}

export default function PaymentModal({ onClose, onBack }: PaymentModalProps) {
  const { items, total, clearCart, addTransaction } = useCart();
  const [selected, setSelected] = useState<PaymentMethodId>("credit_card");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selected)!;

  const handleConfirm = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id"); // 🟢 ดึง User ID จาก local ครับ

    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId, // 🟢 ส่ง user_id ไปใน body ด้วย
          payment_method: selected,
          items: items.map((item) => ({
            movie_id: item.id,
            title: item.title,
            price: item.price,
          })),
        }),
      });

      const result = await response.json();

      if (result.success) {
        const receiptData: ReceiptData = {
          transactionId: result.transaction_id,
          items: items.map((i) => ({ title: i.title, price: i.price })),
          subtotal: total,
          discount: 0,
          total,
          date: new Date().toLocaleDateString("th-TH"),
          paymentMethod: selectedMethod.label,
          status: "Completed",
        };

        const record: TransactionRecord = {
          transactionId: result.transaction_id,
          date: new Date().toISOString(),
          movieTitle: items.map((i) => i.title).join(", "),
          amount: `฿${total.toLocaleString()}`,
          payment: selectedMethod.label,
          status: "Completed",
          receipt: receiptData,
        };

        addTransaction(record);
        setReceipt(receiptData);
        clearCart();
      } else {
        alert(result.message || "Payment failed.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong with the connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseReceipt = () => {
    onClose();
    window.location.reload();
  };

  if (receipt) {
    return <ReceiptModal receipt={receipt} onClose={handleCloseReceipt} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-3xl bg-[#0d0d0d] border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50"
        >
          <X size={16} />
        </button>

        <div className="px-6 pt-8 pb-4 border-b border-white/5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#a3526d] hover:underline text-xs mb-4"
          >
            <ArrowLeft size={14} /> Back to Cart
          </button>
          <h2 className="text-white font-bold text-xl tracking-tight">
            Payment Method
          </h2>
        </div>

        <div className="px-5 py-3 space-y-2">
          {PAYMENT_METHODS.map((method) => {
            const isActive = selected === method.id;
            return (
              <button
                key={method.id}
                onClick={() => setSelected(method.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? "border-[#A3526D] bg-[#A3526D]/10"
                    : "border-white/5 bg-[#111] hover:border-white/10"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${method.iconBg}`}
                >
                  <method.Icon size={20} className={method.iconColor} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">
                    {method.label}
                  </p>
                  <p className="text-white/30 text-[10px] uppercase">
                    {method.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex justify-between items-center text-sm font-bold text-white">
            <span className="opacity-40">Amount Due</span>
            <span>฿{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="px-5 pb-6">
          <button
            onClick={handleConfirm}
            disabled={isProcessing || items.length === 0}
            className="w-full py-4 rounded-2xl bg-[#A3526D] hover:bg-[#c28498] disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-[#A3526D]/20 transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Processing...
              </>
            ) : (
              `Pay ฿${total.toLocaleString()}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
