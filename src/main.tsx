import { StrictMode, useState } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import SplashScreen from './components/SplashScreen.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { CartProvider } from './contexts/CartContext.tsx';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

function MainApp() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Clear all localStorage data on page refresh
  React.useEffect(() => {
    // Clear all stored data
    localStorage.removeItem('cart');
    localStorage.removeItem('userOrders');

    console.log('🧹 Cart and orders data cleared on page refresh');

    // Show notification after a short delay
    setTimeout(() => {
      toast.success('🧹 Cart cleared - Fresh start!', {
        duration: 3000,
        style: {
          background: '#1E1E1E',
          color: '#F5F5F5',
          border: '1px solid #2A2A2A'
        }
      });
    }, 1000);
  }, []);

  return (
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            {showSplash ? (
              <SplashScreen onFinish={handleSplashFinish} />
            ) : (
              <App />
            )}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1E1E1E',
                  color: '#F5F5F5',
                  border: '1px solid #2A2A2A'
                }
              }}
            />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<MainApp />);