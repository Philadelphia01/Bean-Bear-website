import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../firebase/services';
import toast from 'react-hot-toast';

export type MenuItem = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  allergens?: string[];
};

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Load cart from Firestore when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const cartData = await cartService.getUserCart(user.id);
          setCartItems(cartData.items || []);
          setTotal(cartData.total || 0);
        } catch (error) {
          console.error('Error loading cart:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setCartItems([]);
        setTotal(0);
        setLoading(false);
      }
    };

    loadCart();
  }, [user?.id]);

  // Calculate total from cart items
  useEffect(() => {
    const calculatedTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(calculatedTotal);
  }, [cartItems]);

  // Update Firestore whenever cart changes
  useEffect(() => {
    const updateCart = async () => {
      if (user?.id && !loading) {
        try {
          await cartService.updateUserCart(user.id, {
            items: cartItems,
            total
          });
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      }
    };

    updateCart();
  }, [cartItems, total, user?.id, loading]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        // If item exists, increment quantity
        const updatedItems = prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        toast.success(`${item.title} added to cart!`);
        return updatedItems;
      } else {
        // Otherwise add new item
        const updatedItems = [...prevItems, {
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: 1,
          category: item.category,
          image: item.image
        }];
        toast.success(`${item.title} added to cart!`);
        return updatedItems;
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};