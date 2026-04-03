import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

const HERO = require('../../assets/HERO_IMAGE.jpg');
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlobalHeader } from '../components/ui/GlobalHeader';
import { Text } from '../components/ui';
import { PeptideItem } from '../components/ui/PeptideItem';
import { AddPeptideModal } from '../components/ui/AddPeptideModal';
import { usePeptideSchedules } from '../hooks/usePeptideSchedules';
import { theme } from '../theme';
import type { Weekday } from '../types/peptide';

const DAY_INDEX: Weekday[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getTodayKey(): Weekday {
  return DAY_INDEX[new Date().getDay()];
}

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { schedules, addSchedule, deleteSchedule } = usePeptideSchedules();
  const [modalVisible, setModalVisible] = useState(false);

  const todayKey = getTodayKey();
  const todaySchedules = schedules.filter(s => s.days.includes(todayKey));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.primary} />

      <GlobalHeader />

      {/* ── TODAY ─────────────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text variant="label" style={styles.sectionLabel}>
          TODAY
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {todaySchedules.length === 0 ? (
            <ImageBackground source={HERO} style={styles.emptyBg} imageStyle={styles.emptyBgImage}>
              <View style={styles.emptyOverlay} />
              <Text variant="body" style={styles.emptyPlaceholder}>
                Nothing scheduled for today.
              </Text>
            </ImageBackground>
          ) : (
            todaySchedules.map((s, i) => (
              <PeptideItem
                key={s.id}
                schedule={s}
                onDelete={deleteSchedule}
                showDivider={i < todaySchedules.length - 1}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <View style={styles.divider} />

      {/* ── ALL SCHEDULES ─────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="label" style={styles.sectionLabel}>
            ALL SCHEDULES
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 16, right: 4 }}
          >
            <Text variant="label" color={theme.colors.text.primary} style={styles.addInline}>
              + ADD PEPTIDE REMINDER
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {schedules.length === 0 ? (
            <ImageBackground source={HERO} style={styles.emptyBg} imageStyle={styles.emptyBgImage}>
              <View style={styles.emptyOverlay} />
              <Text variant="body" style={styles.emptyPlaceholder}>
                No reminders yet.
              </Text>
              <Text variant="label" style={styles.emptyPlaceholderSub}>
                Add your first peptide above.
              </Text>
            </ImageBackground>
          ) : (
            schedules.map((s, i) => (
              <PeptideItem
                key={s.id}
                schedule={s}
                onDelete={deleteSchedule}
                showDivider={i < schedules.length - 1}
              />
            ))
          )}
        </ScrollView>
      </View>

      <AddPeptideModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addSchedule}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  // Kumpikin osio saa tasan puolet tilasta — otsikko kiinteä, lista scrollaa
  section: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[6],
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },

  sectionLabel: {
    letterSpacing: 1.5,
    opacity: 0.4,
    marginBottom: theme.spacing[2],
    fontSize: 11,
    fontWeight: '300',
    color: theme.colors.text.primary,
  },

  listContent: {
    paddingBottom: theme.spacing[6],
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginHorizontal: theme.spacing[6],
  },

  // Empty state — hero image background with heavy desaturating veil
  emptyBg: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  emptyBgImage: {
    resizeMode: 'cover',
    opacity: 0.22,
  },
  emptyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28,29,32,0.72)',
  },
  emptyPlaceholder: {
    fontWeight: '300',
    opacity: 0.35,
    textAlign: 'center',
  },
  emptyPlaceholderSub: {
    marginTop: theme.spacing[2],
    opacity: 0.2,
    fontWeight: '300',
    textAlign: 'center',
  },

  addInline: {
    letterSpacing: 0.5,
    fontWeight: '300',
  },
});
