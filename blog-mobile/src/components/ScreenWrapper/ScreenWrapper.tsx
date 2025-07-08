import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
  ScrollView,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from '../../assets';
import { scale } from '../../utils/scale';

interface IScreenWrapperProps extends SafeAreaViewProps {
  children?: React.ReactNode;
  goBack?: () => void;
  style?: ViewStyle;
  scrollEnable?: boolean;
  header?: string;
  withBackIcon?: boolean;
  withoutHeader?: boolean;
}

export function ScreenWrapper({
  children,
  goBack,
  style,
  scrollEnable,
  header,
  withBackIcon,
  withoutHeader,
}: IScreenWrapperProps) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {!withoutHeader && (
        <View style={styles.headerContainer}>
          {withBackIcon && (
            <Pressable
              onPress={goBack || navigation.goBack}
              style={styles.backButton}
            >
              <ArrowLeftIcon color="black" /> 
            </Pressable>
          )}
          {header && <Text style={styles.headerText}>{header}</Text>}
        </View>
      )}

      <View style={[styles.content, style]}>
        {scrollEnable ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: scale(12),
  },
  backText: {
    fontSize: scale(18),
  },
  headerText: {
    fontSize: scale(20),
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
  },
});
