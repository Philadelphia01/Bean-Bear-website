import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loyaltyService, LoyaltyPoints, LoyaltyTransaction } from '../services/loyaltyService';
import { ChevronLeft, Gift, TrendingUp, History, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const LoyaltyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loyalty, setLoyalty] = useState<LoyaltyPoints | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/home/login');
      return;
    }

    loadLoyaltyData();
  }, [user]);

  const loadLoyaltyData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [loyaltyData, transactionData] = await Promise.all([
        loyaltyService.getUserLoyalty(user.id),
        loyaltyService.getTransactionHistory(user.id, 20),
      ]);

      setLoyalty(loyaltyData);
      setTransactions(transactionData);
    } catch (error) {
      console.error('Error loading loyalty data:', error);
      toast.error('Failed to load loyalty information');
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'from-purple-500 to-pink-500';
      case 'gold':
        return 'from-yellow-400 to-orange-500';
      case 'silver':
        return 'from-gray-300 to-gray-500';
      default:
        return 'from-amber-600 to-amber-800';
    }
  };

  const getTierIcon = (tier: string) => {
    return <Star className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="pt-12 pb-16 min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!loyalty) {
    return (
      <div className="pt-12 pb-16 min-h-screen bg-dark">
        <div className="container px-4">
          <p className="text-white">Failed to load loyalty information</p>
        </div>
      </div>
    );
  }

  const discountAvailable = loyaltyService.getDiscountForPoints(loyalty.availablePoints);

  return (
    <div className="pt-12 pb-16 min-h-screen bg-dark">
      <div className="container px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl transition-all duration-200 mr-4"
            style={{ color: '#D4A76A' }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">Loyalty Program</h1>
        </div>

        {/* Tier Card */}
        <div className={`bg-gradient-to-r ${getTierColor(loyalty.tier)} rounded-2xl p-6 mb-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold capitalize mb-1">{loyalty.tier} Member</h2>
              <p className="text-white/80 text-sm">Keep earning to unlock higher tiers!</p>
            </div>
            {getTierIcon(loyalty.tier)}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Lifetime Points</span>
              <span className="font-bold">{loyalty.lifetimePoints.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{
                  width: `${Math.min((loyalty.lifetimePoints / 5000) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Points Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-dark-light rounded-xl p-4 border" style={{ borderColor: '#D4A76A40' }}>
            <div className="flex items-center mb-2">
              <Gift className="w-5 h-5 mr-2" style={{ color: '#D4A76A' }} />
              <span className="text-gray-400 text-sm">Available Points</span>
            </div>
            <p className="text-2xl font-bold text-white">{loyalty.availablePoints.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              ≈ R {discountAvailable.toFixed(2)} discount
            </p>
          </div>

          <div className="bg-dark-light rounded-xl p-4 border" style={{ borderColor: '#D4A76A40' }}>
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 mr-2" style={{ color: '#D4A76A' }} />
              <span className="text-gray-400 text-sm">Total Earned</span>
            </div>
            <p className="text-2xl font-bold text-white">{loyalty.totalPoints.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-dark-light rounded-xl p-4 mb-6 border" style={{ borderColor: '#D4A76A40' }}>
          <h3 className="text-lg font-bold text-white mb-3">How It Works</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Earn 1 point for every R1 spent</p>
            <p>• 100 points = R1 discount</p>
            <p>• Points never expire</p>
            <p>• Redeem points at checkout</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-dark-light rounded-xl p-4 border" style={{ borderColor: '#D4A76A40' }}>
          <div className="flex items-center mb-4">
            <History className="w-5 h-5 mr-2" style={{ color: '#D4A76A' }} />
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          </div>

          {transactions.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-dark rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-white text-sm">{transaction.description}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.type === 'earned' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {transaction.type === 'earned' ? '+' : ''}
                    {transaction.points.toLocaleString()} pts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;

