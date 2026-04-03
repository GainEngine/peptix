/**
 * Peptix — Entry point
 */

import 'react-native-get-random-values';
import { enableScreens } from 'react-native-screens';
enableScreens();

import { configurePurchases } from './src/services/purchases';
configurePurchases();

import React from 'react';
import { registerRootComponent } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
