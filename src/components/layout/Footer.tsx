import React from 'react';
import { Link } from 'react-router-dom';
import { CoffeeIcon, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-light pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <CoffeeIcon className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-white font-serif">Bear&Bean</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Bringing you the finest coffee experience since 2005. Quality beans, expert roasting, perfect brew.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/menu" className="text-gray-400 hover:text-primary transition-colors">Menu</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Opening Hours</h3>
            <ul className="text-gray-400">
              <li>Monday - Friday: 7:00 AM - 7:00 PM</li>
              <li>Saturday - Sunday: 8:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-dark-lighter mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Bear&Bean. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;