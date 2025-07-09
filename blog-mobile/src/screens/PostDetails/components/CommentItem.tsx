import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Comment } from '../../../types/Comment';
import { scale } from '../../../utils/scale';
import { UserIcon, DeleteIcon } from '../../../assets/icons';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (id: number) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Just now';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.commentHeader}>
        <View style={styles.authorSection}>
          <View style={styles.avatarContainer}>
            <UserIcon size={scale(24)} color="#666" />
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.author}>{comment.author}</Text>
            <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
          </View>
        </View>
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(comment.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <DeleteIcon size={scale(16)} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: scale(16),
    marginBottom: scale(12),
    borderRadius: scale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(12),
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  authorInfo: {
    flex: 1,
  },
  author: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#333',
    marginBottom: scale(2),
  },
  date: {
    fontSize: scale(12),
    color: '#888',
  },
  commentContent: {
    marginLeft: scale(42), // Отступ под аватаром
  },
  text: {
    fontSize: scale(14),
    color: '#555',
    lineHeight: scale(20),
  },
  deleteButton: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7d7',
  },
});
