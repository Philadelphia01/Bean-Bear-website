import { db } from './config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { cacheService } from '../utils/cache';

// Menu Services
export const menuService = {
  // Get all menu items (with caching)
  getMenuItems: async () => {
    const cacheKey = 'menuItems';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Use simple ordering that doesn't require composite index
      const q = query(collection(db, 'menuItems'), orderBy('title'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort by category first, then by title (client-side sorting)
      const sortedItems = items.sort((a: any, b: any) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.title.localeCompare(b.title);
      });
      
      cacheService.set(cacheKey, sortedItems);
      return sortedItems;
    } catch (error) {
      console.error('Error getting menu items:', error);
      // Fallback to simple query without ordering if composite index is missing
      try {
        const snapshot = await getDocs(collection(db, 'menuItems'));
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort client-side
        const sortedItems = items.sort((a: any, b: any) => {
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
          }
          return a.title.localeCompare(b.title);
        });
        
        cacheService.set(cacheKey, sortedItems);
        return sortedItems;
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        return [];
      }
    }
  },

  // Get all menu items with real-time updates
  subscribeToMenu: (callback: (items: any[]) => void) => {
    const q = query(collection(db, 'menuItems'), orderBy('title'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort by category first, then by title (client-side sorting)
      const sortedItems = items.sort((a: any, b: any) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.title.localeCompare(b.title);
      });

      callback(sortedItems);
    });
  },

  // Get menu items by category
  getMenuByCategory: async (category: string) => {
    const q = query(collection(db, 'menuItems'), where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Add new menu item
  addMenuItem: async (item: any) => {
    const docRef = await addDoc(collection(db, 'menuItems'), item);
    // Invalidate cache when menu is updated
    cacheService.clear('menuItems');
    return docRef.id;
  },

  // Update menu item
  updateMenuItem: async (id: string, item: any) => {
    const docRef = doc(db, 'menuItems', id);
    await updateDoc(docRef, item);
    // Invalidate cache when menu is updated
    cacheService.clear('menuItems');
  },

  // Delete menu item
  deleteMenuItem: async (id: string) => {
    await deleteDoc(doc(db, 'menuItems', id));
    // Invalidate cache when menu is updated
    cacheService.clear('menuItems');
  }
};

// Order Services
export const orderService = {
  // Get all orders (for admin)
  getOrders: async () => {
    const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get orders by user
  getOrdersByUser: async (userId: string) => {
    try {
      // Try query with orderBy first (if index exists)
      const q = query(collection(db, 'orders'), where('customerId', '==', userId), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          // Handle Firestore timestamp or ISO string
          date: data.date?.toDate ? data.date.toDate().toISOString() : 
                data.date?.seconds ? new Date(data.date.seconds * 1000).toISOString() :
                data.date || new Date().toISOString()
        };
      });
      return orders;
    } catch (error: any) {
      // If index doesn't exist, fallback to query without orderBy and sort client-side
      if (error.code === 'failed-precondition') {
        console.warn('Composite index not found, sorting client-side');
        const q = query(collection(db, 'orders'), where('customerId', '==', userId));
        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            // Handle Firestore timestamp or ISO string
            date: data.date?.toDate ? data.date.toDate().toISOString() : 
                  data.date?.seconds ? new Date(data.date.seconds * 1000).toISOString() :
                  data.date || new Date().toISOString()
          };
        });
        // Sort by date descending (most recent first)
        return orders.sort((a: any, b: any) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
      }
      throw error;
    }
  },

  // Subscribe to user orders with real-time updates
  subscribeToUserOrders: (userId: string, callback: (orders: any[]) => void) => {
    const normalizeOrder = (doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Handle Firestore timestamp or ISO string
        date: data.date?.toDate ? data.date.toDate().toISOString() :
              data.date?.seconds ? new Date(data.date.seconds * 1000).toISOString() :
              data.date || new Date().toISOString()
      };
    };

    const sortOrders = (orders: any[]) => {
      return orders.sort((a: any, b: any) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    };

    // Use query without orderBy to avoid composite index requirement
    // We'll sort client-side instead
    const q = query(collection(db, 'orders'), where('customerId', '==', userId));
    
    return onSnapshot(q, 
      (snapshot) => {
        const orders = snapshot.docs.map(normalizeOrder);
        const sortedOrders = sortOrders(orders);
        callback(sortedOrders);
      },
      (error: any) => {
        console.error('Error in order subscription:', error);
        callback([]);
      }
    );
  },

  // Subscribe to a single order by ID with real-time updates
  subscribeToOrder: (orderId: string, callback: (order: any | null) => void) => {
    const orderRef = doc(db, 'orders', orderId);
    
    return onSnapshot(orderRef, 
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const normalizedOrder = {
            id: snapshot.id,
            ...data,
            // Handle Firestore timestamp or ISO string
            date: data.date?.toDate ? data.date.toDate().toISOString() :
                  data.date?.seconds ? new Date(data.date.seconds * 1000).toISOString() :
                  data.date || new Date().toISOString()
          };
          callback(normalizedOrder);
        } else {
          callback(null);
        }
      },
      (error: any) => {
        console.error('Error in order subscription:', error);
        callback(null);
      }
    );
  },

  // Add new order
  addOrder: async (order: any) => {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      // Preserve the date if provided, otherwise use serverTimestamp
      date: order.date || serverTimestamp(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update order
  updateOrder: async (orderId: string, updates: any) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }
};

// User Services
export const userService = {
  // Get user profile
  getUserProfile: async (userId: string) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Create/update user profile
  setUserProfile: async (userId: string, profile: any) => {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      ...profile,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  // Get user addresses
  getUserAddresses: async (userId: string) => {
    const q = query(collection(db, 'addresses'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Add user address
  addUserAddress: async (userId: string, address: any) => {
    const docRef = await addDoc(collection(db, 'addresses'), {
      ...address,
      userId,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Delete user address
  deleteUserAddress: async (addressId: string) => {
    await deleteDoc(doc(db, 'addresses', addressId));
  },

  // Get saved payment methods
  getUserPaymentMethods: async (userId: string) => {
    const q = query(collection(db, 'paymentMethods'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Add payment method
  addUserPaymentMethod: async (userId: string, paymentMethod: any) => {
    const docRef = await addDoc(collection(db, 'paymentMethods'), {
      ...paymentMethod,
      userId,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Delete payment method
  deleteUserPaymentMethod: async (paymentMethodId: string) => {
    await deleteDoc(doc(db, 'paymentMethods', paymentMethodId));
  }
};

// Cart Services
export const cartService = {
  // Get user cart
  getUserCart: async (userId: string) => {
    const docRef = doc(db, 'carts', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : { items: [], total: 0 };
  },

  // Update user cart
  updateUserCart: async (userId: string, cart: any) => {
    const docRef = doc(db, 'carts', userId);
    await setDoc(docRef, {
      ...cart,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  // Clear user cart
  clearUserCart: async (userId: string) => {
    const docRef = doc(db, 'carts', userId);
    await setDoc(docRef, {
      items: [],
      total: 0,
      updatedAt: serverTimestamp()
    });
  }
};
