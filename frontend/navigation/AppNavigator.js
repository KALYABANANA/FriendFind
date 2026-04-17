import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import SwipeScreen from '../screens/SwipeScreen';
import GroupDiscoveryScreen from '../screens/GroupDiscoveryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SubjectSelectorScreen from '../screens/SubjectSelectorScreen';
import LoaderScreen from '../screens/LoaderScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loader" component={LoaderScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabs() {
  return (
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
  );
}
