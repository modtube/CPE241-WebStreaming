import { Outlet } from 'react-router-dom';

const CustomerLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
    <main className="p-6 min-h-screen">
      <Outlet />
    </main>
  </div>
);

export default CustomerLayout;
