import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { theme } from './src/theme';
import { AuthProvider } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';

import { HomeScreen } from './src/screens/HomeScreen';
import { PricesScreen } from './src/screens/PricesScreen';
import { TanksScreen } from './src/screens/TanksScreen';
import { NewsScreen } from './src/screens/NewsScreen';
import { AboutScreen } from './src/screens/AboutScreen';
import { ContactsScreen } from './src/screens/ContactsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DataProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: theme.colors.gold,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'Prices') {
                    iconName = focused ? 'pricetag' : 'pricetag-outline';
                  } else if (route.name === 'Tanks') {
                    iconName = focused ? 'cube' : 'cube-outline';
                  } else if (route.name === 'News') {
                    iconName = focused ? 'newspaper' : 'newspaper-outline';
                  } else if (route.name === 'About') {
                    iconName = focused ? 'information-circle' : 'information-circle-outline';
                  } else if (route.name === 'Contacts') {
                    iconName = focused ? 'call' : 'call-outline';
                  } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                  }

                  return <Ionicons name={iconName} size={size - 2} color={color} />;
                },
              })}
            >
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarLabel: 'Главная' }}
              />
              <Tab.Screen
                name="Prices"
                component={PricesScreen}
                options={{ tabBarLabel: 'Цены' }}
              />
              <Tab.Screen
                name="Tanks"
                component={TanksScreen}
                options={{ tabBarLabel: 'Баки' }}
              />
              <Tab.Screen
                name="News"
                component={NewsScreen}
                options={{ tabBarLabel: 'Новости' }}
              />
              <Tab.Screen
                name="About"
                component={AboutScreen}
                options={{ tabBarLabel: 'О нас' }}
              />
              <Tab.Screen
                name="Contacts"
                component={ContactsScreen}
                options={{ tabBarLabel: 'Контакты' }}
              />
              <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Профиль' }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
