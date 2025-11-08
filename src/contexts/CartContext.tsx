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
  cartItemId: string;
  id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  customizations?: {
    size?: string;
    sugar?: string;
    ice?: string;
    milk?: string;
    addons?: string[];
    specialInstructions?: string;
  };
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  addToCartWithCustomizations: (item: MenuItem, customizations: CartItem['customizations'], quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
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

  const createCartItemId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const calculateCartItemPrice = (item: CartItem) => {
    let basePrice = item.price;

    if (item.customizations?.size === 'Large') {
      if (item.category?.includes('beverages')) {
        basePrice += 10;
      } else {
        basePrice += 15;
      }
    }

    if (item.customizations?.milk && item.customizations.milk !== 'Regular Milk') {
      basePrice += 5;
    }

    if (item.customizations?.addons) {
      item.customizations.addons.forEach((addon: string) => {
        const priceMatch = addon.match(/\(\+R(\d+)\)/);
        if (priceMatch) {
          basePrice += parseInt(priceMatch[1]);
        }
      });
    }

    return basePrice;
  };

  const calculateCartTotal = (items: CartItem[]) => {
    return items.reduce((sum, cartItem) => sum + calculateCartItemPrice(cartItem) * cartItem.quantity, 0);
  };

  // Load cart from Firestore when user changes (non-blocking)
  useEffect(() => {
    if (user?.id) {
      // Don't block - load cart in background
      setLoading(true);
      cartService.getUserCart(user.id)
        .then((cartData) => {
          const items = (cartData.items || []).map((item: any) => ({
            ...item,
            cartItemId: item.cartItemId || createCartItemId()
          }));
          setCartItems(items);
          setTotal(calculateCartTotal(items));
        })
        .catch((error) => {
          console.error('Error loading cart:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setCartItems([]);
      setTotal(0);
      setLoading(false);
    }
  }, [user?.id]);

  // Update Firestore whenever cart changes (debounced to avoid too many writes)
  useEffect(() => {
    if (!user?.id || loading) return;

    // Debounce Firestore updates to avoid excessive writes
    const timeoutId = setTimeout(async () => {
      try {
        await cartService.updateUserCart(user.id, {
          items: cartItems,
          total
        });
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }, 1000); // Wait 1 second after last change before updating

    return () => clearTimeout(timeoutId);
  }, [cartItems, total, user?.id, loading]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.id === item.id && !cartItem.customizations
      );

      let updatedItems: CartItem[];

      if (existingItemIndex !== -1) {
        updatedItems = prevItems.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        toast.success(`${item.title} added to cart!`);
      } else {
        updatedItems = [
          ...prevItems,
          {
            cartItemId: createCartItemId(),
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: 1,
            category: item.category,
            image: item.image
          }
        ];
        toast.success(`${item.title} added to cart!`);
      }

      setTotal(calculateCartTotal(updatedItems));
      return updatedItems;
    });
  };

  const addToCartWithCustomizations = (item: MenuItem, customizations: CartItem['customizations'], quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(cartItem =>
        cartItem.id === item.id &&
        JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
      );

      let updatedItems: CartItem[];

      if (existingItemIndex !== -1) {
        updatedItems = prevItems.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
        toast.success(`${item.title} added to cart!`);
      } else {
        updatedItems = [
          ...prevItems,
          {
            cartItemId: createCartItemId(),
            id: item.id,
            title: item.title,
            price: item.price,
            quantity,
            category: item.category,
            image: item.image,
            customizations
          }
        ];
        toast.success(`${item.title} added to cart!`);
      }

      setTotal(calculateCartTotal(updatedItems));
      return updatedItems;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.cartItemId !== cartItemId);
      setTotal(calculateCartTotal(updatedItems));
      return updatedItems;
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      );
      setTotal(calculateCartTotal(updatedItems));
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      addToCartWithCustomizations,
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
