import { useEffect } from "react";
import { X, Download, CheckCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReceiptItem {
  title: string;
  price: number;
}

export interface ReceiptData {
  transactionId: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  total: number;
  date: string;
  paymentMethod: string;
  status: "Completed" | "Pending" | "Failed";
}

interface ReceiptModalProps {
  receipt: ReceiptData | null;
  onClose: () => void;
}

export default function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!receipt) return null;

  const formatPrice = (amount: number) =>
    amount === 0 ? "—$0.00" : `$${amount.toFixed(2)}`;

  // 🟢 ฟังก์ชันสำหรับสร้างและดาวน์โหลด PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // 1. ตั้งค่าหัวเอกสาร
    doc.setFontSize(20);
    doc.text("Movie Store Receipt", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Transaction ID: ${receipt.transactionId}`, 20, 35);
    doc.text(`Date: ${receipt.date}`, 20, 40);
    doc.text(`Payment Method: ${receipt.paymentMethod}`, 20, 45);
    doc.text(`Status: ${receipt.status}`, 20, 50);

    // 2. สร้างตารางรายการสินค้า
    const tableData = receipt.items.map((item) => [
      item.title,
      `$${item.price.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 60,
      head: [["Movie Title", "Price"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [163, 82, 109] }, // สี #A3526D
    });

    // 3. สรุปยอดเงิน (ต่อท้ายตาราง)
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: $${receipt.subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`Discount: -${formatPrice(receipt.discount)}`, 140, finalY + 7);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Paid: $${receipt.total.toFixed(2)}`, 140, finalY + 16);

    // 4. บันทึกไฟล์
    doc.save(`Receipt_${receipt.transactionId}.pdf`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl bg-[#000000] border border-[#2A2A2A] px-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white"
          aria-label="Close receipt"
        >
          <X size={14} />
        </button>

        <div className="flex flex-col items-center pt-8 pb-6 px-6 gap-3">
          <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="text-green-400" size={32} strokeWidth={2} />
          </div>
          <div className="text-center">
            <h2 className="text-white font-semibold text-lg leading-tight">
              Payment Successful!
            </h2>
            <p className="text-white/40 text-sm mt-0.5">
              Transaction confirmed
            </p>
          </div>
        </div>

        <div className="mx-4 mb-4 rounded-xl bg-[#111111] border border-white/8 px-5 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs uppercase tracking-widest">
              Receipt
            </span>
            <span className="bg-[#2a1a2e] text-[#f9d8e4] text-xs font-mono px-3 py-1 rounded-md border border-[#A3526D] bg-[#A3526D]/30">
              {receipt.transactionId}
            </span>
          </div>

          <div className="space-y-2">
            {receipt.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-white/80 text-sm">{item.title}</span>
                <span className="text-white/80 text-sm">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/8" />

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm text-white/50">
              <span>Subtotal</span>
              <span>${receipt.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-white/50">
              <span>Discount</span>
              <span className="text-green-400">
                {formatPrice(receipt.discount)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-white mt-1">
              <span>Total Paid</span>
              <span>${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-white/8" />

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">Date</span>
              <span className="text-white/70">{receipt.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Payment Method</span>
              <span className="text-white/70">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Status</span>
              <span className="text-green-400 font-medium">
                {receipt.status}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-5">
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r bg-[#A3526D] hover:bg-[#c28498] transition-all duration-150 text-white font-semibold text-sm"
          >
            <Download size={16} />
            Download PDF Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
