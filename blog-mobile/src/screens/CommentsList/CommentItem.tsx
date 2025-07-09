import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Comment } from '../../types/Comment';
import { scale } from '../../utils/scale';
import { UserIcon, DeleteIcon } from '../../assets/icons';
import { useThemeStore } from '../../store/useThemeStore';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (id: number) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  const { colors } = useThemeStore();
  const themedStyles = createThemedStyles(colors);

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
    <View style={themedStyles.container}>
      <View style={styles.commentHeader}>
        <View style={styles.authorSection}>
          <View style={themedStyles.avatarContainer}>
            <UserIcon size={scale(24)} color={colors.textPrimary} />
          </View>
          <View style={styles.authorInfo}>
            <Text style={themedStyles.author}>{comment.author}</Text>
            <Text style={themedStyles.date}>{formatDate(comment.createdAt)}</Text>
          </View>
        </View>
        {onDelete && (
          <TouchableOpacity
            style={themedStyles.deleteButton}
            onPress={() => onDelete(comment.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <DeleteIcon size={scale(16)} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.commentContent}>
        <Text style={themedStyles.text}>{comment.text}</Text>
      </View>
    </View>
  );
};

const createThemedStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      padding: scale(16),
      marginBottom: scale(12),
      borderRadius: scale(12),
      shadowColor: colors.textPrimary,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatarContainer: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(16),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: scale(10),
      borderWidth: 1,
      backgroundColor: colors.lightBackground,
      borderColor: colors.border,
    },
    author: {
      fontSize: scale(14),
      fontWeight: '600',
      marginBottom: scale(2),
      color: colors.textPrimary,
    },
    date: {
      fontSize: scale(12),
      color: colors.textSecondary,
    },
    text: {
      fontSize: scale(14),
      lineHeight: scale(20),
      color: colors.textSecondary,
    },
    deleteButton: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      backgroundColor: colors.error + '20',
      borderColor: colors.error + '40',
    },
  });

const styles = StyleSheet.create({
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
  authorInfo: {
    flex: 1,
  },
  commentContent: {
    marginLeft: scale(42),
  },
});
