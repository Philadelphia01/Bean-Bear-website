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
import trackingService from '../services/trackingService';

// Menu Services
export const menuService = {
  // Get all menu items
  getMenuItems: async () => {
    try {
      // Use simple ordering that doesn't require composite index
      const q = query(collection(db, 'menuItems'), orderBy('title'));
      const snapshot = await getDocs(q);
      // Use Firestore document ID and remove any id field from data to avoid conflicts
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        // Remove id field from data if it exists (use Firestore doc.id instead)
        const { id: _, ...cleanData } = data;
        return { id: doc.id, ...cleanData };
      });

      // Remove duplicates based on title and category (keep the first one found)
      const uniqueItems = items.reduce((acc: any[], current: any) => {
        const existing = acc.find(
          (item: any) => 
            item.title?.toLowerCase().trim() === current.title?.toLowerCase().trim() &&
            item.category === current.category
        );
        
        if (!existing) {
          acc.push(current);
        }
        // If duplicate found, skip it (keep the first one)
        
        return acc;
      }, []);

      // Sort by category first, then by title (client-side sorting)
      return uniqueItems.sort((a: any, b: any) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.title.localeCompare(b.title);
      });
    } catch (error) {
      console.error('Error getting menu items:', error);
      // Fallback to simple query without ordering if composite index is missing
      try {
        const snapshot = await getDocs(collection(db, 'menuItems'));
        // Use Firestore document ID and remove any id field from data to avoid conflicts
        const items = snapshot.docs.map(doc => {
          const data = doc.data();
          // Remove id field from data if it exists (use Firestore doc.id instead)
          const { id: _, ...cleanData } = data;
          return { id: doc.id, ...cleanData };
        });

        // Remove duplicates based on title and category (keep the first one found)
        const uniqueItems = items.reduce((acc: any[], current: any) => {
          const existing = acc.find(
            (item: any) => 
              item.title?.toLowerCase().trim() === current.title?.toLowerCase().trim() &&
              item.category === current.category
          );
          
          if (!existing) {
            acc.push(current);
          }
          // If duplicate found, skip it (keep the first one)
          
          return acc;
        }, []);

        // Sort client-side
        return uniqueItems.sort((a: any, b: any) => {
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
          }
          return a.title.localeCompare(b.title);
        });
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
      // Use Firestore document ID and remove any id field from data to avoid conflicts
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        // Remove id field from data if it exists (use Firestore doc.id instead)
        const { id: _, ...cleanData } = data;
        return { id: doc.id, ...cleanData };
      });

      // Remove duplicates based on title and category (keep the first one found)
      const uniqueItems = items.reduce((acc: any[], current: any) => {
        const existing = acc.find(
          (item: any) => 
            item.title?.toLowerCase().trim() === current.title?.toLowerCase().trim() &&
            item.category === current.category
        );
        
        if (!existing) {
          acc.push(current);
        }
        // If duplicate found, skip it (keep the first one)
        
        return acc;
      }, []);

      // Sort by category first, then by title (client-side sorting)
      const sortedItems = uniqueItems.sort((a: any, b: any) => {
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
    const docRef = await addDoc(collection(db, 'menuItems'), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update menu item
  updateMenuItem: async (id: string, updates: any) => {
    if (!id || id.trim() === '') {
      throw new Error('Invalid menu item ID');
    }
    
    const docRef = doc(db, 'menuItems', id);
    
    // Check if document exists before updating
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Menu item with ID "${id}" not found in database`);
    }
    
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // Delete menu item
  deleteMenuItem: async (id: string) => {
    await deleteDoc(doc(db, 'menuItems', id));
  }
};

// Order Services
export const orderService = {
  // Get all orders
  getOrders: async () => {
    try {
      // Try query with orderBy first (if index exists)
      const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
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
        const snapshot = await getDocs(collection(db, 'orders'));
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

  // Get orders by user
  getOrdersByUser: async (userId: string) => {
    const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Add new order
  addOrder: async (order: any) => {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      date: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string) => {
    const docRef = doc(db, 'orders', id);
    
    // Get order to find customer for notification
    const orderDoc = await getDoc(docRef);
    const order = orderDoc.data();
    const previousStatus = order?.status;
    
    // Update order status
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    // Handle tracking based on status changes
    if (order && previousStatus !== status) {
      const deliveryPerson = order.deliveryPerson;
      const isCompleted = status === 'completed';
      const wasCompleted = previousStatus === 'completed';
      const isDelivered = status === 'delivered';
      const wasDelivered = previousStatus === 'delivered';
      
      // Start tracking when order is completed and driver is assigned
      if (isCompleted && !wasCompleted && deliveryPerson) {
        try {
          await trackingService.startTracking(
            id,
            deliveryPerson.id,
            order.address || '',
            order.customerLat,
            order.customerLng
          );
        } catch (error) {
          console.error('Error starting tracking:', error);
        }
      }
      
      // Stop tracking when order is delivered
      if (isDelivered && !wasDelivered) {
        try {
          await trackingService.stopTracking(id);
        } catch (error) {
          console.error('Error stopping tracking:', error);
        }
      }
    }
    
    // Trigger notification (this should be done via Cloud Functions in production)
    if (order?.customerId || order?.userId) {
      const customerId = order.customerId || order.userId;
      
      const statusMessages: Record<string, string> = {
        'preparing': 'Your order is being prepared!',
        'ready': 'Your order is ready for pickup!',
        'out for delivery': 'Your order is on the way!',
        'delivered': 'Your order has been delivered!',
        'completed': 'Your order has been completed!',
        'cancelled': 'Your order has been cancelled.',
      };
      
      const message = statusMessages[status] || 'Your order status has been updated.';
      
      // In production, use Firebase Cloud Functions to send FCM notifications
      // For now, we'll log it. The actual notification sending should be handled
      // by a Cloud Function that listens to order status changes
      console.log(`[Notification] Order ${id} status changed to ${status} for customer ${customerId}`);
      console.log(`[Notification] Message: ${message}`);
      
      // TODO: In production, trigger Cloud Function to send FCM notification
      // The Cloud Function should:
      // 1. Get user's notification tokens from Firestore
      // 2. Send FCM message to each token
      // 3. Include orderId and status in notification data
    }
  },

  // Update delivery person
  updateDeliveryPerson: async (id: string, deliveryPerson: any) => {
    const docRef = doc(db, 'orders', id);
    
    // Get current order data
    const orderDoc = await getDoc(docRef);
    const order = orderDoc.data();
    
    // Update delivery person
    await updateDoc(docRef, {
      deliveryPerson,
      updatedAt: serverTimestamp()
    });
    
    // Handle tracking - start if order is already completed and driver is being assigned
    if (order && deliveryPerson && order.status === 'completed') {
      try {
        await trackingService.startTracking(
          id,
          deliveryPerson.id,
          order.address || '',
          order.customerLat,
          order.customerLng
        );
        console.log('✅ Tracking started for order:', id, '- Driver assigned to completed order');
      } catch (error) {
        console.error('Error starting tracking:', error);
      }
    }
  },

  // Update pickup time
  updatePickupTime: async (id: string, pickupTime: string) => {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, {
      pickupTime,
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
