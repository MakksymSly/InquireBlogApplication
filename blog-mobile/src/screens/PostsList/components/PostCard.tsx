import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Animated } from 'react-native';
import { scale } from '../../../utils/scale';
import { Post } from '../../../types/Post';
import { Swipeable } from 'react-native-gesture-handler';

interface Props {
  onPress: () => void;
  post: Post;
  onDelete: (id: number) => void;
  onEdit: (post: Post) => void;
  hideActions?: boolean;
}
export const PostCard: React.FC<Props> = props => {
  const { onPress, post, onDelete, onEdit, hideActions = false } = props;

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
      outputRange: [scale(70), 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.actionsContainer}>
        <Animated.View
          style={{ opacity, transform: [{ translateX }], width: scale(70), height: scale(100) }}
        >
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: 'red',
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                width: '100%',
                height: '100%',
              },
            ]}
            onPress={handleDelete}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{ opacity, transform: [{ translateX }], width: scale(70), height: scale(100) }}
        >
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: 'orange',
                borderTopRightRadius: scale(8),
                borderBottomRightRadius: scale(8),
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                width: '100%',
                height: '100%',
              },
            ]}
            onPress={handleEdit}
          >
            <Text style={styles.actionText}>Edit</Text>
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
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.body}>{post.content}</Text>
      </Pressable>
    </Swipeable>
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
  actionsContainer: {
    flexDirection: 'row',
    height: scale(100),
    alignItems: 'center',
    marginBottom: scale(12),
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(100),
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: scale(16),
  },
});
