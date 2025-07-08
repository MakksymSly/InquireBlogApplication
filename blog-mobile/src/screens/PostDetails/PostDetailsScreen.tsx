import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { scale } from '../../utils/scale';

export const PostDetailsScreen = () => {
  return (
    <ScreenWrapper header="Post Details">
      <Text style={styles.title}>Post Details Screen</Text>
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