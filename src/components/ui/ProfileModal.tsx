import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, EnvelopeSimpleIcon } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text } from './Text';
import { theme } from '../../theme';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const CONTACT_EMAIL = 'hello@peptix.app';

export function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const insets = useSafeAreaInsets();
  const [clearing, setClearing] = useState(false);

  function handleContact() {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`);
  }

  function handleDeleteAll() {
    Alert.alert(
      'Delete All Data',
      'This will permanently remove all your peptide schedules. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            setClearing(true);
            try {
              await AsyncStorage.clear();
            } finally {
              setClearing(false);
              onClose();
            }
          },
        },
      ],
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 32 }]}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text variant="label" style={styles.sheetTitle}>SETTINGS</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <X size={theme.icons.size.md} color={theme.colors.text.secondary} weight={theme.icons.weight} />
            </TouchableOpacity>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimerBox}>
            <Text variant="label" style={styles.disclaimerTitle}>DISCLAIMER</Text>
            <Text variant="body" style={styles.disclaimerText}>
              Peptix is a personal scheduling and tracking tool only. It does not provide medical advice,
              treatment recommendations, or dosage guidance of any kind. All decisions regarding peptide
              use are made solely at your own discretion and risk.{'\n\n'}
              Peptix assumes no responsibility or liability for any consequences arising from the use of
              this application or the substances tracked within it. Always consult a qualified healthcare
              professional before making any decisions related to your health.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.row} onPress={handleContact} activeOpacity={0.6}>
              <View style={styles.rowLeft}>
                <Text variant="body" style={styles.rowLabel}>Contact</Text>
                <EnvelopeSimpleIcon
                  size={theme.icons.size.sm}
                  color='#FFF'
                  weight={theme.icons.weight}
                  style={styles.rowIcon}
                />
              </View>
              <Text variant="body" style={styles.rowValue}>{CONTACT_EMAIL}</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.row}
              onPress={handleDeleteAll}
              activeOpacity={0.6}
              disabled={clearing}
            >
              <Text variant="body" style={styles.deleteLabel}>
                {clearing ? 'Deleting…' : 'Delete All Data'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: theme.colors.background.primary,
    paddingTop: 28,
    paddingHorizontal: theme.spacing[6],
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  sheetTitle: {
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: '300',
    color: theme.colors.text.secondary,
  },

  // Disclaimer
  disclaimerBox: {
    marginBottom: 32,
  },
  disclaimerTitle: {
    letterSpacing: 1.5,
    fontSize: 10,
    fontWeight: '300',
    color: theme.colors.text.secondary,
    marginBottom: 12,
    opacity: 0.5,
  },
  disclaimerText: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 18,
    color: theme.colors.text.secondary,
    opacity: 0.7,
  },

  // Actions
  actions: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.07)',
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '300',
    color: theme.colors.text.primary,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontSize: 12,
    fontWeight: '300',
    color: theme.colors.text.secondary,
    opacity: 0.6,
  },
  rowIcon: {
    opacity: 0.5,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  deleteLabel: {
    fontSize: 14,
    fontWeight: '300',
    color: '#E05252',
  },
});
