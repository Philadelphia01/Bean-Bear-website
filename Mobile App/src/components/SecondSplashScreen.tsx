import React from 'react';

interface SecondSplashScreenProps {
  onGetStarted: () => void;
}

const SecondSplashScreen: React.FC<SecondSplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="fixed inset-0 z-50 h-screen w-full overflow-hidden bg-dark">
      {/* Background Image */}
      <img
        src="/images/mobile splash.jpg"
        alt="Splash Background"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          console.error('Failed to load splash image');
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col p-6 z-10">
        {/* Main Content */}
        <div className="flex-grow"></div>
        
        {/* Text and Button */}
        <div className="mt-auto space-y-4">
          <div className="text-center">
            <p className="text-gray-200 text-base">
              Discover our carefully selected beans, expertly roasted for the perfect cup every time
            </p>
          </div>
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
