import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { scale } from '../../utils/scale';

export const PostsListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScreenWrapper header="Posts List">
      <Text style={styles.title}>Posts List Screen</Text>

      <Button title="Go to Create Post" onPress={() => navigation.navigate('CreatePost')} />
      <Button title="Go to Post Details" onPress={() => navigation.navigate('PostDetails')} />
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
    marginBottom: scale(16),
  },
});
