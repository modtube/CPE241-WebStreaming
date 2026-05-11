import TransactionHistoryTable from "../../components/customer/TransactionHistoryTable";
import { useCart } from "../../context/Usecart";

// ─── Mock seed data (แสดงตอนยังไม่มี transaction จาก cart) ───────────────────

const SEED_DATA = [
  {
    transactionId: "TXN-20250422",
    date: "2025-04-22",
    movieTitle: "Echoes of Tomorrow, Hollow Crown",
    amount: "$10.48",
    payment: "Credit Card",
    status: "Completed" as const,
    receipt: {
      transactionId: "TXN-20250422",
      items: [
        { title: "Echoes of Tomorrow", price: 6.99 },
        { title: "Hollow Crown", price: 3.49 },
      ],
      subtotal: 10.48,
      discount: 0,
      total: 10.48,
      date: "Apr 22, 2025",
      paymentMethod: "Credit Card",
      status: "Completed" as const,
    },
  },
  {
    transactionId: "TXN-20250312",
    date: "2025-03-12",
    movieTitle: "Midnight Accord",
    amount: "$4.99",
    payment: "PromptPay / QR",
    status: "Completed" as const,
    receipt: {
      transactionId: "TXN-20250312",
      items: [{ title: "Midnight Accord", price: 4.99 }],
      subtotal: 4.99,
      discount: 0,
      total: 4.99,
      date: "Mar 12, 2025",
      paymentMethod: "PromptPay / QR",
      status: "Completed" as const,
    },
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TransactionHistory() {
  // ✅ transactions จาก CartContext (จะมีเพิ่มทุกครั้งที่ checkout สำเร็จ)
  const { transactions } = useCart();

  // รวม transactions ใหม่ (newest first) กับ seed ไว้ด้วยกัน
  const allData = [...transactions, ...SEED_DATA];

  return (
    <div className="min-h-screen w-full bg-black text-white p-8 flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-1">
        <h4 className="text-3xl font-bold">Transaction History</h4>
        <p className="text-[#9CA3AF] text-sm font-normal">All your purchases</p>
      </div>
      <TransactionHistoryTable data={allData} />
    </div>
  );
}