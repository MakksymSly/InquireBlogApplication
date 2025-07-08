import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { scale } from '../../utils/scale';

export const CreatePostScreen = () => {
  const x: number = 'not a number';
  return (
    <ScreenWrapper header="Create Post" withBackIcon>
      <Text style={styles.title}>Create Post Screen</Text>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
    justifyContent: 'center',
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
  },
});
