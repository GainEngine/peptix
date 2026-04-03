import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Envelope } from 'phosphor-react-native';

import { GlobalHeader } from '../components/ui/GlobalHeader';
import { Text } from '../components/ui';
import { theme } from '../theme';
import { saveSchedules } from '../storage/peptideStorage';
import { MOCK_SCHEDULES } from '../data/mockData';

const SUPPORT_EMAIL = 'toni.henriksson@icloud.com';
const PRIVACY_POLICY_URL = 'https://peptix.app/privacy';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [deletingData, setDeletingData] = useState(false);

  async function handleLoadDemo() {
    Alert.alert(
      'Load Demo Data',
      'This will replace all existing schedules with demo data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Load',
          onPress: async () => {
            setLoadingDemo(true);
            await saveSchedules(MOCK_SCHEDULES);
            setLoadingDemo(false);
            Alert.alert('Done', 'Demo data loaded. Go back and return to refresh.');
          },
        },
      ],
    );
  }

  async function handleDeleteAll() {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your peptide schedules. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingData(true);
            await saveSchedules([]);
            setDeletingData(false);
            Alert.alert('Done', 'All data has been deleted.');
          },
        },
      ],
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.primary} />
      <GlobalHeader />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Legal */}
        <View style={styles.section}>
          <Text variant="label" style={styles.sectionLabel}>LEGAL</Text>
          <Text variant="body" style={styles.disclaimer}>
            Peptix does not provide any recommendations, guidance, or suggestions regarding
            peptide use, dosages, or health outcomes. All decisions related to peptide use
            are made solely by the user at their own discretion and risk. Peptix accepts no
            responsibility for any outcomes resulting from the use of substances tracked
            within the app. Always consult a qualified healthcare professional before using
            any substance.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            activeOpacity={0.6}
          >
            <Text variant="body" style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text variant="label" style={styles.sectionLabel}>SUPPORT</Text>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
            activeOpacity={0.6}
          >
            <Text variant="body" style={styles.actionText}>Contact</Text>
            <Envelope
              size={theme.icons.size.sm}
              color={theme.colors.text.secondary}
              weight={theme.icons.weight}
            />
          </TouchableOpacity>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text variant="label" style={styles.sectionLabel}>DATA</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleLoadDemo}
            disabled={loadingDemo}
            activeOpacity={0.6}
          >
            <Text variant="body" style={styles.actionText}>
              {loadingDemo ? 'Loading...' : 'Load Demo Data'}
            </Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDeleteAll}
            disabled={deletingData}
            activeOpacity={0.6}
          >
            <Text variant="body" style={styles.destructive}>
              {deletingData ? 'Deleting...' : 'Delete All Data'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[6],
    gap: 40,
  },
  section: {
    gap: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '300',
    letterSpacing: 1.5,
    color: theme.colors.text.primary,
    opacity: 0.4,
  },
  disclaimer: {
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '300',
    color: theme.colors.text.secondary,
    opacity: 0.6,
    textDecorationLine: 'underline',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '300',
    color: theme.colors.text.primary,
  },
  destructive: {
    fontSize: 15,
    fontWeight: '300',
    color: '#FF453A',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
});
