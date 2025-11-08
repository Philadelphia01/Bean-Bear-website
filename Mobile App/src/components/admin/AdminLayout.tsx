import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  CoffeeIcon,
  LayoutDashboard,
  ShoppingBag,
  List,
  Users,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminBottomNav from './AdminBottomNav';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-dark">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-dark-light transition-all duration-300 hidden md:block fixed h-full z-10`}
      >
        <div className="flex items-center justify-between p-4 border-b border-dark-lighter">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
            <CoffeeIcon className="w-8 h-8 text-primary" />
            {sidebarOpen && (
              <span className="ml-2 text-lg font-bold text-white">Admin Panel</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-dark-lighter"
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${!sidebarOpen && 'rotate-180'}`}
            />
          </button>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg ${
                    isActive ? 'bg-primary text-dark' : 'text-gray-400 hover:bg-dark-lighter'
                  }`
                }
              >
                <LayoutDashboard className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg ${
                    isActive ? 'bg-primary text-dark' : 'text-gray-400 hover:bg-dark-lighter'
                  }`
                }
              >
                <ShoppingBag className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3">Orders</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/menu"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg ${
                    isActive ? 'bg-primary text-dark' : 'text-gray-400 hover:bg-dark-lighter'
                  }`
                }
              >
                <List className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3">Menu</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg ${
                    isActive ? 'bg-primary text-dark' : 'text-gray-400 hover:bg-dark-lighter'
                  }`
                }
              >
                <Users className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3">Users</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-dark-lighter">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
            {sidebarOpen && (
              <div className="mr-3">
                <div className="font-medium">{user?.name}</div>
                <div className="text-sm text-gray-400 capitalize">{user?.role}</div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 rounded-full hover:bg-dark-lighter"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300`}>
        {/* Mobile Header - Only show on mobile */}
        <header className="bg-dark-light shadow-md py-4 px-6 flex items-center justify-between md:hidden">
          <button
            className="p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-serif text-white">Bear&Bean Admin</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 hidden sm:block">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Desktop Header - Only show on desktop */}
        <header className="hidden md:flex bg-dark-light shadow-md py-4 px-6 items-center justify-between">
          <h1 className="text-xl font-serif">Bear&Bean Admin</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white rounded-full"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <AdminBottomNav />
    </div>
  );
};

export default AdminLayout;