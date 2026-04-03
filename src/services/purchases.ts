/**
 * RevenueCat configuration
 *
 * Korvaa REVENUECAT_API_KEY omalla avaimellasi App Store Connectista.
 * Entitlement ID pitää vastata App Store Connectissa luotua entitlementtiä.
 */

import Purchases, { LOG_LEVEL } from 'react-native-purchases';

export const ENTITLEMENT_ID = 'PEPTIX Pro';

const API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_KEY ?? '';

export function configurePurchases() {
  Purchases.setLogLevel(LOG_LEVEL.ERROR);
  Purchases.configure({ apiKey: API_KEY });
}
