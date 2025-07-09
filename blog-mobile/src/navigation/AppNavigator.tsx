import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PostListScreen } from '../screens/PostsList';
import { PostDetailsScreen } from '../screens/PostDetails';
import { CommentsListScreen } from '../screens/CommentsList/CommentsListScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { AboutScreen } from '../screens/About';
import { ListIcon, InfoIcon } from '../assets/icons';
import { useThemeStore } from '../store/useThemeStore';

export type RootStackParamList = {
  Tabs: undefined;
  PostDetails: { postId: number };
  CommentsList: { postId: number; postTitle: string };
  CreatePost: undefined;
  About: undefined;
};

export type TabParamList = {
  Posts: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const Tabs = () => {
  const { colors } = useThemeStore();
  const themedStyles = createThemedTabStyles(colors);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: themedStyles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: themedStyles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Posts"
        component={PostListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ListIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <InfoIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const createThemedTabStyles = (colors: any) => ({
  tabBar: {
    backgroundColor: colors.cardBackground,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
});

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
        <Stack.Screen name="CommentsList" component={CommentsListScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
