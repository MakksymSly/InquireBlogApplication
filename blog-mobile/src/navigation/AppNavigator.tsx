import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PostListScreen } from '../screens/PostsList';
import { PostDetailsScreen } from '../screens/PostDetails';
import { InfoScreen } from '../screens/Info';
import { ListIcon, InfoIcon } from '../assets/icons';

export type RootStackParamList = {
  Tabs: undefined;
  PostDetails: { postId: number };
  CreatePost: undefined;
};

export type TabParamList = {
  Posts: undefined;
  Info: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const Tabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Posts"
        component={PostListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ListIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          tabBarIcon: ({ color, size }) => <InfoIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
