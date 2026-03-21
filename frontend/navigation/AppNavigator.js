import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import SwipeScreen from '../screens/SwipeScreen';
import GroupDiscoveryScreen from '../screens/GroupDiscoveryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SubjectSelectorScreen from '../screens/SubjectSelectorScreen';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    primary: colors.button,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.button,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          tabBarIcon: ({ color, size }) => {
            const map = {
              Swipe: 'heart-outline',
              Groups: 'people-outline',
              Profile: 'person-outline',
              Subject: 'book-outline',
            };
            const name = map[route.name] || 'ellipse';
            return <Ionicons name={name} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Swipe" component={SwipeScreen} />
        <Tab.Screen name="Groups" component={GroupDiscoveryScreen} options={{ title: 'Discovery' }} />
        <Tab.Screen name="Subject" component={SubjectSelectorScreen} options={{ title: 'Subject' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
