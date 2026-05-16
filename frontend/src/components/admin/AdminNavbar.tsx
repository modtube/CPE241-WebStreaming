import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut, ChevronDown } from "lucide-react";
import { message } from "antd";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Movies Management", path: "/admin/movies" },
  { name: "Reviews Management", path: "/admin/reviews" },
  { name: "Cast and Crew Management", path: "/admin/crew" },
  { name: "Users Management", path: "/admin/users" },
  { name: "Transactions Management", path: "/admin/transactions" },
  { name: "Genre Management", path: "/admin/setups/genre" },
  { name: "Language Management", path: "/admin/setups/language" },
  { name: "Country Management", path: "/admin/setups/country" },
  { name: "Rating Management", path: "/admin/setups/rating" },
  { name: "Setup & Quality Control Overview", path: "/admin/setups" },
];

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDetailView =
    location.pathname.includes("/add") ||
    location.pathname.includes("/edit") ||
    location.pathname.split("/").length > 3;

  const currentPathName =
    menuItems.find((item) => item.path === location.pathname)?.name ||
    "Admin Panel";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🟢 ฟังก์ชัน Logout ที่ทำงานได้จริงและปลอดภัย
  const handleLogout = () => {
    try {
      // 1. เคลียร์ข้อมูลทั้งหมดใน Storage
      localStorage.clear(); // ล้างทุกอย่างรวมถึง token และ user object
      sessionStorage.clear();

      // 2. แจ้งเตือนผู้ใช้
      message.success("ออกจากระบบสำเร็จ");

      // 3. ปิดเมนู
      setIsMenuOpen(false);

      // 4. ดีดกลับไปหน้า Login และล้างประวัติการเข้าชม (History Stack)
      // replace: true จะทำให้กดปุ่ม Back ใน Browser กลับมาหน้านี้ไม่ได้
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error);
      // Fallback กรณีเกิด error
      window.location.href = "/login";
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm shadow-gray-50/50">
      <div className="flex items-center gap-4">
        {isDetailView ? (
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft size={20} />
          </button>
        ) : null}
        <h1 className="text-lg font-bold text-gray-800 tracking-tight">
          {isDetailView ? "Back" : currentPathName}
        </h1>
      </div>

      <div className="flex items-center gap-4 relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-50 rounded-full transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-600/20">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <div className="hidden md:block text-left mr-1">
            <p className="text-sm font-bold text-gray-800 leading-none">
              Admin User
            </p>
            <p className="text-xs text-gray-500 mt-1">Super Admin</p>
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-3 border-b border-gray-50 mb-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Account Settings
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span className="font-medium">Logout System</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
