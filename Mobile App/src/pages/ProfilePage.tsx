import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Shield, HelpCircle, Star, Edit, Award, MoreVertical } from 'lucide-react';
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
          <div className="space-y-4">
            <div className="rounded-2xl p-6 backdrop-blur-sm shadow-lg" style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}>
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: '#D4A76A40' }}>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-1">Full Name</p>
                    <p className="text-white font-semibold text-lg">{user?.name || 'John Smith'}</p>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors" style={{ color: '#D4A76A' }}>
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: '#D4A76A40' }}>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white font-semibold text-lg">{user?.email || 'john.smith@email.com'}</p>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors" style={{ color: '#D4A76A' }}>
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: '#D4A76A40' }}>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-1">Phone</p>
                    <p className="text-white font-semibold text-lg">+27 81 234 5678</p>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors" style={{ color: '#D4A76A' }}>
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-1">Member Since</p>
                    <p className="text-white font-semibold text-lg">{memberSince}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl p-6 backdrop-blur-sm shadow-lg space-y-6" style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}>
              <div className="pb-4 border-b" style={{ borderColor: '#D4A76A40' }}>
                <h3 className="text-lg font-semibold text-white mb-3">Information We Collect</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We collect information you provide directly to us, such as when you create an account,
                  make a purchase, or contact us for support.
                </p>
              </div>
              <div className="pb-4 border-b" style={{ borderColor: '#D4A76A40' }}>
                <h3 className="text-lg font-semibold text-white mb-3">How We Use Your Information</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We use the information we collect to provide, maintain, and improve our services,
                  process transactions, and communicate with you.
                </p>
              </div>
              <div className="pb-4 border-b" style={{ borderColor: '#D4A76A40' }}>
                <h3 className="text-lg font-semibold text-white mb-3">Data Security</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We implement appropriate security measures to protect your personal information
                  against unauthorized access, alteration, or destruction.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Your Rights</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  You have the right to access, update, or delete your personal information.
                  Contact us if you wish to exercise these rights.
                </p>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl p-6 backdrop-blur-sm shadow-lg space-y-6" style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}>
              <div className="pb-4 border-b" style={{ borderColor: '#D4A76A40' }}>
                <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: '#D4A76A' }}>How do I place an order?</h4>
                    <p className="text-gray-300 text-sm">Browse our menu, add items to your cart, and proceed to checkout.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: '#D4A76A' }}>Can I modify my order?</h4>
                    <p className="text-gray-300 text-sm">Orders can be modified within 5 minutes of placement. Contact us immediately.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: '#D4A76A' }}>What are your delivery hours?</h4>
                    <p className="text-gray-300 text-sm">We deliver from 8:00 AM to 10:00 PM, 7 days a week.</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Still Need Help?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  If you can't find the answer you're looking for, our support team is here to help.
                </p>
                <button 
                  className="w-full py-3 rounded-lg font-semibold transition-colors"
                  style={{ backgroundColor: '#D4A76A', color: '#000000' }}
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        );

      case 'loyalty':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl p-6 backdrop-blur-sm shadow-lg" style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}>
              <div className="text-center mb-8 pb-6 border-b" style={{ borderColor: '#D4A76A40' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#D4A76A20' }}>
                  <Star className="w-10 h-10" style={{ color: '#D4A76A' }} />
                </div>
                <h3 className="text-3xl font-bold mb-2" style={{ color: '#D4A76A' }}>{loyaltyPoints} Points</h3>
                <p className="text-gray-400 text-sm">Member since {memberSince}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#2A2A2A', border: '1px solid #D4A76A30' }}>
                  <div className="text-2xl font-bold mb-2" style={{ color: '#D4A76A' }}>R 50</div>
                  <div className="text-sm text-gray-400 mb-1">Free Coffee</div>
                  <div className="text-xs text-gray-500">200 points</div>
                </div>
                <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#2A2A2A', border: '1px solid #D4A76A30' }}>
                  <div className="text-2xl font-bold mb-2" style={{ color: '#D4A76A' }}>R 100</div>
                  <div className="text-sm text-gray-400 mb-1">Meal Discount</div>
                  <div className="text-xs text-gray-500">400 points</div>
                </div>
                <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#2A2A2A', border: '1px solid #D4A76A30' }}>
                  <div className="text-2xl font-bold mb-2" style={{ color: '#D4A76A' }}>R 200</div>
                  <div className="text-sm text-gray-400 mb-1">Premium Reward</div>
                  <div className="text-xs text-gray-500">800 points</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">How to Earn Points</h4>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#D4A76A' }}></div>
                    <span className="text-sm">Earn 1 point for every R 10 spent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#D4A76A' }}></div>
                    <span className="text-sm">Bonus points on your birthday (+50 points)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#D4A76A' }}></div>
                    <span className="text-sm">Referral bonus (+100 points per friend)</span>
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
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-gray-900/20">
        <div className="relative">
          <button
            onClick={() => activeSection ? setActiveSection(null) : navigate('/home')}
            className="absolute left-0 top-0 flex items-center p-2 rounded-xl transition-all duration-200"
            style={{ color: '#D4A76A' }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="pt-8 flex items-center justify-center">
            <h1 className="text-title text-white">{activeSection ? sections.find(s => s.id === activeSection)?.title || 'Profile' : 'Profile'}</h1>
          </div>

          <button className="absolute right-0 top-0 flex items-center transition-colors p-2" style={{ color: '#D4A76A' }}>
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {!activeSection ? (
            <div className="space-y-4">
              {/* User Info Card */}
              <div className="rounded-2xl p-6 backdrop-blur-sm shadow-lg" style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: '#D4A76A20' }}>
                    <User className="w-8 h-8" style={{ color: '#D4A76A' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{user?.name || 'John Smith'}</h2>
                    <p className="text-gray-400 text-sm">{user?.email || 'john.smith@email.com'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#D4A76A40' }}>
                  <div>
                    <p className="text-gray-400 text-sm">Loyalty Points</p>
                    <p className="text-2xl font-bold" style={{ color: '#D4A76A' }}>{loyaltyPoints}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Member Since</p>
                    <p className="text-lg font-semibold text-white">{memberSince}</p>
                  </div>
                </div>
              </div>

              {/* Menu Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className="rounded-2xl p-6 backdrop-blur-sm shadow-lg text-left transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}
                    >
                      <Icon className="w-10 h-10 mb-4" style={{ color: '#D4A76A' }} />
                      <h3 className="text-lg font-semibold text-white mb-2">{section.title}</h3>
                      <p className="text-gray-400 text-sm">{section.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {renderSection()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
