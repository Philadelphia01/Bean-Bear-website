import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ShoppingBagIcon, UserIcon, MenuIcon } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: HomeIcon, label: 'Home' },
    { path: '/home/menu', icon: MenuIcon, label: 'Menu' },
    { path: '/home/order', icon: ShoppingBagIcon, label: 'Order' },
    { path: '/login', icon: UserIcon, label: 'Account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-dark-light border-t border-gray-700 md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;

          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs mt-1 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
