import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut, ChevronDown } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Movies Management', path: '/admin/movies' },
  { name: 'Reviews Management', path: '/admin/reviews' },
  { name: 'Cast and Crew Management', path: '/admin/crew' },
  { name: 'Users Management', path: '/admin/users' },
  { name: 'Transactions Management', path: '/admin/transactions' },
  { name: 'Setup & Quality Control Overview', path: '/admin/setups' },
];

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. Detect if we are in a detail/add/edit page (ตรวจสอบว่าเป็นหน้าย่อยไหม)
  const isDetailView = location.pathname.includes('/add') || 
                       location.pathname.includes('/edit') || 
                       location.pathname.split('/').length > 3;

  // 2. Find the current menu item based on URL
  const currentMenuItem = menuItems.find(item =>
    location.pathname === item.path ||
    (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path))
  );
  
  const currentMenuName = currentMenuItem?.name || 'Dashboard';

  // 3. Dynamic Title Logic (เปลี่ยนชื่อตามสถานะหน้า)
  let displayTitle = currentMenuName;
  if (location.pathname.includes('/add')) {
    displayTitle = `Add New ${currentMenuName.replace(' Management', '')}`;
  } else if (location.pathname.includes('/edit')) {
    displayTitle = `Edit ${currentMenuName.replace(' Management', '')}`;
  }

  // 4. Back button function
  const handleBack = () => {
    if (currentMenuItem) {
      navigate(currentMenuItem.path);
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    console.log("User logged out");
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-2 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">

        {/* Left Side: Back Button + Dynamic Title */}
        <div className="flex items-center gap-2">
          {isDetailView && (
            <button 
              onClick={handleBack}
              className="bg-white p-1 hover:bg-gray-100 hover:border-gray-100 rounded-full transition-colors text-gray-500 cursor-pointer"
              title="Go Back"
            >
              <ChevronLeft size={28} />
            </button>
          )}
          
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            {displayTitle}
          </h1>
        </div>

        {/* Right Side: Profile Menu */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-600/20">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="hidden md:block text-left mr-1">
              <p className="text-sm font-bold text-gray-800 leading-none">Admin User</p>
              <p className="text-xs text-gray-500 mt-1">Super Admin</p>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-3 border-b border-gray-50 mb-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Settings</p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 bg-white hover:bg-red-50 hover:border-red-50 transition-colors font-semibold text-left"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}