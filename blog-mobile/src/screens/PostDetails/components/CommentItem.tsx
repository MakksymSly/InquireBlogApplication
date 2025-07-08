import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Comment } from '../../../types/Comment';
import { scale } from '../../../utils/scale';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (id: number) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.author}>{comment.author}</Text>
        <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
      </View>
      <Text style={styles.text}>{comment.text}</Text>
      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(comment.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: scale(12),
    marginBottom: scale(8),
    borderRadius: scale(8),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  author: {
    fontSize: scale(14),
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: scale(12),
    color: '#666',
  },
  text: {
    fontSize: scale(14),
    color: '#333',
    lineHeight: scale(20),
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: scale(8),
  },
  deleteText: {
    color: '#dc3545',
    fontSize: scale(12),
    fontWeight: '500',
  },
});
