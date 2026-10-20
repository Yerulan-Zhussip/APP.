import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { SafeAreaHeader } from './src/components/SafeAreaHeader';
import { BottomTabBar, TabKey } from './src/components/BottomTabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { PricesScreen } from './src/screens/PricesScreen';
import { TanksScreen } from './src/screens/TanksScreen';
import { NewsScreen } from './src/screens/NewsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { COLORS } from './src/theme/theme';

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
      case 'prices':
        return <PricesScreen />;
      case 'tanks':
        return <TanksScreen />;
      case 'news':
        return <NewsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaHeader onProfilePress={() => setActiveTab('profile')} />
      <View style={styles.screenContainer}>{renderCurrentScreen()}</View>
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  screenContainer: {
    flex: 1,
  },
});
