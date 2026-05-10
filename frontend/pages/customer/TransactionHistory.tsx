import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionHistoryTable, {
  type TransactionRecord,
  type TransactionStatus,
} from "../../components/customer/TransactionHistoryTable";
import { api, getCurrentUserId } from "../../lib/api";

interface ApiTransaction {
  transaction_id: string;
  user_id: string;
  transaction_date: string;
  total_amount: string;
  payment_method: string;
  payment_status: string;
}

interface ApiTxnDetail {
  detail_id: string;
  transaction_id: string;
  movie_id: string | null;
  movie_name: string;
  original_price: string;
  discount_applied: string | null;
  sold_price: string;
}

// แปลง payment_method จาก DB ให้สวยขึ้น
function prettyPayment(method: string): string {
  return method
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// แปลง payment_status จาก DB ให้ตรงกับ TransactionStatus ของ component
function mapStatus(s: string): TransactionStatus {
  if (s === "Completed") return "Completed";
  if (s === "Pending") return "Pending";
  return "Failed"; // Refunded / Cancelled → แสดงเป็น Failed
}

export default function TransactionHistory() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();

  const [records, setRecords] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const list = await api.get<{ data: ApiTransaction[] }>(
          `/api/me/${userId}/transactions`
        );

        // ดึง details ของแต่ละ transaction
        const detailed = await Promise.all(
          list.data.map(async (t) => {
            const detail = await api.get<{
              transaction: ApiTransaction;
              details: ApiTxnDetail[];
            }>(`/api/me/${userId}/transactions/${t.transaction_id}`);

            const items = detail.details.map((d) => ({
              title: d.movie_name,
              price: parseFloat(d.sold_price),
            }));
            const subtotal = items.reduce((s, i) => s + i.price, 0);
            const discount = detail.details.reduce(
              (s, d) => s + parseFloat(d.discount_applied ?? "0"),
              0
            );

            const record: TransactionRecord = {
              transactionId: t.transaction_id,
              date: t.transaction_date.slice(0, 10),
              movieTitle: detail.details.map((d) => d.movie_name).join(", "),
              amount: `$${parseFloat(t.total_amount).toFixed(2)}`,
              payment: prettyPayment(t.payment_method),
              status: mapStatus(t.payment_status),
              receipt: {
                transactionId: t.transaction_id,
                items,
                subtotal,
                discount,
                total: parseFloat(t.total_amount),
                date: t.transaction_date.slice(0, 10),
                paymentMethod: prettyPayment(t.payment_method),
                status: mapStatus(t.payment_status),
              },
            };
            return record;
          })
        );
        setRecords(detailed);
      } catch (err) {
        const m = err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ";
        setError(m);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, navigate]);

  return (
    <div className="min-h-screen w-full bg-black text-white p-8 flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-1">
        <h4 className="text-2xl font-bold">Transaction History</h4>
        <p className="text-[#9CA3AF] text-sm font-normal">All your purchases</p>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading transactions...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : records.length === 0 ? (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-12 text-center">
          <p className="text-lg text-white">No transactions yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Your purchase history will appear here
          </p>
        </div>
      ) : (
        <TransactionHistoryTable data={records} />
      )}
    </div>
  );
}
