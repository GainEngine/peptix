import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalHeader } from '../components/ui/GlobalHeader';
import { Text } from '../components/ui';
import { theme } from '../theme';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.primary} />
      <GlobalHeader />
      <View style={styles.content}>
        <Text variant="body" color={theme.colors.text.secondary}>
          Profile
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
