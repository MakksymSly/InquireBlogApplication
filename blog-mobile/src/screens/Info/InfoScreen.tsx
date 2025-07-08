import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper/ScreenWrapper';
import { scale } from '../../utils/scale';

export const InfoScreen = () => {
  return (
    <ScreenWrapper header="Info">
      <Text style={styles.text}>This is the info screen</Text>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: scale(16),
  },
});
