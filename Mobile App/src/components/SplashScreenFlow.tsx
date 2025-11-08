import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import SecondSplashScreen from './SecondSplashScreen';
import { useNavigate } from 'react-router-dom';

const SplashScreenFlow: React.FC = () => {
  const [showFirstSplash, setShowFirstSplash] = useState(true);
  const [showSecondSplash, setShowSecondSplash] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // First splash screen shows for 3 seconds
    const firstTimer = setTimeout(() => {
      setShowFirstSplash(false);
      setShowSecondSplash(true);
    }, 3000);

    return () => {
      clearTimeout(firstTimer);
    };
  }, []);

  const handleGetStarted = () => {
    setShowSecondSplash(false);
    // Navigate to home and replace the current history entry to prevent going back to splash
    navigate('/home', { replace: true });
  };

  // Mark splash as seen when user completes the flow
  const handleSplashComplete = () => {
    localStorage.setItem('hasSeenSplash', 'true');
    handleGetStarted();
  };

  if (showFirstSplash) {
    return <SplashScreen onFinish={() => {}} />;
  }

  if (showSecondSplash) {
    return <SecondSplashScreen onGetStarted={handleSplashComplete} />;
  }

  return null;
};

export default SplashScreenFlow;
