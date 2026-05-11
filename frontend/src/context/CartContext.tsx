import { createContext } from "react";
import type { ReceiptData } from "../components/customer/ReceiptModal";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  title: string;
  price: number;
  thumbnail?: string;
}

export interface TransactionRecord {
  transactionId: string;
  date: string;
  movieTitle: string;
  amount: string;
  payment: string;
  status: "Completed" | "Pending" | "Failed";
  receipt: ReceiptData;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  total: number;
  count: number;
  // ─── Transactions ──────────────────────────────────────
  transactions: TransactionRecord[];
  addTransaction: (record: TransactionRecord) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const CartContext = createContext<CartContextValue | null>(null);