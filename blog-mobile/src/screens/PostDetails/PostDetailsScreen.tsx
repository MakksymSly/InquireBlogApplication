import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
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
import { UserIcon, AttachmentIcon } from '../../assets/icons';
import Carousel from 'react-native-reanimated-carousel';

import type { RouteProp } from '@react-navigation/native';

type PostDetailsRouteProp = RouteProp<RootStackParamList, 'PostDetails'>;

export const PostDetailsScreen = () => {
  const route = useRoute<PostDetailsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { postId } = route.params;
  const { width: screenWidth } = Dimensions.get('window');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const displayedComments = comments.slice(-2);
  const hasMoreComments = comments.length > 2;

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'Just now';

    const postDate = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return postDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleShowAllComments = () => {
    navigation.navigate('CommentsList', {
      postId,
      postTitle: post.title,
    });
  };

  return (
    <ScreenWrapper header="Post Details" scrollEnable={false} withBackIcon>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <UserIcon size={scale(40)} color="#666" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.authorName}>Anonymous User</Text>
              <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.postContent}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.body}>{post.content}</Text>
        </View>

        <View style={styles.imagesSection}>
          {post.imageUrls && post.imageUrls.length > 0 ? (
            <>
              <View style={styles.carouselContainer}>
                <Carousel
                  loop
                  width={screenWidth - scale(32)}
                  height={scale(250)}
                  autoPlay={false}
                  data={post.imageUrls}
                  scrollAnimationDuration={1000}
                  onSnapToItem={index => setCurrentImageIndex(index)}
                  renderItem={({ item: imageUrl }) => (
                    <View style={styles.carouselItem}>
                      <Image source={{ uri: imageUrl }} style={styles.carouselImage} />
                    </View>
                  )}
                />

                {post.imageUrls.length > 1 && (
                  <View style={styles.counterContainer}>
                    <Text style={styles.counterText}>
                      {currentImageIndex + 1}/{post.imageUrls.length}
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <View style={styles.emptyCarouselContainer}>
                <View style={styles.emptyCarouselContent}>
                  <Text style={styles.emptyCarouselText}>No images attached to this post</Text>
                </View>
              </View>
            </>
          )}
        </View>

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
      </ScrollView>

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
  container: {
    flex: 1,
    padding: scale(16),
  },
  header: {
    marginBottom: scale(20),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  userDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: scale(4),
  },
  postDate: {
    fontSize: scale(14),
    color: '#888',
  },
  postContent: {
    marginBottom: scale(24),
  },

  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    marginBottom: scale(12),
    color: '#1a1a1a',
    lineHeight: scale(32),
  },
  body: {
    fontSize: scale(16),
    lineHeight: scale(24),
    color: '#555',
    marginBottom: scale(16),
  },
  imagesSection: {
    marginBottom: scale(24),
  },
  imagesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  imagesTitle: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#666',
    marginLeft: scale(8),
  },
  carouselContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyCarouselContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: scale(250),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCarouselContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCarouselText: {
    fontSize: scale(16),
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  counterContainer: {
    alignItems: 'center',
    marginTop: scale(20),
    marginBottom: scale(12),
  },
  counterText: {
    fontSize: scale(14),
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: scale(20),
  },
  commentsContainer: {
    marginTop: scale(12),
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
    marginTop: scale(12),
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  showAllButtonText: {
    color: '#007bff',
    fontSize: scale(14),
    fontWeight: '600',
  },
});
