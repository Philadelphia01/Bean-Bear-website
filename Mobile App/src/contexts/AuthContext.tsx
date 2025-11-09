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
  const isRegisteringRef = React.useRef<boolean>(false);
  const registeredUserNameRef = React.useRef<string | null>(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        
        // Try to load user profile from Firestore
        try {
          // Small delay to ensure Firestore document is available after registration
          await new Promise(resolve => setTimeout(resolve, 500));
          
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
            console.log('📖 Loaded user from Firestore:', fullUser);
            // Only update if we don't already have the correct user state
            setUser(prevUser => {
              if (prevUser && prevUser.id === fullUser.id && prevUser.name === fullUser.name && prevUser.name !== 'User') {
                console.log('✅ User state already correct, not overwriting');
                return prevUser;
              }
              return fullUser;
            });
            setLoading(false);
          } else {
            // Document doesn't exist - use displayName from Auth if available
            const userName = firebaseUser.displayName || 'User';
            
            // Only update user state if we don't already have it set correctly
            setUser(prevUser => {
              if (prevUser && prevUser.id === firebaseUser.uid && prevUser.name && prevUser.name !== 'User') {
                console.log('✅ User state already set from registration, keeping it');
                setLoading(false);
                return prevUser;
              }
              
              // Create new user object
              const newUser: User = {
                id: firebaseUser.uid,
                name: userName,
                email: firebaseUser.email || '',
                role: 'customer'
              };
              
              // Only create Firestore document if name is not 'User'
              if (userName !== 'User') {
                setDoc(doc(db, 'users', firebaseUser.uid), {
                  name: newUser.name,
                  email: newUser.email,
                  role: newUser.role,
                  loyaltyPoints: 0,
                  memberSince: new Date().toISOString(),
                  favoriteOrders: [],
                  createdAt: new Date()
                }).catch(err => console.error('Error creating user document:', err));
                console.log('📝 Creating new user document:', newUser);
              }
              
              setLoading(false);
              return newUser;
            });
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Only update if we don't already have correct user state
          setUser(prevUser => {
            if (prevUser && prevUser.id === firebaseUser.uid && prevUser.name && prevUser.name !== 'User') {
              console.log('✅ Keeping existing user state despite error');
              setLoading(false);
              return prevUser;
            }
            
            const fallbackUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'customer'
            };
            console.log('⚠️ Using fallback user data:', fallbackUser);
            setLoading(false);
            return fallbackUser;
          });
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        isRegisteringRef.current = false;
        registeredUserNameRef.current = null;
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
      // Set flag to indicate we're registering
      isRegisteringRef.current = true;
      registeredUserNameRef.current = name;
      
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
      
      // Immediately update the user state with the registered name
      // This ensures the name is available right away without waiting for onAuthStateChanged
      const newUser: User = {
        id: userCredential.user.uid,
        name: name,
        email: email,
        phone: phone,
        role: 'customer'
      };
      setUser(newUser);
      setIsAuthenticated(true);
      setLoading(false);
      
      console.log('✅ User registered and state updated immediately:', newUser);
      
      // Keep the refs set for a short time to allow onAuthStateChanged to see them
      // onAuthStateChanged will fire after registration, and we want it to use the correct name
      // Reset after a delay to allow the Firestore document to be readable
      setTimeout(() => {
        isRegisteringRef.current = false;
        registeredUserNameRef.current = null;
      }, 2000);
    } catch (error) {
      isRegisteringRef.current = false;
      registeredUserNameRef.current = null;
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