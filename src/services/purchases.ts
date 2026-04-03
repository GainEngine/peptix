/**
 * RevenueCat configuration
 *
 * Korvaa REVENUECAT_API_KEY omalla avaimellasi App Store Connectista.
 * Entitlement ID pitää vastata App Store Connectissa luotua entitlementtiä.
 */

import Purchases, { LOG_LEVEL } from 'react-native-purchases';

export const ENTITLEMENT_ID = 'premium';

export function configurePurchases() {
  Purchases.setLogLevel(LOG_LEVEL.ERROR);
  Purchases.configure({
    apiKey: 'REVENUECAT_API_KEY', // Korvaa tämä
  });
}
