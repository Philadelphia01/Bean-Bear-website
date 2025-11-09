import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'owner' | 'manager' | 'supervisor' | 'waiter' | 'customer';
};

type CustomerUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
  memberSince: string;
  favoriteOrders: string[];
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
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
        setIsAuthenticated(true);
        
        // Try to load user profile from Firestore first (preferred source of truth)
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const fullUser: User = {
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              phone: userData.phone,
              role: userData.role || 'customer'
            };
            setUser(fullUser);
            setLoading(false);
          } else {
            // User document doesn't exist, create it
            // Use displayName from Auth if available, otherwise fallback
            const userName = firebaseUser.displayName || 'User';
            const newUser: User = {
              id: firebaseUser.uid,
              name: userName,
              email: firebaseUser.email || '',
              role: 'customer'
            };
            
            // Create user profile in Firestore
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              loyaltyPoints: 0,
              memberSince: new Date().toISOString(),
              favoriteOrders: [],
              createdAt: new Date()
            });
            
            setUser(newUser);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Fallback to Firebase Auth data if Firestore fails
          const fallbackUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: 'customer'
          };
          setUser(fallbackUser);
          setLoading(false);
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
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Set displayName in Firebase Auth so it persists across sessions
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        phone,
        role: 'customer',
        loyaltyPoints: 0,
        memberSince: new Date().toISOString(),
        favoriteOrders: [],
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Registration error:', error);
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
      register,
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