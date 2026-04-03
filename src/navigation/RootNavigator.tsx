import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GetStartedScreen } from '../screens/GetStartedScreen';
import { DisclaimerScreen } from '../screens/DisclaimerScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { useSubscription } from '../hooks/useSubscription';
import { theme } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={theme.colors.text.secondary} />
    </View>
  );
}

export function RootNavigator() {
  const { loading, isSubscribed } = useSubscription();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isSubscribed ? 'Main' : 'GetStarted'}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="Disclaimer" component={DisclaimerScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
