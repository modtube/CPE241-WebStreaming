import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { message } from "antd"; // นำเข้า antd สำหรับแจ้งเตือนตอน Logout

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

  // 🟢 1. ดึงข้อมูล User จาก localStorage มาเก็บไว้ใน State
  const [userData, setUserData] = useState({
    username: "Guest",
    email: "unknown@modtube.com",
  });

  useEffect(() => {
    // ดึงข้อมูลที่เก็บไว้ตอน Login (ถ้ามี)
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedId = localStorage.getItem("id");
    // หมายเหตุ: ในไฟล์ LoginForm ก่อนหน้า เราเพิ่มการเก็บ username เข้าไปแล้ว

    if (storedUsername) {
      setUserData({
        username: storedUsername,
        // เนื่องจาก API ไม่ได้คืน Email มา เราสามารถจำลองขึ้นมา
        // หรือถ้าในอนาคต API มี email ก็แค่เก็บเพิ่มแล้วดึงมาใช้ตรงนี้ครับ
        email: storedEmail,
      });
      console.log(
        `ID: ${storedId}, Username: ${storedUsername}, Email: ${storedEmail}`,
      );
    }

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

  // 🟢 2. ฟังก์ชัน Logout ที่ถูกต้อง
  const handleLogout = () => {
    // ล้างข้อมูลความปลอดภัยทั้งหมดออกจากเครื่อง
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");

    message.success("Logged out successfully");

    // พากลับไปหน้า Login
    navigate("/login");
  };

  return (
    <aside className="w-72 h-screen flex flex-col bg-customer-sidebar-bg border-r border-customer-border-pink/20 shrink-0 sticky top-0 z-50">
      <div
        className="p-6 border-b border-customer-border-pink/10 relative"
        ref={profileRef}
      >
        <div
          className="flex items-center gap-3 cursor-pointer group p-2 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-customer-border-pink/30 shadow-lg hover:shadow-customer-primary-transclucent/10"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-customer-primary-pink to-brand-maroon p-[2px]">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Profile"
              className="w-full h-full object-cover rounded-full bg-customer-sidebar-bg"
            />
          </div>
          <div className="flex-1 min-w-0">
            {/* 🟢 แสดงชื่อจาก localStorage */}
            <p className="text-white font-bold text-[15px] truncate group-hover:text-customer-primary-pink transition-colors">
              {userData.username}
            </p>
            <p className="text-gray-400 text-xs truncate font-medium tracking-tight">
              {userData.email}
            </p>
          </div>
        </div>

        {isProfileOpen && (
          <div className="absolute top-full left-6 right-6 mt-2 bg-customer-sidebar-bg border border-customer-border-pink/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 p-2 backdrop-blur-xl">
            <button
              onClick={() => navigate("/customer/edit-profile")}
              className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3"
            >
              <UserRound size={16} />
              View Profile
            </button>
            <div className="h-[1px] bg-customer-border-pink/10 my-1 mx-2" />
            {/* 🟢 ปุ่ม Logout ที่เรียก handleLogout */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors flex items-center gap-3"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-6 space-y-1">
        <span className="text-gray-600 mx-4 mb-2 inline-block text-[11px] font-bold tracking-widest uppercase">
          MENU
        </span>
        {menuItems.map((item) => {
          const { Icon } = item;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mx-4 rounded-xl transition-all duration-200 group border border-transparent hover:border-customer-border-pink/30 ${
                  isActive
                    ? "bg-customer-primary-transclucent text-white shadow-lg shadow-customer-primary-pink/5"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <div className="mr-3 flex-shrink-0">
                <Icon size={20} strokeWidth={2} />
              </div>
              <span className="text-[15px] font-medium tracking-tight">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="bg-gradient-to-br from-customer-primary-pink/10 to-brand-maroon/5 rounded-2xl p-4 border border-customer-border-pink/10">
          <p className="text-white font-bold text-sm mb-1">ModTube</p>
        </div>
      </div>
    </aside>
  );
}
