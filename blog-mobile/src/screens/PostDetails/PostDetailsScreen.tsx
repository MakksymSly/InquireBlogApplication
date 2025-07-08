import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper/ScreenWrapper';
import { usePostStore } from '../../store/usePostStore';
import { scale } from '../../utils/scale';

import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type PostDetailsRouteProp = RouteProp<RootStackParamList, 'PostDetails'>;

export const PostDetailsScreen = () => {
  const route = useRoute<PostDetailsRouteProp>();
  const { postId } = route.params;

  const post = usePostStore(state => state.posts.find(post => post.id === postId));

  if (!post) {
    return (
      <ScreenWrapper header="Post Details">
        <Text style={styles.errorText}>Post not found</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper header={post.title} scrollEnable withBackIcon>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.body}>{post.body}</Text>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: scale(20),
    fontWeight: 'bold',
    marginBottom: scale(10),
  },
  body: {
    fontSize: scale(16),
  },
  errorText: {
    fontSize: scale(16),
    color: 'red',
    padding: scale(10),
  },
});
