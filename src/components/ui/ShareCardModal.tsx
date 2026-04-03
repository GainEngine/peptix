import React, { useRef, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, DownloadSimple, ShareNetwork } from 'phosphor-react-native';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import { Text } from './Text';
import { ShareCard } from './ShareCard';
import { theme } from '../../theme';
import type { PeptideSchedule } from '../../types/peptide';

interface ShareCardModalProps {
  visible: boolean;
  onClose: () => void;
  schedules: PeptideSchedule[];
}

export function ShareCardModal({ visible, onClose, schedules }: ShareCardModalProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const viewShotRef = useRef<ViewShot>(null);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  const CARD_WIDTH = screenWidth - 80;

  async function capture(): Promise<string> {
    if (!viewShotRef.current) throw new Error('Card not ready');
    return await viewShotRef.current.capture!();
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Allow Peptix to save photos to continue.');
        return;
      }
      const uri = await capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Saved', 'Your stack card has been saved to your photo library.');
    } catch (e) {
      Alert.alert('Error', 'Could not save the card. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleShare() {
    setSharing(true);
    try {
      const uri = await capture();
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Not available', 'Sharing is not supported on this device.');
        return;
      }
      await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png' });
    } catch (e) {
      Alert.alert('Error', 'Could not share the card. Please try again.');
    } finally {
      setSharing(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

        {/* Header */}
        <View style={styles.header}>
          <Text variant="label" style={styles.headerTitle}>MY STACK CARD</Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <X size={theme.icons.size.md} color={theme.colors.text.secondary} weight={theme.icons.weight} />
          </TouchableOpacity>
        </View>

        {/* Card preview */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {schedules.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="body" style={styles.emptyText}>
                Add peptide schedules first to generate your stack card.
              </Text>
            </View>
          ) : (
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png', quality: 1, result: 'tmpfile' }}
            >
              <ShareCard schedules={schedules} width={CARD_WIDTH} />
            </ViewShot>
          )}
        </ScrollView>

        {/* Actions */}
        {schedules.length > 0 && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleSave}
              disabled={saving || sharing}
              activeOpacity={0.6}
            >
              {saving
                ? <ActivityIndicator size="small" color={theme.colors.text.primary} />
                : <DownloadSimple size={theme.icons.size.md} color={theme.colors.text.primary} weight={theme.icons.weight} />
              }
              <Text variant="label" style={styles.actionLabel}>SAVE TO GALLERY</Text>
            </TouchableOpacity>

            <View style={styles.actionDivider} />

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleShare}
              disabled={saving || sharing}
              activeOpacity={0.6}
            >
              {sharing
                ? <ActivityIndicator size="small" color={theme.colors.text.primary} />
                : <ShareNetwork size={theme.icons.size.md} color={theme.colors.text.primary} weight={theme.icons.weight} />
              }
              <Text variant="label" style={styles.actionLabel}>SHARE</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing[6],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  headerTitle: {
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: '300',
    color: theme.colors.text.secondary,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  emptyState: {
    paddingTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.4,
    fontWeight: '300',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.07)',
    paddingTop: 16,
    paddingBottom: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  actionDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginVertical: 10,
  },
  actionLabel: {
    letterSpacing: 1.5,
    fontSize: 11,
    fontWeight: '300',
    color: theme.colors.text.primary,
  },
});
