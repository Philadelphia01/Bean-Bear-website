import React from 'react';
import { Link } from 'react-router-dom';
import { CoffeeIcon, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark p-4">
      <CoffeeIcon className="w-16 h-16 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-2 font-serif">404</h1>
      <h2 className="text-2xl mb-6">Page Not Found</h2>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary flex items-center">
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;