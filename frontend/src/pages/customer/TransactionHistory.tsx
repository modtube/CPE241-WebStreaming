// using component ReceiptModal.tsx, TransactionHistoryTable.tsx

import TransactionHistoryTable, { type TransactionRecord } from "../../components/customer/TransactionHistoryTable";

const mockData: TransactionRecord[] = [
  {
    transactionId: "TXN-20250422",
    date: "2015-12-11",
    movieTitle: "Echoes of Tomorrow, Hollow Crown",
    amount: "$10.48",
    payment: "Credit Card",
    status: "Completed",
    receipt: {
      transactionId: "TXN-20250422",
      items: [
        { title: "Echoes of Tomorrow", price: 6.99 },
        { title: "Hollow Crown", price: 3.49 },
      ],
      subtotal: 10.48,
      discount: 0,
      total: 10.48,
      date: "2020-12-11",
      paymentMethod: "Credit Card",
      status: "Completed",
    },
  },
  {
    transactionId: "TXN-20250423",
    date: "2026-12-11",
    movieTitle: "Echoes of Tomorrow, Hollow Crown",
    amount: "$10.48",
    payment: "Credit Card",
    status: "Completed",
    receipt: {
      transactionId: "TXN-20250423",
      items: [
        { title: "Echoes of Tomorrow", price: 6.99 },
        { title: "Hollow Crown", price: 3.49 },
      ],
      subtotal: 10.48,
      discount: 0,
      total: 10.48,
      date: "2020-12-11",
      paymentMethod: "Credit Card",
      status: "Completed",
    },
  },
  {
    transactionId: "TXN-20250424",
    date: "2020-12-11",
    movieTitle: "Echoes of Tomorrow, Hollow Crown",
    amount: "$10.48",
    payment: "Credit Card",
    status: "Completed",
    receipt: {
      transactionId: "TXN-20250424",
      items: [
        { title: "Echoes of Tomorrow", price: 6.99 },
        { title: "Hollow Crown", price: 3.49 },
      ],
      subtotal: 10.48,
      discount: 0,
      total: 10.48,
      date: "2020-12-11",
      paymentMethod: "Credit Card",
      status: "Completed",
    },
  },

]

export default function TransactionHistory() {
  return (
    <div className="min-h-screen w-full bg-black text-white p-8 flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-1"> 
        <h4 className="text-2xl font-bold">Transaction History</h4>
        <p className="text-[#9CA3AF] text-sm font-normal">All your purchases</p>
      </div>
      <TransactionHistoryTable data={mockData} />
    </div>
  );
}
