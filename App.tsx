import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProgressProvider } from './src/context/ProgressContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style='light' backgroundColor='transparent' translucent />
      <ProgressProvider>
        <AppNavigator />
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
