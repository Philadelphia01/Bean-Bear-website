import React, { createContext, useContext, useState, useEffect } from 'react';

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
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Update localStorage and total whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    const newTotal = cartItems.reduce((sum, item) => {
      let basePrice = item.price;

      // Add price for size upgrades
      if (item.customizations?.size === 'Large') {
        if (item.category?.includes('beverages')) {
          basePrice += 10; // Large drinks cost more
        } else {
          basePrice += 15; // Large food items cost more
        }
      }

      // Add price for milk alternatives
      if (item.customizations?.milk && item.customizations.milk !== 'Regular Milk') {
        basePrice += 5;
      }

      // Add price for addons
      if (item.customizations?.addons) {
        item.customizations.addons.forEach((addon: string) => {
          const priceMatch = addon.match(/\(\+R(\d+)\)/);
          if (priceMatch) {
            basePrice += parseInt(priceMatch[1]);
          }
        });
      }

      return sum + (basePrice * item.quantity);
    }, 0);
    setTotal(newTotal);
  }, [cartItems]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // If item exists, increment quantity
        return prevItems.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        // Otherwise add new item
        return [...prevItems, { 
          id: item.id, 
          title: item.title, 
          price: item.price, 
          quantity: 1,
          category: item.category,
          image: item.image
        }];
      }
    });
  };

  const addToCartWithCustomizations = (item: MenuItem, customizations: CartItem['customizations'], quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem =>
        cartItem.id === item.id &&
        JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
      );

      if (existingItem) {
        // If item with same customizations exists, increment quantity
        return prevItems.map(cartItem =>
          cartItem.id === item.id &&
          JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        // Otherwise add new item with customizations
        return [...prevItems, {
          id: item.id,
          title: item.title,
          price: item.price,
          quantity,
          category: item.category,
          image: item.image,
          customizations
        }];
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
      addToCartWithCustomizations,
      removeFromCart,
      updateQuantity,
      clearCart,
      total
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