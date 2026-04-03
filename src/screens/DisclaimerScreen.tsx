import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text } from '../components/ui/Text';
import { theme } from '../theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

export const DISCLAIMER_KEY = '@peptix:disclaimerAccepted';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Disclaimer'>;

export function DisclaimerScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);
    await AsyncStorage.setItem(DISCLAIMER_KEY, '1');
    navigation.replace('Paywall');
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Brand */}
      <Text variant="logotype" align="center" style={styles.brand}>
        P E P T I X
      </Text>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="label" style={styles.sectionLabel}>
          IMPORTANT DISCLAIMER
        </Text>

        <Text variant="body" style={styles.body}>
          Peptix is a personal scheduling and tracking tool only. It does not provide medical advice,
          treatment recommendations, or dosage guidance of any kind.
        </Text>

        <Text variant="body" style={styles.body}>
          All decisions regarding peptide use are made solely at your own discretion and risk.
          Peptix assumes no responsibility or liability for any consequences arising from the use of
          this application or the substances tracked within it.
        </Text>

        <Text variant="body" style={styles.body}>
          Always consult a qualified healthcare professional before making any decisions related to
          your health.
        </Text>

        <Text variant="body" style={styles.body}>
          By continuing, you confirm that you are using Peptix solely as a personal scheduling tool
          and that you understand it is not a substitute for professional medical advice.
        </Text>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleAccept}
          disabled={loading}
          activeOpacity={0.75}
        >
          {loading
            ? <ActivityIndicator color={theme.colors.background.primary} />
            : <Text variant="label" style={styles.btnText}>I UNDERSTAND</Text>
          }
        </TouchableOpacity>

        <Text variant="label" style={styles.legal}>
          You must be 18 or older to use Peptix.
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

  brand: {
    marginTop: 40,
    marginBottom: 40,
    opacity: 0.35,
  },

  scroll: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: 24,
    gap: 20,
  },

  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: theme.colors.text.secondary,
    opacity: 0.5,
    marginBottom: 8,
  },

  body: {
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 22,
    color: theme.colors.text.secondary,
    opacity: 0.8,
  },

  footer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: 8,
    gap: 16,
  },
  btn: {
    backgroundColor: theme.colors.text.primary,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '400',
    color: theme.colors.background.primary,
  },

  legal: {
    fontSize: 10,
    fontWeight: '300',
    color: theme.colors.text.secondary,
    opacity: 0.3,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
