/**
 * Premium plans and purchases.
 *
 * Real mode: RevenueCat (react-native-purchases), on a development or store
 * build with the public SDK keys set in EXPO_PUBLIC_RC_IOS_KEY and
 * EXPO_PUBLIC_RC_ANDROID_KEY. Premium = the RevenueCat entitlement "premium".
 *
 * Simulated mode: in Expo Go, or when no key is set, buying just flips a local
 * flag so the whole app can still be tried.
 *
 * Store product ids must match App Store Connect and Google Play Console.
 */
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import Purchases, { LOG_LEVEL, type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';
import { getPremiumFlag, savePremiumFlag } from './storage';

export const ENTITLEMENT = 'premium';

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

/** Fallback prices, shown until the store returns live prices. */
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

const apiKey = Platform.select({
  ios: process.env.EXPO_PUBLIC_RC_IOS_KEY,
  android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY,
});

const inExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/** True when real store purchases are available. */
export const purchasesEnabled = !!apiKey && !inExpoGo;

let configured = false;
let packages: Partial<Record<PlanId, PurchasesPackage>> = {};

const hasPremium = (info: CustomerInfo) => info.entitlements.active[ENTITLEMENT] !== undefined;

/** Product ids on Google Play subscriptions look like "id:base-plan"; match on the prefix. */
const planForProduct = (identifier: string): PlanId | undefined =>
  PLANS.find((p) => identifier === p.productId || identifier.startsWith(`${p.productId}:`))?.id;

/**
 * Sets up RevenueCat and returns whether the user has premium.
 * `onChange` fires when the subscription changes (renewal, expiry, refund).
 */
export async function initPurchases(onChange: (premium: boolean) => void): Promise<boolean> {
  if (!purchasesEnabled) return getPremiumFlag();
  if (!configured) {
    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey: apiKey! });
    Purchases.addCustomerInfoUpdateListener((info) => onChange(hasPremium(info)));
    configured = true;
  }
  try {
    return hasPremium(await Purchases.getCustomerInfo());
  } catch {
    return getPremiumFlag();
  }
}

/** Plans with live store prices where available. */
export async function loadPlans(): Promise<Plan[]> {
  if (!purchasesEnabled) return PLANS;
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current?.availablePackages ?? [];
    packages = {};
    for (const pkg of current) {
      const id = planForProduct(pkg.product.identifier);
      if (id) packages[id] = pkg;
    }
    return PLANS.map((p) => {
      const live = packages[p.id]?.product.priceString;
      return live ? { ...p, price: live, note: p.id === 'yearly' ? undefined : p.note } : p;
    });
  } catch {
    return PLANS;
  }
}

/** Returns true if the user has premium after the purchase, false if cancelled. Throws on store errors. */
export async function purchase(plan: PlanId): Promise<boolean> {
  if (!purchasesEnabled) {
    savePremiumFlag(true);
    return true;
  }
  const pkg = packages[plan];
  if (!pkg) throw new Error('Bu plan şu an mağazada bulunamadı.');
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return hasPremium(customerInfo);
  } catch (e) {
    if ((e as { userCancelled?: boolean }).userCancelled) return false;
    throw e;
  }
}

export async function restore(): Promise<boolean> {
  if (!purchasesEnabled) return getPremiumFlag();
  return hasPremium(await Purchases.restorePurchases());
}
