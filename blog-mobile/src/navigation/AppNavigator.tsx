import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PostsListScreen } from '../screens/PostsList';
import { CreatePostScreen } from '../screens/CreatePost';
import { PostDetailsScreen } from '../screens/PostDetails';
export type RootStackParamList = {
  PostsList: undefined;
  CreatePost: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PostsList">
        <Stack.Screen name="PostsList" component={PostsListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;