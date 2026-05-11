import { FileText, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReceiptModal, { type ReceiptData } from "./ReceiptModal";
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
export type TransactionStatus = "Completed" | "Pending" | "Failed";
type SortOrder = "newest" | "oldest";
type FilterOption = "All Transactions" | TransactionStatus;
 
export type TransactionRecord = {
  transactionId: string;
  date: string;
  movieTitle: string;
  amount: string;
  payment: string;
  status: TransactionStatus;
  receipt: ReceiptData;
};
 
type TransactionHistoryTableProps = {
  data: TransactionRecord[];
};
 
// ─── Utilities ────────────────────────────────────────────────────────────────
 
const FILTER_OPTIONS: FilterOption[] = [
  "All Transactions",
  "Completed",
  "Pending",
  "Failed",
];
 
function sortByDate(items: TransactionRecord[], order: SortOrder): TransactionRecord[] {
  return [...items].sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return order === "newest" ? db - da : da - db;
  });
}
 
function filterByStatus(items: TransactionRecord[], filter: FilterOption): TransactionRecord[] {
  if (filter === "All Transactions") return items;
  return items.filter((item) => item.status === filter);
}
 
// ─── SortOrderButton ──────────────────────────────────────────────────────────
 
function SortOrderButton({
  order,
  onToggle,
}: {
  order: SortOrder;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all duration-150 text-white/80 text-sm font-medium whitespace-nowrap"
    >
      {order === "newest" ? "Sort: Newest First" : "Sort: Oldest First"}
      <ChevronDown size={14} className="text-white/50" />
    </button>
  );
}
 
// ─── FilterDropdown ───────────────────────────────────────────────────────────
 
function FilterDropdown({
  value,
  onChange,
}: {
  value: FilterOption;
  onChange: (v: FilterOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
 
  const statusDot: Record<FilterOption, string> = {
    "All Transactions": "bg-white/40",
    Completed: "bg-green-400",
    Pending: "bg-yellow-400",
    Failed: "bg-red-400",
  };
 
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all duration-150 text-white/80 text-sm font-medium whitespace-nowrap"
      >
        <span className={"w-2 h-2 rounded-full " + statusDot[value]} />
        {value}
        <ChevronDown
          size={14}
          className={"text-white/50 transition-transform duration-200 " + (open ? "rotate-180" : "")}
        />
      </button>
 
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-xl z-20 overflow-hidden py-1">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => { onChange(option); setOpen(false); }}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className={"w-2 h-2 rounded-full " + statusDot[option]} />
                {option}
              </span>
              {value === option && <Check size={13} className="text-[#EAB8C9]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
 
// ─── StatusBadge ──────────────────────────────────────────────────────────────
 
function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    Completed: "bg-[#14532D] text-[#4ADE80]",
    Pending: "bg-yellow-900/40 text-yellow-400",
    Failed: "bg-red-900/40 text-red-400",
  };
  return (
    <span className={"px-3 py-1.5 rounded-2xl text-sm " + styles[status]}>
      {status}
    </span>
  );
}
 
// ─── Main component ───────────────────────────────────────────────────────────
 
const TransactionHistoryTable = ({ data }: TransactionHistoryTableProps) => {
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [filter, setFilter] = useState<FilterOption>("All Transactions");
 
  const processed = sortByDate(filterByStatus(data, filter), sortOrder);
 
  return (
    <>
      {/* Controls */}
      <div className="flex items-center gap-3 justify-end mb-4">
        <SortOrderButton
          order={sortOrder}
          onToggle={() =>
            setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
          }
        />
        <FilterDropdown value={filter} onChange={setFilter} />
      </div>
 
      {/* Table */}
      <table className="w-full bg-customer-sidebar-bg-secondary rounded-2xl">
        <thead className="text-[#6B7280]">
          <tr>
            <th className="w-32 py-3 px-4 text-left">DATE</th>
            <th className="w-32 py-3 px-18 text-left">MOVIE TITLE(S)</th>
            <th className="w-32 py-3 px-4 text-left">AMOUNT</th>
            <th className="w-32 py-3 px-4 text-left">PAYMENT</th>
            <th className="w-32 py-3 px-4 text-left">STATUS</th>
            <th className="w-32 py-3 px-4 text-left">RECEIPT</th>
          </tr>
        </thead>
        <tbody>
          {processed.map((it, idx) => (
            <tr key={idx}>
              <td className="py-3 px-4 font-light">{it.date}</td>
              <td className="py-3 px-4 font-light">{it.movieTitle}</td>
              <td className="py-3 px-4 font-light">{it.amount}</td>
              <td className="py-3 px-4 font-light">{it.payment}</td>
              <td className="py-3 px-4">
                <StatusBadge status={it.status} />
              </td>
              <td className="py-3 px-4 text-[#EAB8C9]">
                <span
                  onClick={() => setActiveReceipt(it.receipt)}
                  className="flex flex-row items-center gap-2 cursor-pointer hover:underline py-2"
                >
                  <FileText size={16} />
                  View Detail
                </span>
              </td>
            </tr>
          ))}
 
          {processed.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-white/30 text-sm">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
 
      <ReceiptModal
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </>
  );
};
 
export default TransactionHistoryTable;
 