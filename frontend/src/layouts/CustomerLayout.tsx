import { Outlet } from "react-router-dom";
import CustomerSidebar from "../components/customer/CustomerSidebar";

const CustomerLayout = () => (
  <div className="flex min-h-screen bg-[#0d0d0d]">
    <CustomerSidebar />
    <main className="flex-1 w-full overflow-x-hidden relative">
      <Outlet />
    </main>
  </div>
);

export default CustomerLayout;