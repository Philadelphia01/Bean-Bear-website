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
  Menu,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  
  // Permission checks based on role descriptions
  const canViewMenu = hasPermission('manager'); // Manager, Supervisor, Owner can manage menu
  const canViewUsers = hasPermission('supervisor'); // Supervisor, Owner can manage users
  const canViewOrders = hasPermission('waiter'); // All roles can view orders
  const canViewAnalytics = hasPermission('manager'); // Manager, Supervisor, Owner can view analytics

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-dark overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-dark-light transition-all duration-300 fixed h-full z-10 overflow-y-auto`}
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
            {canViewMenu && (
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
            )}
            {canViewUsers && (
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
            )}
            {canViewAnalytics && (
              <li>
                <NavLink
                  to="/admin/analytics"
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg ${
                      isActive ? 'bg-primary text-dark' : 'text-gray-400 hover:bg-dark-lighter'
                    }`
                  }
                >
                  <BarChart3 className="w-5 h-5" />
                  {sidebarOpen && <span className="ml-3">Analytics</span>}
                </NavLink>
              </li>
            )}
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
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 flex flex-col overflow-hidden`}>
        <header className="bg-dark-light shadow-md py-4 px-6 flex items-center justify-between flex-shrink-0">
          <button 
            className="md:hidden" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-serif">Bear&Bean Admin</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Welcome, {user?.name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;