import { useState, useEffect, useCallback } from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { ENTITLEMENT_ID } from '../services/purchases';

export interface SubscriptionState {
  isSubscribed: boolean;
  loading: boolean;
  customerInfo: CustomerInfo | null;
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    isSubscribed: false,
    loading: true,
    customerInfo: null,
  });

  const refresh = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setState({
        isSubscribed: info.entitlements.active[ENTITLEMENT_ID] !== undefined,
        loading: false,
        customerInfo: info,
      });
    } catch {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    refresh();

    Purchases.addCustomerInfoUpdateListener(info => {
      setState({
        isSubscribed: info.entitlements.active[ENTITLEMENT_ID] !== undefined,
        loading: false,
        customerInfo: info,
      });
    });
  }, [refresh]);

  return { ...state, refresh };
}
