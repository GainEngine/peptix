/**
 * PeptidePicker
 *
 * Koko ruudun overlay — renders as absoluteFill inside AddPeptideModal.
 * iOS blocks nested Modals silently, so we use absolute positioning instead.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MagnifyingGlass } from 'phosphor-react-native';

import { Text } from './Text';
import { PEPTIDE_CATALOG, PeptideCatalogItem } from '../../data/peptideCatalog';
import { theme } from '../../theme';

interface PeptidePickerProps {
  visible: boolean;
  onSelect: (item: PeptideCatalogItem) => void;
  onSelectCustom: (name: string) => void;
  onClose: () => void;
}

export function PeptidePicker({ visible, onSelect, onSelectCustom, onClose }: PeptidePickerProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const trimmedQuery = query.trim();

  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return PEPTIDE_CATALOG;
    return PEPTIDE_CATALOG.filter(p => p.name.toLowerCase().includes(q));
  }, [trimmedQuery]);

  const showCustomRow = trimmedQuery.length > 0 &&
    !PEPTIDE_CATALOG.some(p => p.name.toLowerCase() === trimmedQuery.toLowerCase());

  function handleSelect(item: PeptideCatalogItem) {
    Keyboard.dismiss();
    setQuery('');
    onSelect(item);
  }

  function handleCustomSelect() {
    Keyboard.dismiss();
    const name = trimmedQuery;
    setQuery('');
    onSelectCustom(name);
  }

  function handleClose() {
    Keyboard.dismiss();
    setQuery('');
    onClose();
  }

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text variant="label" color={theme.colors.text.secondary} style={styles.cancelBtn}>
            Cancel
          </Text>
        </TouchableOpacity>
        <Text variant="label" style={styles.headerTitle}>
          SELECT PEPTIDE
        </Text>
        {/* Placeholder oikealle jotta otsikko pysyy keskellä */}
        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <MagnifyingGlass
          size={theme.icons.size.sm}
          color={theme.colors.text.secondary}
          weight={theme.icons.weight}
        />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search..."
          placeholderTextColor="rgba(255,255,255,0.18)"
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {showCustomRow && (
        <>
          <TouchableOpacity
            style={styles.row}
            onPress={handleCustomSelect}
            activeOpacity={0.6}
          >
            <Text variant="body" style={styles.rowName}>
              {trimmedQuery}
            </Text>
            <Text variant="label" style={styles.customTag}>
              custom
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
        </>
      )}

      <FlatList
        data={filtered}
        keyExtractor={item => item.name}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => handleSelect(item)}
            activeOpacity={0.6}
          >
            <Text variant="body" style={styles.rowName}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: {
    letterSpacing: 3,
    opacity: 0.5,
  },
  cancelBtn: {
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 40,
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '300',
    paddingVertical: theme.spacing[1],
  },

  // List
  listContent: {},
  row: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowName: {
    fontWeight: '300',
  },
  customTag: {
    fontSize: 10,
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
    opacity: 0.45,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});
