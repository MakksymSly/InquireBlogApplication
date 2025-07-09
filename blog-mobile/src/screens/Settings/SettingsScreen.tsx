import React from 'react';
import { Text, StyleSheet, View, Switch, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper/ScreenWrapper';
import { scale } from '../../utils/scale';
import { useThemeStore } from '../../store/useThemeStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

export const SettingsScreen = () => {
  const { theme, colors, toggleTheme } = useThemeStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const themedStyles = createThemedStyles(colors);

  return (
    <ScreenWrapper header="Settings">
      <View style={themedStyles.container}>
        <View style={themedStyles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={themedStyles.settingTitle}>Dark mode</Text>
            <Text style={themedStyles.settingDescription}>Switch between light and dark theme</Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={theme === 'dark' ? colors.accent : colors.textSecondary}
          />
        </View>

        <TouchableOpacity
          style={themedStyles.settingItem}
          onPress={() => navigation.navigate('About' as any)}
        >
          <View style={styles.settingContent}>
            <Text style={themedStyles.settingTitle}>About</Text>
            <Text style={themedStyles.settingDescription}>View app information</Text>
          </View>
          <Text style={themedStyles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const createThemedStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: scale(16),
      backgroundColor: colors.background,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: scale(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingTitle: {
      fontSize: scale(16),
      fontWeight: '600',
      marginBottom: scale(4),
      color: colors.textPrimary,
    },
    settingDescription: {
      fontSize: scale(14),
      color: colors.textSecondary,
    },
    arrowText: {
      fontSize: scale(20),
      fontWeight: '300',
      color: colors.textSecondary,
    },
  });

const styles = StyleSheet.create({
  settingContent: {
    flex: 1,
    marginRight: scale(16),
  },
});
