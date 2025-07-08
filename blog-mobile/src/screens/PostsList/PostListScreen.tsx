import React, { useEffect } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { usePostStore } from '../../store/usePostStore';
import { ScreenWrapper } from '../../components/ScreenWrapper/ScreenWrapper';
import { scale } from '../../utils/scale';
import { PostCard } from './components';
import { Post } from '../../types/Post';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

export const PostListScreen = () => {
  const { posts, setPosts } = usePostStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    // тимчасово фейкові пости
    const mockPosts = [
      { id: 1, title: 'First Post', body: 'Hello from first post' },
      { id: 2, title: 'Second Post', body: 'Welcome to second post' },
    ];

    setPosts(mockPosts);
  }, []);

  const onPostPress = (item: Post) => {
    navigation.navigate('PostDetails', { postId: item.id });
  };
  return (
    <ScreenWrapper header="Posts" scrollEnable={false}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <PostCard onPress={() => onPostPress(item)} />}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({});
