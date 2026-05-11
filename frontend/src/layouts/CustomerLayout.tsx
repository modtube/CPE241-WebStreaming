import { Outlet } from "react-router-dom";
import CustomerSidebar from "../components/customer/CustomerSidebar";
import CartButton from "../components/customer/CartButton";
import CartDrawer from "../components/customer/Cartdrawer";
import { CartProvider } from "../context/CartProvider";

// ─── Inner layout (needs to be inside CartProvider) ───────────────────────────

function CustomerLayoutInner() {
  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">
      {/* Sidebar */}
      <CustomerSidebar />

      {/* Main content area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top header bar with cart button */}
        <header className="sticky top-0 z-30 flex items-center justify-end px-6 pt-3 pb-2 bg-transparent backdrop-blur-0 border-b-0">
          <CartButton />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Cart drawer — globally mounted, controlled by CartContext */}
      <CartDrawer />
    </div>
  );
}

// ─── Layout with Provider ────────────────────────────────────────────────────

const CustomerLayout = () => (
  <CartProvider>
    <CustomerLayoutInner />
  </CartProvider>
);

export default CustomerLayout;