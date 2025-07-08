import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../../components/ScreenWrapper/ScreenWrapper';
import { scale } from '../../../utils/scale';
import { Post } from '../../../types/Post';
import { deletePost } from '../../../api/posts';
import { usePostStore } from '../../../store/usePostStore';

interface Props {
  onPress: () => void;
  post: Post;
}
export const PostCard: React.FC<Props> = props => {
  const { onPress, post } = props;
  const { posts, setPosts } = usePostStore();
  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };
  return (
    <Pressable onPress={onPress}>
      <View style={styles.postCard}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.body}>{post.content}</Text>
        <TouchableOpacity onPress={() => handleDelete(post.id)}>
          <Text style={{ color: 'red' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  postCard: {
    marginBottom: scale(12),
    padding: scale(16),
    backgroundColor: '#f2f2f2',
    borderRadius: scale(8),
    height: scale(100),
  },
  title: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: scale(4),
  },
  body: {
    fontSize: scale(14),
    color: '#333',
  },
});
