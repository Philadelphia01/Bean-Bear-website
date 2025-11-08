import React from 'react';

const DownloadAppPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center py-20 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
          {/* Left Section - Text and Call-to-Action */}
          <div className="flex flex-col justify-center space-y-5" style={{ marginRight: '-80px', zIndex: 20, position: 'relative' }}>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Instant Coffee At Your Home
            </h1>
            <p className="text-base text-gray-300 leading-relaxed max-w-lg">
              Experience the convenience of ordering your favorite coffee from the comfort of your home. 
              Browse our premium selection, customize your order, and have it delivered fresh to your doorstep. 
              Join thousands of coffee lovers who trust Bear & Bean for their daily brew.
            </p>
            <a
              href="#download"
              className="bg-primary text-dark px-6 py-3 rounded-lg font-bold text-base hover:bg-primary-dark transition-colors w-fit inline-block text-center"
              onClick={(e) => {
                e.preventDefault();
                // Scroll to download section or open app stores
                window.open('https://play.google.com/store', '_blank');
              }}
            >
              DOWNLOAD OUR APP
            </a>
          </div>

          {/* Right Section - Mobile App Visuals */}
          <div className="relative flex items-center justify-center lg:justify-start" style={{ marginLeft: '-80px' }}>
            {/* Elliptical Outline Graphic - Behind image with app color */}
            <div 
              className="absolute border-2 opacity-20" 
              style={{ 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: '450px',
                height: '300px',
                borderRadius: '50%',
                borderColor: '#D4A76A'
              }}
            ></div>
            
            <img
              src="/images/mobile.png"
              alt="Bear & Bean Mobile App"
              className="relative z-10"
              style={{ width: '750px', maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppPage;
