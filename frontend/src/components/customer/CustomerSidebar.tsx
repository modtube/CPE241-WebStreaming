import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  House,
  SquareLibrary,
  Menu,
  CreditCard,
  UserRound,
  AppWindowMac,
} from "lucide-react";

const menuItems = [
  { name: "Home", path: "/customer/home", Icon: House },
  {
    name: "Personal Library",
    path: "/customer/personal-library",
    Icon: SquareLibrary,
  },
  { name: "Playlists", path: "/customer/playlists", Icon: Menu },
  {
    name: "Transaction History",
    path: "/customer/transaction-history",
    Icon: CreditCard,
  },
  { name: "Edit Profile", path: "/customer/edit-profile", Icon: UserRound },
];

export default function CustomerSidebar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-customer-sidebar-bg min-h-screen fixed left-0 top-0 text-white flex flex-col border-r border-admin-border-dark/20 shadow-xl">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-admin-border-dark/20">
        <AppWindowMac className="w-8 h-8 p-1 rounded-lg bg-customer-primary/100 text-white mr-2" />
        <span className="font-bold text-xl tracking-wider text-white inline-block text-center">
          USER
        </span>
        {/* ใช้ text-admin-primary (#2563EB) สำหรับคำว่า PANEL */}
        <span className="font-bold text-xl tracking-wider text-customer-primary ml-1 inline-block text-center">
          PANEL
        </span>
      </div>

      <div
        ref={profileRef}
        className="relative mx-4 mt-4 rounded-xl bg-customer-sidebar-bg-secondary border border-customer-border-dark/20"
      >
        <button
          type="button"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className="w-full text-left border border-transparent hover:border-customer-border-pink active:border-customer-border-pink transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-customer-primary bg-gray-700 flex items-center justify-center overflow-hidden">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-emerald-400 border-2 border-customer-sidebar-bg" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">alexmorgan</p>
              <p className="text-xs text-gray-400">alex@example.com</p>
            </div>
          </div>
        </button>

        {isProfileOpen && (
          <div className="mt-3 mb-3">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-customer-primary bg-transparent  border border-transparent hover:border-customer-border-pink active:border-customer-border-pink transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-6 space-y-1">
        <span className="text-gray-600 mx-4 mb-2 inline-block">MENU</span>
        {menuItems.map((item) => {
          const { Icon } = item;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mx-4 rounded-xl transition-all duration-200 group border border-transparent hover:border-customer-border-pink transition-colors ${
                  isActive
                    ? "bg-customer-primary-transclucent/50 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
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
        <p className="text-xs text-gray-500 text-center">MODTUBE v1.0</p>
      </div>
    </aside>
  );
}
