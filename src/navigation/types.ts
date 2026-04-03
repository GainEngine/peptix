import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// ─── Root Stack ───────────────────────────────────────────────────────────────
export type RootStackParamList = {
  GetStarted: undefined;
  Disclaimer: undefined;
  Paywall: undefined;
  Main: undefined;
};

// ─── Main Tabs ────────────────────────────────────────────────────────────────
export type MainTabParamList = {
  Dashboard: undefined;
  Analytics: undefined;
};

// ─── Navigation props ─────────────────────────────────────────────────────────
export type GetStartedNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GetStarted'>;
export type DashboardNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Dashboard'>;
