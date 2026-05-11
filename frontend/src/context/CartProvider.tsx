import { useState, useCallback, type ReactNode } from "react";
import { CartContext, type CartItem, type TransactionRecord } from "./CartContext";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) =>
      prev.find((i) => i.id === item.id) ? prev : [...prev, item]
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart  = useCallback(() => setIsCartOpen(true),  []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addTransaction = useCallback((record: TransactionRecord) => {
    setTransactions((prev) => [record, ...prev]); // newest first
  }, []);

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const count = items.length;

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, clearCart,
        isCartOpen, openCart, closeCart,
        total, count,
        transactions, addTransaction,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}