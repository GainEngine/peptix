/**
 * MainTabNavigator
 *
 * Kaksi tabbia — Dashboard ja Analytics — 50/50 custom tab barilla.
 * Pystysuuntainen divider välissä. Ei labeleita, pelkat Phosphor light -ikonit.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, ChartLine } from 'phosphor-react-native';

import { DashboardScreen } from '../screens/DashboardScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { theme } from '../theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICON_COLOR_ACTIVE   = theme.colors.text.primary;
const ICON_COLOR_INACTIVE = 'rgba(255,255,255,0.25)';

const ICONS: Record<string, (color: string) => React.ReactNode> = {
  Dashboard: color => (
    <House size={theme.icons.size.md} color={color} weight={theme.icons.weight} />
  ),
  Analytics: color => (
    <ChartLine size={theme.icons.size.md} color={color} weight={theme.icons.weight} />
  ),
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 8 }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const color = focused ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE;
        const isFirst = index === 0;

        function onPress() {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }

        return (
          <React.Fragment key={route.key}>
            {!isFirst && <View style={styles.divider} />}
            <TouchableOpacity
              style={styles.tab}
              onPress={onPress}
              activeOpacity={0.7}
            >
              {ICONS[route.name]?.(color)}
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary,
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginVertical: 10,
  },
});
