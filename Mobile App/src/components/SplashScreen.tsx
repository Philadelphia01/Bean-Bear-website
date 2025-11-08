import React, { useEffect } from 'react';
import { CoffeeIcon } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark">
      <div className="text-center">
        <div className="relative">
          <CoffeeIcon className="w-20 h-20 text-primary mx-auto mb-6 animate-pulse" />
          <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-primary rounded-full animate-ping"></div>
        </div>
        <h1 className="text-4xl font-bold text-white font-serif mb-2">Bear&Bean</h1>
        <p className="text-gray-400 text-lg">Coffee Emporium</p>
        <div className="mt-8">
          <div className="w-32 h-1 bg-primary mx-auto rounded-full">
            <div className="h-full bg-primary-dark rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
