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
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper/ScreenWrapper';
import { usePostStore } from '../../store/usePostStore';
import { useCommentStore } from '../../store/useCommentStore';
import { Post } from '../../types/Post';
import { CommentItem } from '../CommentsList/CommentItem';
import { AddCommentModal } from './components';
import { getComments, createComment, deleteComment } from '../../api/comments';
import { scale } from '../../utils/scale';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { UserIcon, AttachmentIcon } from '../../assets/icons';
import Carousel from 'react-native-reanimated-carousel';
import { useThemeStore } from '../../store/useThemeStore';

import type { RouteProp } from '@react-navigation/native';

type PostDetailsRouteProp = RouteProp<RootStackParamList, 'PostDetails'>;

export const PostDetailsScreen = () => {
  const route = useRoute<PostDetailsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { postId } = route.params;
  const { width: screenWidth } = Dimensions.get('window');
  const { colors } = useThemeStore();
  const themedStyles = createThemedStyles(colors);

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
        <Text style={themedStyles.errorText}>Post not found (ID: {postId})</Text>
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
      <ScrollView style={themedStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={themedStyles.avatarContainer}>
              <UserIcon size={scale(40)} color={colors.textPrimary} />
            </View>
            <View style={styles.userDetails}>
              <Text style={themedStyles.authorName}>Anonymous User</Text>
              <Text style={themedStyles.postDate}>{formatDate(post.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.postContent}>
          <Text style={themedStyles.title}>{post.title}</Text>
          <Text style={themedStyles.body}>{post.content}</Text>
        </View>

        <View style={styles.imagesSection}>
          {post.imageUrls && post.imageUrls.length > 0 ? (
            <>
              <View style={themedStyles.carouselContainer}>
                <Carousel
                  width={screenWidth - scale(32)}
                  height={scale(250)}
                  loop
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
                    <Text style={themedStyles.counterText}>
                      {currentImageIndex + 1}/{post.imageUrls.length}
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <View style={themedStyles.emptyCarouselContainer}>
                <View style={styles.emptyCarouselContent}>
                  <Text style={themedStyles.emptyCarouselText}>
                    No images attached to this post
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={themedStyles.commentsSection}>
          <View style={styles.commentsHeader}>
            <Text style={themedStyles.commentsTitle}>Comments ({comments.length})</Text>
            <TouchableOpacity
              style={themedStyles.addButton}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={themedStyles.addButtonText}>Add Comment</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <Text style={themedStyles.loadingText}>Loading comments...</Text>
          ) : comments.length === 0 ? (
            <Text style={themedStyles.emptyText}>No comments yet. Be the first to comment!</Text>
          ) : (
            <View style={styles.commentsContainer}>
              {displayedComments.map(comment => (
                <CommentItem key={comment.id} comment={comment} onDelete={handleDeleteComment} />
              ))}

              {hasMoreComments && (
                <TouchableOpacity
                  style={themedStyles.showAllButton}
                  onPress={handleShowAllComments}
                >
                  <Text style={themedStyles.showAllButtonText}>
                    Show all {comments.length} comments
                  </Text>
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

const createThemedStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: scale(16),
      backgroundColor: colors.background,
    },
    avatarContainer: {
      width: scale(48),
      height: scale(48),
      borderRadius: scale(24),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: scale(12),
      borderWidth: 1,
      backgroundColor: colors.lightBackground,
      borderColor: colors.border,
    },
    authorName: {
      fontSize: scale(16),
      fontWeight: '600',
      marginBottom: scale(4),
      color: colors.textPrimary,
    },
    postDate: {
      fontSize: scale(14),
      color: colors.textSecondary,
    },
    title: {
      fontSize: scale(24),
      fontWeight: 'bold',
      marginBottom: scale(12),
      lineHeight: scale(32),
      color: colors.textPrimary,
    },
    body: {
      fontSize: scale(16),
      lineHeight: scale(24),
      marginBottom: scale(16),
      color: colors.textSecondary,
    },
    carouselContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: scale(16),
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.textPrimary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    emptyCarouselContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: scale(16),
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.textPrimary,
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
    emptyCarouselText: {
      fontSize: scale(16),
      textAlign: 'center',
      fontStyle: 'italic',
      color: colors.textSecondary,
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
      borderTopColor: colors.border,
      paddingTop: scale(20),
    },
    commentsTitle: {
      fontSize: scale(18),
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: scale(16),
      paddingVertical: scale(8),
      borderRadius: scale(6),
    },
    addButtonText: {
      color: colors.buttonText,
      fontSize: scale(14),
      fontWeight: '600',
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
    showAllButton: {
      backgroundColor: colors.lightBackground,
      padding: scale(12),
      borderRadius: scale(8),
      alignItems: 'center',
      marginTop: scale(12),
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: Platform.OS === 'android' ? scale(100) : 0,
    },
    showAllButtonText: {
      color: colors.primary,
      fontSize: scale(14),
      fontWeight: '600',
    },
  });

const styles = StyleSheet.create({
  header: {
    marginBottom: scale(20),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  postContent: {
    marginBottom: scale(24),
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
    marginLeft: scale(8),
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
  emptyCarouselContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterContainer: {
    alignItems: 'center',
    marginTop: scale(20),
    marginBottom: scale(12),
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
});
