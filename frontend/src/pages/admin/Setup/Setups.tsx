import { useNavigate } from 'react-router-dom';
import { Drama, Languages, Globe, Star } from 'lucide-react';

export default function Setups() {
  const navigate = useNavigate();

  const setupMenus = [
    {
      title: 'Genre View',
      description: 'Manage all genre',
      icon: <Drama size={26} strokeWidth={1.5} />,
      colorClass: 'text-pink-500 bg-pink-50 group-hover:bg-pink-500 group-hover:text-white',
      path: '/admin/setups/genre',
    },
    {
      title: 'Language View',
      description: 'Manage display and audio languages.',
      icon: <Languages size={26} strokeWidth={1.5} />,
      colorClass: 'text-green-500 bg-green-50 group-hover:bg-green-500 group-hover:text-white',
      path: '/admin/setups/language',
    },
    {
      title: 'Country View',
      description: 'Manage supported countries and regions.',
      icon: <Globe size={26} strokeWidth={1.5} />,
      colorClass: 'text-blue-500 bg-blue-50 group-hover:bg-blue-500 group-hover:text-white',
      path: '/admin/setups/country',
    },
    {
      title: 'Rating View',
      description: 'Manage all rating content',
      icon: <Star size={26} strokeWidth={1.5} />,
      colorClass: 'text-orange-500 bg-orange-50 group-hover:bg-orange-500 group-hover:text-white',
      path: '/admin/setups/rating',
    },
  ];

  return (
    <div className="p-6 md:p-8 w-full"> 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {setupMenus.map((menu, index) => (
          <div 
            key={index}
            onClick={() => navigate(menu.path)}
            className="group bg-white rounded-xl border-2 border-gray-100 p-8 cursor-pointer shadow-sm hover:shadow-md hover:border-gray-200 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex flex-col justify-center min-h-[220px]"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${menu.colorClass}`}>
              {menu.icon}
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {menu.title}
            </h3>
            <p className="text-gray-500 text-sm">
              {menu.description}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}
