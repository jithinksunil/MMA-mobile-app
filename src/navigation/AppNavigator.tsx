import React from 'react';
import {
  DefaultTheme,
  NavigationContainer,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, StyleSheet } from 'react-native';

import { Colors, Spacing } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PhaseDetailScreen } from '../screens/PhaseDetailScreen';
import { DayDetailScreen } from '../screens/DayDetailScreen';
import { VideoPlayerScreen } from '../screens/VideoPlayerScreen';
import { type BottomTabParamList, type RootStackParamList } from '../types';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 72;
const LOCKED_TAB_NAMES = new Set<keyof BottomTabParamList>(['ExploreTab', 'SettingsTab']);
const navigationTheme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
    border: Colors.border,
    card: Colors.surface,
    primary: Colors.primary,
    text: Colors.textPrimary,
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: TAB_BAR_HEIGHT,
          paddingBottom: Platform.OS === 'ios' ? Spacing.lg : 10,
          paddingTop: Spacing.sm,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarItemStyle: { backgroundColor: 'transparent' },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ExploreTab') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          const isLocked = LOCKED_TAB_NAMES.has(route.name);
          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size} color={color} />
              {isLocked && (
                <View style={styles.lockBadge}>
                  <Ionicons name='lock-closed' size={8} color={Colors.textPrimary} />
                </View>
              )}
            </View>
          );
        },
      })}
      screenListeners={({ route }) => ({
        tabPress: (event) => {
          if (LOCKED_TAB_NAMES.has(route.name)) {
            event.preventDefault();
          }
        },
      })}
    >
      <Tab.Screen name='HomeTab' component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen
        name='ExploreTab'
        component={ExploreScreen}
        options={{ tabBarLabel: 'Explore' }}
      />
      <Tab.Screen
        name='ProfileTab'
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
      <Tab.Screen
        name='SettingsTab'
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    width: 13,
    height: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name='Main' component={MainTabs} />
        <Stack.Screen name='PhaseDetail' component={PhaseDetailScreen} />
        <Stack.Screen name='DayDetail' component={DayDetailScreen} />
        <Stack.Screen
          name='VideoPlayer'
          component={VideoPlayerScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
