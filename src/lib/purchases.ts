/**
 * Premium plans and purchase flow.
 *
 * MVP stub: purchases are simulated with a local flag so the whole app can be
 * tried in Expo Go. Before release, replace `purchase` and `restore` with
 * RevenueCat (`react-native-purchases`), which needs a development build.
 * Product ids below should match App Store Connect and Google Play Console.
 */
import { getPremiumFlag, savePremiumFlag } from './storage';

export type PlanId = 'yearly' | 'monthly' | 'lifetime';

export type Plan = {
  id: PlanId;
  productId: string;
  title: string;
  price: string;
  note?: string;
  badge?: string;
  trialDays?: number;
};

export const PLANS: Plan[] = [
  {
    id: 'yearly',
    productId: 'auram_premium_yearly',
    title: 'Yıllık',
    price: '₺499,99',
    note: 'Ayda yalnızca ₺41,67 · %48 tasarruf',
    badge: 'EN POPÜLER · 7 GÜN ÜCRETSİZ',
    trialDays: 7,
  },
  { id: 'monthly', productId: 'auram_premium_monthly', title: 'Aylık', price: '₺79,99' },
  { id: 'lifetime', productId: 'auram_premium_lifetime', title: 'Ömür boyu', price: '₺2.499,99' },
];

export const isPremium = (): boolean => getPremiumFlag();

export async function purchase(plan: PlanId): Promise<boolean> {
  // TODO(RevenueCat): Purchases.purchasePackage(...) for PLANS[plan].productId
  void plan;
  savePremiumFlag(true);
  return true;
}

export async function restore(): Promise<boolean> {
  // TODO(RevenueCat): Purchases.restorePurchases()
  return getPremiumFlag();
}
