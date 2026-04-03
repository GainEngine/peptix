/**
 * ShareCard
 *
 * 9:16 story-formaatin jakamiskortti. ViewShot kaappaa tämän kuvaksi.
 */

import React from 'react';
import { View, Text as RNText, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import type { PeptideSchedule, Weekday } from '../../types/peptide';

const ALL_DAYS: Weekday[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const DAY_LABELS: Record<Weekday, string> = {
  Mo: 'MON', Tu: 'TUE', We: 'WED', Th: 'THU', Fr: 'FRI', Sa: 'SAT', Su: 'SUN',
};

function formatDays(days: Weekday[]): string {
  if (days.length === 7) return 'DAILY';
  const ordered = ALL_DAYS.filter(d => days.includes(d));
  return ordered.map(d => DAY_LABELS[d]).join('  ');
}

interface ShareCardProps {
  schedules: PeptideSchedule[];
  width: number;
}

export function ShareCard({ schedules, width }: ShareCardProps) {
  const height = Math.round(width * (16 / 9));

  return (
    <View collapsable={false} style={[styles.card, { width, height }]}>
      {/* Brand */}
      <RNText style={styles.brandText}>P E P T I X</RNText>

      {/* Divider */}
      <View style={styles.dividerLine} />

      {/* Title */}
      <RNText style={styles.titleText}>MY STACK</RNText>

      {/* Peptide list */}
      <View style={styles.list}>
        {schedules.map(s => (
          <View key={s.id} style={styles.row}>
            <View style={styles.rowLeft}>
              <RNText style={styles.peptideName}>{s.name}</RNText>
              <RNText style={styles.peptideDose}>{s.dosage} {s.dosageUnit}</RNText>
            </View>
            <RNText style={styles.peptideDays}>{formatDays(s.days)}</RNText>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <RNText style={styles.footerText}>Track smarter. Stack better.</RNText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1B1E',
    paddingHorizontal: 32,
    paddingTop: 52,
    paddingBottom: 48,
  },

  brandText: {
    fontSize: 11,
    fontWeight: '300',
    color: 'rgba(245,245,245,0.30)',
    letterSpacing: 7,
    marginBottom: 20,
    fontFamily: undefined,
  },

  dividerLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 28,
  },

  titleText: {
    fontSize: 28,
    fontWeight: '200',
    color: '#F5F5F5',
    letterSpacing: 5,
    marginBottom: 40,
  },

  list: {
    flex: 1,
    gap: 24,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rowLeft: {
    flex: 1,
    marginRight: 16,
  },
  peptideName: {
    fontSize: 14,
    fontWeight: '300',
    color: '#F5F5F5',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  peptideDose: {
    fontSize: 11,
    fontWeight: '300',
    color: 'rgba(245,245,245,0.38)',
    letterSpacing: 0.5,
  },
  peptideDays: {
    fontSize: 10,
    fontWeight: '300',
    color: 'rgba(245,245,245,0.28)',
    letterSpacing: 1,
    textAlign: 'right',
    marginTop: 2,
  },

  footer: {
    marginTop: 40,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '300',
    color: 'rgba(245,245,245,0.22)',
    letterSpacing: 1.5,
  },
});
