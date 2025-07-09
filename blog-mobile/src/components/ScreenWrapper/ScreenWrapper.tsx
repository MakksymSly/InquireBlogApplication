import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from '../../assets';
import { scale } from '../../utils/scale';
import { useThemeStore } from '../../store/useThemeStore';

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
  const { colors } = useThemeStore();
  const themedStyles = createThemedStyles(colors);

  return (
    <SafeAreaView style={themedStyles.container}>
      {!withoutHeader && (
        <View style={themedStyles.headerContainer}>
          {withBackIcon && (
            <Pressable onPress={goBack || navigation.goBack} style={styles.backButton}>
              <ArrowLeftIcon color={colors.textPrimary} />
            </Pressable>
          )}
          {header && <Text style={themedStyles.headerText}>{header}</Text>}
        </View>
      )}

      <View style={[themedStyles.content, style]}>
        {scrollEnable ? (
          <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
        ) : (
          children
        )}
      </View>
    </SafeAreaView>
  );
}

const createThemedStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? scale(50) : 0,
      backgroundColor: colors.background,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: scale(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerText: {
      fontSize: scale(20),
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    content: {
      flex: 1,
      paddingHorizontal: scale(16),
      paddingTop: scale(12),
    },
  });

const styles = StyleSheet.create({
  backButton: {
    marginRight: scale(12),
  },
  backText: {
    fontSize: scale(18),
  },
});
