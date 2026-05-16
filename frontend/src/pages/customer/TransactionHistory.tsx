import { useState, useEffect } from "react";
import TransactionHistoryTable, {
  type TransactionRecord,
} from "../../components/customer/TransactionHistoryTable";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟢 ฟังก์ชันดึงข้อมูลจาก API
  const fetchTransactions = async () => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!userId) return;

    try {
      setLoading(true);
      // 1. ดึงรายการ Transaction หลักของผู้ใช้
      const res = await fetch(
        `http://localhost:5000/api/transactions/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch transactions");
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        // 2. ดึงรายละเอียด (Movies) ของแต่ละ Transaction มาประกอบข้อมูล
        const mappedData: TransactionRecord[] = await Promise.all(
          result.data.map(async (item: any) => {
            try {
              const detailRes = await fetch(
                `http://localhost:5000/api/transactions/detail/${item.transaction_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              );
              const detailResult = await detailRes.json();
              const details = detailResult.data || [];

              // รวมชื่อหนังเพื่อแสดงในตารางหลัก
              const movieTitles = details
                .map((d: any) => d.movie_name)
                .join(", ");

              // คำนวณส่วนลดรวมและยอดรวมก่อนลด (สำหรับแสดงในใบเสร็จ)
              const totalDiscount = details.reduce(
                (sum: number, d: any) =>
                  sum + parseFloat(d.discount_applied || 0),
                0,
              );
              const totalOriginal = details.reduce(
                (sum: number, d: any) =>
                  sum + parseFloat(d.original_price || 0),
                0,
              );

              return {
                transactionId: item.transaction_id,
                date: item.transaction_date, // 🟢 ส่งเป็น ISO string เพื่อให้ Table ไป Sort ได้ถูกต้อง
                movieTitle: movieTitles || "ไม่พบรายชื่อหนัง", // 🟢 แสดงรายชื่อหนังจริงแทน Placeholder
                amount: `฿${parseFloat(item.total_amount).toLocaleString()}`,
                payment: item.payment_method.replace("_", " ").toUpperCase(),
                status: item.payment_status,
                receipt: {
                  transactionId: item.transaction_id,
                  // 🟢 ส่งข้อมูลหนังแต่ละเรื่องเข้าใบเสร็จพร้อมรายละเอียดราคา
                  items: details.map((d: any) => ({
                    title: d.movie_name,
                    price: parseFloat(d.sold_price),
                    originalPrice: parseFloat(d.original_price),
                    discount: parseFloat(d.discount_applied),
                  })),
                  subtotal: totalOriginal,
                  discount: totalDiscount,
                  total: parseFloat(item.total_amount),
                  date: new Date(item.transaction_date).toLocaleString(),
                  paymentMethod: item.payment_method,
                  status: item.payment_status,
                },
              };
            } catch (err) {
              console.error(
                `Error fetching detail for ${item.transaction_id}:`,
                err,
              );
              // กรณีดึงรายละเอียดไม่ได้ ให้ส่งข้อมูลพื้นฐานไปก่อน
              return {
                transactionId: item.transaction_id,
                date: item.transaction_date,
                movieTitle: "Movie Purchase",
                amount: `฿${parseFloat(item.total_amount).toLocaleString()}`,
                payment: item.payment_method.replace("_", " ").toUpperCase(),
                status: item.payment_status,
                receipt: {
                  transactionId: item.transaction_id,
                  items: [],
                  subtotal: parseFloat(item.total_amount),
                  discount: 0,
                  total: parseFloat(item.total_amount),
                  date: new Date(item.transaction_date).toLocaleString(),
                  paymentMethod: item.payment_method,
                  status: item.payment_status,
                },
              };
            }
          }),
        );

        setTransactions(mappedData);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white p-8 flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-1">
        <h4 className="text-2xl font-bold">Transaction History</h4>
        <p className="text-[#9CA3AF] text-sm font-normal">All your purchases</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#a3526d]"></div>
        </div>
      ) : (
        <TransactionHistoryTable data={transactions} />
      )}
    </div>
  );
}
