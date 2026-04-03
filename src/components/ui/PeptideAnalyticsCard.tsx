/**
 * PeptideAnalyticsCard
 *
 * Per-peptide analytics card for the Analytics screen.
 * Shows: name, start date, usage count, total cost, mini cost graph.
 * Minimalist dark style — no borders, thin typography, subtle divider at bottom.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

import { Text } from './Text';
import { MiniCostChart } from '../charts/MiniCostChart';
import type { PeptideSchedule } from '../../types/peptide';
import {
  calculateUsageCount,
  calculateTotalCost,
  generateCostHistory,
  formatStartDate,
} from '../../utils/analytics';
import { findCatalogItem } from '../../data/peptideCatalog';
import { theme } from '../../theme';
import { formatTimeLocale } from '../../utils/time';

interface PeptideAnalyticsCardProps {
  schedule: PeptideSchedule;
}

export function PeptideAnalyticsCard({ schedule }: PeptideAnalyticsCardProps) {
  const { width } = useWindowDimensions();
  // Account for screen padding (24) on each side
  const cardWidth = width - theme.spacing[6] * 2;

  const usageCount = useMemo(() => calculateUsageCount(schedule), [schedule]);
  const totalCost  = useMemo(() => calculateTotalCost(schedule, usageCount), [schedule, usageCount]);
  const history    = useMemo(() => generateCostHistory(schedule), [schedule]);

  const hasCatalogPrice = !!findCatalogItem(schedule.name);
  const totalLabel = hasCatalogPrice
    ? `$${totalCost.toFixed(2)}`
    : null;

  const daysLabel = schedule.days.join('  ');
  const timeLabel = formatTimeLocale(schedule.hour, schedule.minute);
  const startLabel = formatStartDate(schedule.createdAt);

  return (
    <View style={styles.card}>
      {/* Top row: name + total cost */}
      <View style={styles.topRow}>
        <Text variant="body" style={styles.name}>
          {schedule.name}
        </Text>
        {totalLabel && (
          <Text variant="label" color={theme.colors.text.secondary} style={styles.cost}>
            {totalLabel}
          </Text>
        )}
      </View>

      {/* Meta row: started · uses · schedule */}
      <Text variant="label" color={theme.colors.text.secondary} style={styles.meta}>
        {startLabel}{'  ·  '}{usageCount} {usageCount === 1 ? 'dose' : 'doses'}{'  ·  '}{daysLabel}{'  ·  '}{timeLabel}
      </Text>

      {/* Dosage */}
      <Text variant="label" color={theme.colors.text.secondary} style={styles.dosage}>
        {schedule.dosage} {schedule.dosageUnit} per dose
      </Text>

      {/* Mini cost graph */}
      <View style={styles.chartWrapper}>
        <MiniCostChart
          width={cardWidth}
          height={80}
          data={history}
          totalLabel={totalLabel ?? ''}
        />
      </View>

      {/* Divider */}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingTop: theme.spacing[6],
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing[2],
  },
  name: {
    fontWeight: '300',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  cost: {
    fontWeight: '300',
    fontSize: 13,
    opacity: 0.7,
  },

  meta: {
    opacity: 0.45,
    fontSize: 11,
    letterSpacing: 0.3,
    marginBottom: theme.spacing[1],
  },
  dosage: {
    opacity: 0.35,
    fontSize: 10,
    letterSpacing: 0.3,
    marginBottom: theme.spacing[2],
  },

  chartWrapper: {
    marginTop: theme.spacing[2],
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginTop: theme.spacing[4],
  },
});
