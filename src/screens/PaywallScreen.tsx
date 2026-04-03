import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Purchases, { PurchasesPackage } from 'react-native-purchases';

import { Text } from '../components/ui/Text';
import { theme } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Paywall'>;
};

const FEATURES = [
  'Full peptide schedule tracking',
  'Weekly push reminders',
  'Cost and usage analytics',
  'My Stack share card',
];

export function PaywallScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [pkg, setPkg] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const offerings = await Purchases.getOfferings();
        const offering = offerings.current ?? offerings.all['PEPTIX_DEFAULT'] ?? null;
        const monthly = offering?.monthly ?? null;
        setPkg(monthly);
      } catch {
        // no-op — fallback to hardcoded price
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handlePurchase() {
    if (!pkg) return;
    setPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      if (Object.keys(customerInfo.entitlements.active).length > 0) {
        navigation.replace('Main');
      }
    } catch (e: unknown) {
      const err = e as { userCancelled?: boolean };
      if (!err.userCancelled) {
        Alert.alert('Purchase failed', 'Something went wrong. Please try again.');
      }
    } finally {
      setPurchasing(false);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    try {
      const info = await Purchases.restorePurchases();
      if (Object.keys(info.entitlements.active).length > 0) {
        navigation.replace('Main');
      } else {
        Alert.alert('No subscription found', 'No active subscription was found for this Apple ID.');
      }
    } catch {
      Alert.alert('Restore failed', 'Could not restore purchases. Please try again.');
    } finally {
      setRestoring(false);
    }
  }

  const introPrice = pkg?.product.introPrice?.priceString;
  const regularPrice = pkg?.product.priceString ?? '€0.99';

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Brand */}
        <Text variant="logotype" align="center" style={styles.brand}>
          P E P T I X
        </Text>

        {/* Headline */}
        <View style={styles.headlineBlock}>
          <Text variant="heading" align="center" style={styles.headline}>
            Your peptide{'\n'}companion.
          </Text>
          <Text variant="body" align="center" style={styles.subheadline}>
            Track schedules, monitor costs,{'\n'}and share your stack.
          </Text>
        </View>

        {/* Feature list */}
        <View style={styles.features}>
          {FEATURES.map(f => (
            <View key={f} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text variant="body" style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Price block */}
        <View style={styles.priceBlock}>
          {introPrice ? (
            <>
              <Text variant="label" align="center" style={styles.trialBadge}>
                14 DAYS FREE
              </Text>
              <Text variant="body" align="center" style={styles.priceText}>
                Then {regularPrice} / month
              </Text>
            </>
          ) : (
            <Text variant="body" align="center" style={styles.priceText}>
              {regularPrice} / month
            </Text>
          )}
          <Text variant="label" align="center" style={styles.cancelNote}>
            Cancel anytime
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaBtn, (purchasing || loading) && styles.ctaDisabled]}
          onPress={handlePurchase}
          disabled={purchasing || loading || !pkg}
          activeOpacity={0.75}
        >
          {purchasing || loading ? (
            <ActivityIndicator color={theme.colors.background.primary} />
          ) : (
            <Text variant="label" style={styles.ctaText}>
              {introPrice ? 'START 14-DAY FREE TRIAL' : 'SUBSCRIBE NOW'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRestore}
          disabled={restoring}
          activeOpacity={0.5}
          style={styles.restoreBtn}
        >
          {restoring
            ? <ActivityIndicator size="small" color={theme.colors.text.secondary} />
            : <Text variant="label" style={styles.restoreText}>Restore purchase</Text>
          }
        </TouchableOpacity>

        <Text variant="label" style={styles.legal}>
          Subscription automatically renews unless cancelled at least 24 hours before the end of the
          current period. Manage or cancel in your Apple ID settings.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scroll: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: 24,
  },

  brand: {
    marginTop: 32,
    marginBottom: 48,
    opacity: 0.4,
  },

  headlineBlock: {
    marginBottom: 48,
    gap: 12,
  },
  headline: {
    fontSize: 36,
    fontWeight: '200',
    lineHeight: 42,
    letterSpacing: -0.5,
    color: theme.colors.text.primary,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 22,
    color: theme.colors.text.secondary,
  },

  features: {
    marginBottom: 48,
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  featureText: {
    fontSize: 15,
    fontWeight: '300',
    color: theme.colors.text.primary,
  },

  priceBlock: {
    gap: 6,
    marginBottom: 8,
  },
  trialBadge: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '400',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '300',
    color: theme.colors.text.secondary,
  },
  cancelNote: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '300',
    color: theme.colors.text.secondary,
    opacity: 0.4,
  },

  footer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: 8,
    gap: 0,
  },
  ctaBtn: {
    backgroundColor: theme.colors.text.primary,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '400',
    color: theme.colors.background.primary,
  },

  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 16,
  },
  restoreText: {
    fontSize: 12,
    fontWeight: '300',
    color: theme.colors.text.secondary,
    letterSpacing: 0.3,
  },

  legal: {
    fontSize: 10,
    fontWeight: '300',
    color: theme.colors.text.secondary,
    opacity: 0.35,
    lineHeight: 14,
    textAlign: 'center',
    letterSpacing: 0,
  },
});
