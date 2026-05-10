import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';

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
  
  // Fix 1: Added <HTMLDivElement> so TS knows the ref points to a div
  const menuRef = useRef<HTMLDivElement>(null);

  const currentMenuItem = menuItems.find(item =>
    location.pathname === item.path ||
    (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path))
  );
  const currentMenuName = currentMenuItem?.name || 'Dashboard';

  const handleLogout = () => {
    console.log("User logged out");
    navigate('/login');
  };

  useEffect(() => {
    // Fix 2: Added 'MouseEvent' type to the event parameter
    function handleClickOutside(event: MouseEvent) {
      // Fix 3: event.target needs to be cast as a Node for .contains()
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border-b border-admin-border-light px-8 py-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text tracking-tight">{currentMenuName}</h1>
        </div>

        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full bg-white hover:bg-gray-100 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 bg-admin-primary rounded-full flex items-center justify-center shadow-md shadow-admin-primary/20">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="hidden md:block text-left mr-1">
              <p className="text-sm font-bold text-admin-text leading-none">Admin User</p>
              <p className="text-xs text-gray-500 mt-1">Super Admin</p>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-3 border-b border-gray-50 mb-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 bg-white hover:bg-red-50 transition-colors font-semibold"
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