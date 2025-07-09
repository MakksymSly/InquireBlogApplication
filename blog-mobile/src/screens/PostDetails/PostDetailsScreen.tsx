import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper/ScreenWrapper';
import { usePostStore } from '../../store/usePostStore';
import { useCommentStore } from '../../store/useCommentStore';
import { Post } from '../../types/Post';
import { CommentItem, AddCommentModal } from './components';
import { getComments, createComment, deleteComment } from '../../api/comments';
import { scale } from '../../utils/scale';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import type { RouteProp } from '@react-navigation/native';

type PostDetailsRouteProp = RouteProp<RootStackParamList, 'PostDetails'>;

export const PostDetailsScreen = () => {
  const route = useRoute<PostDetailsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { postId } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const post = usePostStore(state => state.posts.find(post => post.id === postId));
  const { comments, setComments, addComment, removeComment } = useCommentStore();
  const { updateCommentsCount } = usePostStore();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);

      updateCommentsCount(postId, fetchedComments.length);
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

  const handleAddComment = async (author: string, text: string) => {
    try {
      setIsSubmitting(true);
      const newComment = await createComment({
        author,
        text,
        postId,
      });

      addComment(newComment);

      updateCommentsCount(postId, comments.length + 1);

      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
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

            updateCommentsCount(postId, comments.length - 1);
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
      <ScreenWrapper header="Post Details">
        <Text style={styles.errorText}>Post not found (ID: {postId})</Text>
      </ScreenWrapper>
    );
  }

  const renderComment = ({ item }: { item: any }) => (
    <CommentItem comment={item} onDelete={handleDeleteComment} />
  );

  const displayedComments = comments.slice(0, 4);
  const hasMoreComments = comments.length > 4;

  const handleShowAllComments = () => {
    navigation.navigate('CommentsList', {
      postId,
      postTitle: post.title,
    });
  };

  return (
    <ScreenWrapper header={post.title} scrollEnable={false} withBackIcon>
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.body}>{post.content}</Text>

        <View style={styles.commentsSection}>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.addButtonText}>Add Comment</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <Text style={styles.loadingText}>Loading comments...</Text>
          ) : comments.length === 0 ? (
            <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
          ) : (
            <View style={styles.commentsContainer}>
              {displayedComments.map(comment => (
                <CommentItem key={comment.id} comment={comment} onDelete={handleDeleteComment} />
              ))}

              {hasMoreComments && (
                <TouchableOpacity style={styles.showAllButton} onPress={handleShowAllComments}>
                  <Text style={styles.showAllButtonText}>Show all {comments.length} comments</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      <AddCommentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddComment}
        isLoading={isSubmitting}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  title: {
    fontSize: scale(20),
    fontWeight: 'bold',
    marginBottom: scale(10),
    color: '#333',
  },
  body: {
    fontSize: scale(16),
    lineHeight: scale(24),
    marginBottom: scale(20),
    color: '#555',
  },
  commentsSection: {
    marginTop: scale(20),
    flex: 1,
  },
  commentsContainer: {
    flex: 1,
    minHeight: scale(200),
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  commentsTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(6),
  },
  addButtonText: {
    color: '#fff',
    fontSize: scale(14),
    fontWeight: '600',
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    paddingBottom: scale(20),
  },
  loadingText: {
    textAlign: 'center',
    fontSize: scale(14),
    color: '#666',
    padding: scale(20),
  },
  emptyText: {
    textAlign: 'center',
    fontSize: scale(14),
    color: '#666',
    padding: scale(20),
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: scale(16),
    color: 'red',
    padding: scale(10),
  },
  showAllButton: {
    backgroundColor: '#f8f9fa',
    padding: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
    marginTop: scale(8),
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  showAllButtonText: {
    color: '#007bff',
    fontSize: scale(14),
    fontWeight: '600',
  },
});
