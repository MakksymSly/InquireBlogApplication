import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper/ScreenWrapper';
import { usePostStore } from '../../store/usePostStore';
import { useCommentStore } from '../../store/useCommentStore';
import { CommentItem } from './CommentItem';
import { getComments, deleteComment } from '../../api/comments';
import { scale } from '../../utils/scale';
import { useThemeStore } from '../../store/useThemeStore';

import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type CommentsListRouteProp = RouteProp<RootStackParamList, 'CommentsList'>;

export const CommentsListScreen = () => {
  const route = useRoute<CommentsListRouteProp>();
  const { postId, postTitle } = route.params;
  const { colors } = useThemeStore();
  const themedStyles = createThemedStyles(colors);

  const [isLoading, setIsLoading] = useState(false);

  const post = usePostStore(state => state.posts.find(post => post.id === postId));
  const { comments, setComments, removeComment } = useCommentStore();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      if (error instanceof Error) {
        Alert.alert('Error', `Failed to load comments: ${error.message}`);
      } else {
        Alert.alert('Error', 'Failed to load comments');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteComment(commentId);
            removeComment(commentId);
            Alert.alert('Success', 'Comment deleted successfully!');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete comment');
            console.error('Error deleting comment:', error);
          }
        },
      },
    ]);
  };

  if (!post) {
    return (
      <ScreenWrapper header="Comments">
        <Text style={themedStyles.errorText}>Post not found</Text>
      </ScreenWrapper>
    );
  }

  const renderComment = ({ item }: { item: any }) => (
    <CommentItem comment={item} onDelete={handleDeleteComment} />
  );

  return (
    <ScreenWrapper header={`Comments (${comments.length})`} withBackIcon>
      <View style={themedStyles.container}>
        {isLoading ? (
          <Text style={themedStyles.loadingText}>Loading comments...</Text>
        ) : comments.length === 0 ? (
          <Text style={themedStyles.emptyText}>No comments yet.</Text>
        ) : (
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.commentsListContent}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

const createThemedStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    postTitle: {
      fontSize: scale(18),
      fontWeight: 'bold',
      marginBottom: scale(20),
      paddingHorizontal: scale(16),
      paddingTop: scale(8),
      lineHeight: scale(24),
      color: colors.textPrimary,
    },
    loadingText: {
      textAlign: 'center',
      fontSize: scale(14),
      padding: scale(20),
      color: colors.textSecondary,
    },
    emptyText: {
      textAlign: 'center',
      fontSize: scale(14),
      padding: scale(20),
      fontStyle: 'italic',
      color: colors.textSecondary,
    },
    errorText: {
      fontSize: scale(16),
      padding: scale(10),
      color: colors.error,
    },
  });

const styles = StyleSheet.create({
  commentsListContent: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(20),
  },
});
