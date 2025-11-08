// Loyalty Program Service
import { db } from '../firebase/config';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

export interface LoyaltyPoints {
  userId: string;
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  lastUpdated: string;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'redeemed' | 'expired';
  points: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

// Points calculation
const POINTS_PER_RAND = 1; // 1 point per R1 spent
const REDEMPTION_RATE = 100; // 100 points = R1 discount

// Tier thresholds
const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 2000,
  platinum: 5000,
};

class LoyaltyService {
  // Get user's loyalty points
  async getUserLoyalty(userId: string): Promise<LoyaltyPoints | null> {
    try {
      const docRef = doc(db, 'loyalty', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          userId,
          totalPoints: data.totalPoints || 0,
          availablePoints: data.availablePoints || 0,
          lifetimePoints: data.lifetimePoints || 0,
          tier: this.calculateTier(data.lifetimePoints || 0),
          lastUpdated: data.lastUpdated || new Date().toISOString(),
        };
      }

      // Create new loyalty account if doesn't exist
      return await this.createLoyaltyAccount(userId);
    } catch (error) {
      console.error('Error getting loyalty points:', error);
      return null;
    }
  }

  // Create new loyalty account
  private async createLoyaltyAccount(userId: string): Promise<LoyaltyPoints> {
    const newLoyalty: LoyaltyPoints = {
      userId,
      totalPoints: 0,
      availablePoints: 0,
      lifetimePoints: 0,
      tier: 'bronze',
      lastUpdated: new Date().toISOString(),
    };

    try {
      const docRef = doc(db, 'loyalty', userId);
      await setDoc(docRef, {
        ...newLoyalty,
        createdAt: serverTimestamp(),
      });
      return newLoyalty;
    } catch (error) {
      console.error('Error creating loyalty account:', error);
      return newLoyalty;
    }
  }

  // Calculate tier based on lifetime points
  private calculateTier(lifetimePoints: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (lifetimePoints >= TIER_THRESHOLDS.platinum) return 'platinum';
    if (lifetimePoints >= TIER_THRESHOLDS.gold) return 'gold';
    if (lifetimePoints >= TIER_THRESHOLDS.silver) return 'silver';
    return 'bronze';
  }

  // Earn points from order
  async earnPoints(userId: string, orderId: string, orderTotal: number): Promise<number> {
    try {
      const pointsEarned = Math.floor(orderTotal * POINTS_PER_RAND);
      
      const docRef = doc(db, 'loyalty', userId);
      const docSnap = await getDoc(docRef);

      const currentData = docSnap.exists() ? docSnap.data() : {
        totalPoints: 0,
        availablePoints: 0,
        lifetimePoints: 0,
      };

      const newTotalPoints = (currentData.totalPoints || 0) + pointsEarned;
      const newAvailablePoints = (currentData.availablePoints || 0) + pointsEarned;
      const newLifetimePoints = (currentData.lifetimePoints || 0) + pointsEarned;
      const newTier = this.calculateTier(newLifetimePoints);

      await updateDoc(docRef, {
        totalPoints: newTotalPoints,
        availablePoints: newAvailablePoints,
        lifetimePoints: newLifetimePoints,
        tier: newTier,
        lastUpdated: serverTimestamp(),
      });

      // Record transaction
      await this.recordTransaction(userId, {
        type: 'earned',
        points: pointsEarned,
        description: `Earned ${pointsEarned} points from order #${orderId}`,
        orderId,
      });

      return pointsEarned;
    } catch (error) {
      console.error('Error earning points:', error);
      return 0;
    }
  }

  // Redeem points for discount
  async redeemPoints(userId: string, pointsToRedeem: number, orderId?: string): Promise<number> {
    try {
      const docRef = doc(db, 'loyalty', userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Loyalty account not found');
      }

      const currentData = docSnap.data();
      const availablePoints = currentData.availablePoints || 0;

      if (availablePoints < pointsToRedeem) {
        throw new Error('Insufficient points');
      }

      const newAvailablePoints = availablePoints - pointsToRedeem;
      const newTotalPoints = (currentData.totalPoints || 0) - pointsToRedeem;

      await updateDoc(docRef, {
        availablePoints: newAvailablePoints,
        totalPoints: newTotalPoints,
        lastUpdated: serverTimestamp(),
      });

      // Record transaction
      await this.recordTransaction(userId, {
        type: 'redeemed',
        points: -pointsToRedeem,
        description: `Redeemed ${pointsToRedeem} points${orderId ? ` for order #${orderId}` : ''}`,
        orderId,
      });

      // Calculate discount amount
      const discountAmount = pointsToRedeem / REDEMPTION_RATE;
      return discountAmount;
    } catch (error) {
      console.error('Error redeeming points:', error);
      throw error;
    }
  }

  // Record loyalty transaction
  private async recordTransaction(
    userId: string,
    transaction: Omit<LoyaltyTransaction, 'id' | 'userId' | 'createdAt'>
  ): Promise<void> {
    try {
      const transactionsRef = collection(db, 'loyaltyTransactions');
      await setDoc(doc(transactionsRef), {
        userId,
        ...transaction,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error recording transaction:', error);
    }
  }

  // Get user's transaction history
  async getTransactionHistory(userId: string, limit: number = 50): Promise<LoyaltyTransaction[]> {
    try {
      const q = query(
        collection(db, 'loyaltyTransactions'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      
      const transactions = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit) as LoyaltyTransaction[];

      return transactions;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  // Get discount amount for points
  getDiscountForPoints(points: number): number {
    return points / REDEMPTION_RATE;
  }

  // Get points needed for discount
  getPointsForDiscount(discountAmount: number): number {
    return Math.ceil(discountAmount * REDEMPTION_RATE);
  }
}

export const loyaltyService = new LoyaltyService();

