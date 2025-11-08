import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Set authenticated immediately with basic info from Firebase Auth
        // This allows navigation to happen quickly
        const tempUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          role: 'waiter' // Default to minimum role, will update from Firestore
        };
        setUser(tempUser);
        setIsAuthenticated(true);
        setLoading(false); // Allow navigation immediately
        
        // Fetch full user profile from Firestore in the background
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user: User = {
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: userData.role || 'waiter'
            };
            setUser(user);
          } else {
            // Create user profile if it doesn't exist
            const user: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'waiter' // Default role for admin users
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              name: user.name,
              email: user.email,
              role: user.role,
              createdAt: new Date()
            });
            setUser(user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Keep the temp user, navigation already happened
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Immediately set auth state to allow fast navigation
      // onAuthStateChanged will update it with full data shortly
      const tempUser: User = {
        id: userCredential.user.uid,
        name: userCredential.user.displayName || 'User',
        email: userCredential.user.email || '',
        role: 'waiter' // Default, will be updated by onAuthStateChanged
      };
      setUser(tempUser);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      // For demo purposes, create mock users if they don't exist
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const hasPermission = (requiredRole: string) => {
    if (!user) return false;

    // Check if user's role has enough permissions based on hierarchy
    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    return userRoleLevel >= requiredRoleLevel;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      hasPermission,
      loading
    }}>
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