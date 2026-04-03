/**
 * AnalyticsScreen
 *
 * Per-peptide usage and cost analytics.
 * One card per schedule — start date, dose count, cumulative cost, mini graph.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlobalHeader } from '../components/ui/GlobalHeader';
import { Text } from '../components/ui';
import { PeptideAnalyticsCard } from '../components/ui/PeptideAnalyticsCard';
import { usePeptideSchedules } from '../hooks/usePeptideSchedules';
import { theme } from '../theme';

const HERO = require('../../assets/HERO_IMAGE.jpg');

export function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { schedules } = usePeptideSchedules();

  const isEmpty = schedules.length === 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.primary} />
      <GlobalHeader />

      {/* Section label */}
      <View style={styles.sectionHeader}>
        <Text variant="label" color={theme.colors.text.secondary} style={styles.sectionLabel}>
          Analytics
        </Text>
      </View>

      {isEmpty ? (
        /* ── Empty state ── */
        <View style={styles.emptyWrapper}>
          <View style={styles.emptyContainer}>
            <Image
              source={HERO}
              style={styles.emptyImage}
              resizeMode="cover"
            />
            <View style={styles.emptyOverlay} />
            <Text
              variant="label"
              color={theme.colors.text.secondary}
              style={styles.emptyText}
            >
              No schedules yet
            </Text>
          </View>
        </View>
      ) : (
        /* ── Analytics cards ── */
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + theme.spacing[8] },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {schedules.map(schedule => (
            <PeptideAnalyticsCard key={schedule.id} schedule={schedule} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  sectionHeader: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[2],
  },
  sectionLabel: {
    letterSpacing: 1.5,
    opacity: 0.5,
    textTransform: 'uppercase',
    fontSize: 10,
  },

  // ── Empty state ────────────────────────────────────────────────────────────
  emptyWrapper: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[8],
  },
  emptyContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    ...StyleSheet.absoluteFillObject,
    transform: [{ rotate: '-8deg' }, { scale: 1.3 }],
  },
  emptyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28,29,32,0.82)',
  },
  emptyText: {
    letterSpacing: 2,
    opacity: 0.45,
    fontSize: 11,
    textTransform: 'uppercase',
  },

  // ── Cards ──────────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[2],
  },
});
