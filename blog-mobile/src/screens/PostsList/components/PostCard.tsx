import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import { scale } from '../../../utils/scale';
import { Post } from '../../../types/Post';
import { Swipeable } from 'react-native-gesture-handler';
import { UserIcon, DeleteIcon, EditIcon, ViewIcon } from '../../../assets/icons';

interface Props {
  onPress: () => void;
  post: Post;
  onDelete: (id: number) => void;
  onEdit: (post: Post) => void;
  hideActions?: boolean;
  isViewed?: boolean;
}

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

export const PostCard: React.FC<Props> = props => {
  const { onPress, post, onDelete, onEdit, hideActions = false, isViewed = false } = props;

  const [rightOpen, setRightOpen] = useState(false);
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    onDelete(post.id);
    swipeableRef.current?.close();
  };

  const handleEdit = () => {
    onEdit(post);
    swipeableRef.current?.close();
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const opacity = progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
      extrapolate: 'clamp',
    });
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [scale(60), 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.actionsContainer}>
        <Animated.View
          style={{ opacity, transform: [{ translateX }], width: scale(60), height: '100%' }}
        >
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <DeleteIcon size={scale(24)} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{ opacity, transform: [{ translateX }], width: scale(60), height: '100%' }}
        >
          <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleEdit}>
            <EditIcon size={scale(24)} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={hideActions ? undefined : renderRightActions}
      overshootRight={false}
      friction={2}
      onSwipeableOpen={() => setRightOpen(true)}
      onSwipeableClose={() => setRightOpen(false)}
      enabled={!hideActions}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.postCard,
          rightOpen && {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <UserIcon size={scale(32)} color="#666" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.authorName}>Anonymous User</Text>
              <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
            </View>
            {isViewed && (
              <View style={styles.viewedIconContainer}>
                <ViewIcon size={scale(20)} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {post.title}
          </Text>
          <Text style={styles.body} numberOfLines={2} ellipsizeMode="tail">
            {post.content}
          </Text>
          {post.imageUrls && post.imageUrls.length > 0 && (
            <View style={styles.imagesContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imagesScrollContent}
              >
                {post.imageUrls.map((imageUrl, index) => (
                  <Image key={index} source={{ uri: imageUrl }} style={styles.postImage} />
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerStats}>
            <Text style={styles.comments}>
              {post.commentsCount || 0} {(post.commentsCount || 0) === 1 ? 'comment' : 'comments'}
            </Text>
            <Text style={styles.attachments}>
              {post.imageUrls?.length || 0}{' '}
              {(post.imageUrls?.length || 0) === 1 ? 'attachment' : 'attachments'}
            </Text>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  postCard: {
    marginBottom: scale(12),
    padding: scale(16),
    backgroundColor: '#ffffff',
    borderRadius: scale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: {
    marginBottom: scale(12),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
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
  viewedIconContainer: {
    marginLeft: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#333',
    marginBottom: scale(2),
  },
  postDate: {
    fontSize: scale(12),
    color: '#888',
  },
  content: {
    marginBottom: scale(12),
  },
  title: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: scale(8),
    color: '#1a1a1a',
  },
  body: {
    fontSize: scale(14),
    color: '#666',
    lineHeight: scale(20),
    marginBottom: scale(8),
  },
  imagesContainer: {
    marginTop: scale(8),
    height: scale(100),
  },
  imagesScrollContent: {
    paddingHorizontal: scale(5),
  },
  postImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(8),
    marginHorizontal: scale(5),
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: scale(12),
  },
  footerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comments: {
    fontSize: scale(12),
    color: '#888',
    fontWeight: '500',
  },
  attachments: {
    fontSize: scale(12),
    color: '#888',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'stretch',
    marginBottom: scale(12),
    paddingBottom: scale(13),
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  editButton: {
    backgroundColor: '#f39c12',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: scale(8),
    borderBottomRightRadius: scale(8),
  },
});
