import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash } from 'phosphor-react-native';
import { Text } from './Text';
import { theme } from '../../theme';
import type { PeptideSchedule } from '../../types/peptide';
import { formatTimeLocale } from '../../utils/time';

interface Props {
  schedule: PeptideSchedule;
  onDelete: (id: string) => void;
  showDivider: boolean;
}

export function PeptideItem({ schedule, onDelete, showDivider }: Props) {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.left}>
          <Text variant="body" style={styles.name}>
            {schedule.name}
          </Text>
          <View style={styles.metaRow}>
            <Text variant="label" color={theme.colors.text.secondary} style={styles.days}>
              {schedule.days.join('  ')}
            </Text>
            <Text variant="label" color={theme.colors.text.secondary} style={styles.dot}>·</Text>
            <Text variant="label" color={theme.colors.text.primary} style={styles.time}>
              {formatTimeLocale(schedule.hour, schedule.minute)}
            </Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text variant="body" style={styles.dosage}>
            {schedule.dosage} {schedule.dosageUnit}
          </Text>
          <TouchableOpacity
            onPress={() => onDelete(schedule.id)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.deleteBtn}
          >
            <Trash
              size={theme.icons.size.sm}
              color={theme.colors.text.secondary}
              weight={theme.icons.weight}
            />
          </TouchableOpacity>
        </View>
      </View>

      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[4],
  },
  left: {
    flex: 1,
    gap: 4,
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
  name: {
    fontWeight: '300',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  days: {
    letterSpacing: 0.5,
    opacity: 0.5,
  },
  dot: {
    opacity: 0.3,
  },
  time: {
    letterSpacing: 0.5,
    fontWeight: '300',
  },
  dosage: {
    fontWeight: '200',
  },
  deleteBtn: {
    opacity: 0.5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
});
