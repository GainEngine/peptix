/**
 * GlobalHeader
 *
 * Appin globaali header — näkyy kaikilla tab-näkymillä.
 * Vasen ikoni: Export → avaa ShareCardModal
 * Oikea ikoni: User → avaa ProfileModal
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Export, User } from 'phosphor-react-native';

import { theme } from '../../theme';
import { Text } from './Text';
import { ProfileModal } from './ProfileModal';
import { ShareCardModal } from './ShareCardModal';
import { usePeptideSchedules } from '../../hooks/usePeptideSchedules';

interface GlobalHeaderProps {
  title?: string;
}

export function GlobalHeader({ title = 'P E P T I X' }: GlobalHeaderProps) {
  const [profileVisible, setProfileVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const { schedules } = usePeptideSchedules();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.side}>
          <TouchableOpacity
            onPress={() => setShareVisible(true)}
            hitSlop={{ top: 12, bottom: 12, left: 4, right: 12 }}
            activeOpacity={0.6}
          >
            <Export
              size={theme.icons.size.md}
              color={theme.colors.text.primary}
              weight={theme.icons.weight}
            />
          </TouchableOpacity>
        </View>

        <Text variant="logotype" align="center" style={styles.logotype}>
          {title}
        </Text>

        <View style={[styles.side, styles.sideRight]}>
          <TouchableOpacity
            onPress={() => setProfileVisible(true)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 4 }}
            activeOpacity={0.6}
          >
            <User
              size={theme.icons.size.md}
              color={theme.colors.text.primary}
              weight={theme.icons.weight}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ShareCardModal
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        schedules={schedules}
      />

      <ProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[2],
    backgroundColor: theme.colors.background.primary,
  },
  side: {
    flex: 1,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  logotype: {
    fontWeight: '400',
  },
});
