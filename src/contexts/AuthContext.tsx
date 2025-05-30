import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'supervisor' | 'waiter' | 'customer';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRole: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user roles and permissions hierarchy
const roleHierarchy: Record<string, number> = {
  'owner': 4,
  'supervisor': 3,
  'manager': 2,
  'waiter': 1,
  'customer': 0
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // This is a mock authentication
    // In a real app, you would validate credentials against a backend
    
    // For demo purposes, we'll simulate different users with different roles
    let mockUser: User;
    
    if (email === 'owner@coffee.com') {
      mockUser = { id: '1', name: 'Owner', email, role: 'owner' };
    } else if (email === 'manager@coffee.com') {
      mockUser = { id: '2', name: 'Manager', email, role: 'manager' };
    } else if (email === 'supervisor@coffee.com') {
      mockUser = { id: '3', name: 'Supervisor', email, role: 'supervisor' };
    } else if (email === 'waiter@coffee.com') {
      mockUser = { id: '4', name: 'Waiter', email, role: 'waiter' };
    } else {
      // Default to an owner account for demo
      mockUser = { id: '1', name: 'Owner', email: 'owner@coffee.com', role: 'owner' };
    }

    // Store user in localStorage and update state
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (requiredRole: string) => {
    if (!user) return false;
    
    // Check if user's role has enough permissions based on hierarchy
    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};