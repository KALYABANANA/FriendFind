import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import SwipeScreen from '../screens/SwipeScreen';
import GroupDiscoveryScreen from '../screens/GroupDiscoveryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ClassScreen from '../screens/ClassScreen';
import LoaderScreen from '../screens/LoaderScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import GroupClassScreen from '../screens/GroupClassScreen';
import GroupJoinScreen from '../screens/GroupJoinScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const SubjectStack = createNativeStackNavigator();

function SubjectStackScreen() {
  return (
    <SubjectStack.Navigator screenOptions={{ headerShown: false }}>
      <SubjectStack.Screen name="Class" component={ClassScreen} />
      <SubjectStack.Screen name="GroupClass" component={GroupClassScreen} />
      <SubjectStack.Screen name="GroupJoin" component={GroupJoinScreen} />
    </SubjectStack.Navigator>
  );
}

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
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
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
        <Tab.Screen name="Subject" component={SubjectStackScreen} options={{ title: 'Class' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
}
