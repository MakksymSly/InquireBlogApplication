import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ScreenWrapper } from '../../../../components/ScreenWrapper/ScreenWrapper';
import { scale } from '../../../../utils/scale';

interface Props {
  onPress: () => void;
}
export const PostCard: React.FC<Props> = props => {
  const { onPress } = props;
  return (
    <Pressable onPress={onPress}>
      <View style={styles.postCard}>
        <Text style={styles.title}>Title</Text>
        <Text style={styles.body}>Body</Text>
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
