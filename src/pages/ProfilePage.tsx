import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Shield, HelpCircle, Phone, MapPin, Star, Edit, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const loyaltyPoints = 245; // This would come from user data in a real app
  const memberSince = 'January 2024'; // This would come from user data

  const sections = [
    {
      id: 'personal',
      title: 'Personal Details',
      icon: User,
      description: 'Update your personal information'
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: Shield,
      description: 'View our privacy and data policies'
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      description: 'Get help and support'
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: Phone,
      description: 'Get in touch with our team'
    },
    {
      id: 'loyalty',
      title: 'Loyalty Program',
      icon: Award,
      description: 'View your rewards and points'
    }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Personal Details</h2>
            <div className="bg-dark-light rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">Full Name</p>
                    <p className="text-white font-medium">{user?.name || 'John Smith'}</p>
                  </div>
                  <button className="text-primary hover:text-primary-dark">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white font-medium">{user?.email || 'john.smith@email.com'}</p>
                  </div>
                  <button className="text-primary hover:text-primary-dark">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="text-white font-medium">+27 81 234 5678</p>
                  </div>
                  <button className="text-primary hover:text-primary-dark">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">Member Since</p>
                    <p className="text-white font-medium">{memberSince}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Privacy Policy</h2>
            <div className="bg-dark-light rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Information We Collect</h3>
                <p className="text-gray-300">
                  We collect information you provide directly to us, such as when you create an account,
                  make a purchase, or contact us for support.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">How We Use Your Information</h3>
                <p className="text-gray-300">
                  We use the information we collect to provide, maintain, and improve our services,
                  process transactions, and communicate with you.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Data Security</h3>
                <p className="text-gray-300">
                  We implement appropriate security measures to protect your personal information
                  against unauthorized access, alteration, or destruction.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Your Rights</h3>
                <p className="text-gray-300">
                  You have the right to access, update, or delete your personal information.
                  Contact us if you wish to exercise these rights.
                </p>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Help & Support</h2>
            <div className="bg-dark-light rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-primary mb-2">How do I place an order?</h4>
                    <p className="text-gray-300">Browse our menu, add items to your cart, and proceed to checkout.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-2">Can I modify my order?</h4>
                    <p className="text-gray-300">Orders can be modified within 5 minutes of placement. Contact us immediately.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-2">What are your delivery hours?</h4>
                    <p className="text-gray-300">We deliver from 8:00 AM to 10:00 PM, 7 days a week.</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Still Need Help?</h3>
                <p className="text-gray-300 mb-4">
                  If you can't find the answer you're looking for, our support team is here to help.
                </p>
                <button className="bg-primary text-dark px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
            <div className="bg-dark-light rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    Visit Us
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Bear & Bean Coffee Shop</strong></p>
                    <p>123 Coffee Street</p>
                    <p>Cape Town, 8001</p>
                    <p>South Africa</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-primary" />
                    Get In Touch
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Phone:</strong> +27 21 123 4567</p>
                    <p><strong>Email:</strong> info@bearbean.coffee</p>
                    <p><strong>Hours:</strong> Mon-Sun: 7:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Send us a Message</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-primary text-dark px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'loyalty':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Loyalty Program</h2>
            <div className="bg-dark-light rounded-lg p-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{loyaltyPoints} Points</h3>
                <p className="text-gray-400">Member since {memberSince}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-dark p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-2">R 50</div>
                  <div className="text-sm text-gray-400">Free Coffee</div>
                  <div className="text-xs text-gray-500">200 points</div>
                </div>
                <div className="bg-dark p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-2">R 100</div>
                  <div className="text-sm text-gray-400">Meal Discount</div>
                  <div className="text-xs text-gray-500">400 points</div>
                </div>
                <div className="bg-dark p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-2">R 200</div>
                  <div className="text-sm text-gray-400">Premium Reward</div>
                  <div className="text-xs text-gray-500">800 points</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">How to Earn Points</h4>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>Earn 1 point for every R 10 spent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>Bonus points on your birthday (+50 points)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>Referral bonus (+100 points per friend)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-dark">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-primary hover:text-primary-dark transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <h1 className="text-3xl font-bold text-white">Profile</h1>
          </div>

          {!activeSection ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="bg-dark-light rounded-lg p-6 text-left hover:bg-primary/5 transition-colors border border-primary/10 hover:border-primary/30"
                  >
                    <Icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">{section.title}</h3>
                    <p className="text-gray-400 text-sm">{section.description}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center text-primary hover:text-primary-dark transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </button>
              {renderSection()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
