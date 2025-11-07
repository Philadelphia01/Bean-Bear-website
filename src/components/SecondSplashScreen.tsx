import React from 'react';

interface SecondSplashScreenProps {
  onGetStarted: () => void;
}

const SecondSplashScreen: React.FC<SecondSplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/splash screen.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col p-6">
        {/* Main Content */}
        <div className="flex-grow flex flex-col">
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Coffee so good, your taste buds will love it.
            </h1>
            <p className="text-gray-200 text-sm">
              The best grain the finest roast, the powerful flavor
            </p>
          </div>
          </div>
        </div>
        
        {/* Button */}
        <div className="mt-auto">
          <button
            onClick={onGetStarted}
            className="w-full py-4 bg-primary rounded-full text-black font-semibold text-lg shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondSplashScreen;
