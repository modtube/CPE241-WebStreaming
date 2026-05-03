import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  Star,
  Users,
  User,
  CreditCard,
  Settings,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', Icon: LayoutDashboard },
  { name: 'Movies', path: '/admin/movies', Icon: Film },
  { name: 'Reviews', path: '/admin/reviews', Icon: Star },
  { name: 'Crew', path: '/admin/crew', Icon: Users },
  { name: 'Users', path: '/admin/users', Icon: User },
  { name: 'Transactions', path: '/admin/transactions', Icon: CreditCard },
  { name: 'Setups', path: '/admin/setups', Icon: Settings },
];

export default function AdminSidebar() {
  return (
    /* ใช้ bg-admin-sidebar-bg (#111827) และ border-admin-border-dark (#D1D5DB) 
       ตามที่คุณกำหนดใน theme
    */
    <aside className="w-64 bg-admin-sidebar-bg min-h-screen fixed left-0 top-0 text-white flex flex-col border-r border-admin-border-dark/20 shadow-xl">
      
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-admin-border-dark/20">
        <span className="font-bold text-xl tracking-wider text-white">
          ADMIN
        </span>
        {/* ใช้ text-admin-primary (#2563EB) สำหรับคำว่า PANEL */}
        <span className="font-bold text-xl tracking-wider text-admin-primary ml-1">
          PANEL
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 space-y-1">
        {menuItems.map((item) => {
          const { Icon } = item;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mx-4 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-admin-primary text-white shadow-lg shadow-admin-primary/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <div className="mr-3 flex-shrink-0">
                <Icon size={20} strokeWidth={2} />
              </div>
              <span className="text-[15px] font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      
      {/* Optional: Footer section for the sidebar */}
      <div className="p-4 border-t border-admin-border-dark/10">
        <p className="text-xs text-gray-500 text-center">MODTUBE Admin v1.0</p>
      </div>
    </aside>
  );
}