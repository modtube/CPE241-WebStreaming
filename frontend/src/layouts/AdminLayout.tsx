import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';

const AdminLayout = () => (
  <div className="min-h-screen h-screen bg-admin-bg flex theme-admin">
    <AdminSidebar />
    <main className="ml-64 flex-1 flex flex-col overflow-hidden bg-admin-bg">
      <AdminNavbar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="min-h-full">
          <Outlet />
        </div>
      </div>
    </main>
  </div>
);

export default AdminLayout;
