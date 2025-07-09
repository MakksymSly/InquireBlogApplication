import React from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper/ScreenWrapper';
import { scale } from '../../utils/scale';
import { useThemeStore } from '../../store/useThemeStore';

export const AboutScreen = () => {
  const { colors } = useThemeStore();
  const themedStyles = createThemedStyles(colors);

  return (
    <ScreenWrapper header="About" withBackIcon>
      <ScrollView style={themedStyles.container}>
        <View style={themedStyles.section}>
          <Text style={themedStyles.sectionTitle}>Features</Text>
          <Text style={themedStyles.featureText}>
            • Dark/Light theme support{'\n'}• Swipe gestures for post actions{'\n'}• Image upload
            with preview{'\n'}• Real-time search functionality{'\n'}• Comments system{'\n'}• Viewed
            posts tracking{'\n'}• Form validation{'\n'}• Responsive design
          </Text>
        </View>

        <View style={themedStyles.section}>
          <Text style={themedStyles.sectionTitle}>Developer</Text>
          <View style={themedStyles.contactItem}>
            <Text style={themedStyles.contactLabel}>NAME:</Text>
            <Text style={themedStyles.contactValue}>Maksym Seliutin</Text>
          </View>
          <View style={themedStyles.contactItem}>
            <Text style={themedStyles.contactLabel}>EMAIL:</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:MaksymSeliutin.dev@gmail.com')}
            >
              <Text style={themedStyles.contactValue}>MaksymSeliutin.dev@gmail.com</Text>
            </TouchableOpacity>
          </View>
          <View style={themedStyles.contactItem}>
            <Text style={themedStyles.contactLabel}>GITHUB:</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/MakksymSly')}>
              <Text style={themedStyles.contactValue}>github.com/MakksymSly</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    section: {
      marginBottom: scale(20),
      padding: scale(16),
      borderRadius: scale(12),
      backgroundColor: colors.cardBackground,
    },
    sectionTitle: {
      fontSize: scale(18),
      fontWeight: '600',
      marginBottom: scale(16),
      color: colors.textPrimary,
    },
    techCategory: {
      fontSize: scale(14),
      fontWeight: '600',
      marginBottom: scale(4),
      color: colors.primary,
    },
    techList: {
      fontSize: scale(14),
      lineHeight: scale(20),
      color: colors.textSecondary,
    },
    featureText: {
      fontSize: scale(14),
      lineHeight: scale(20),
      color: colors.textSecondary,
    },
    developerText: {
      fontSize: scale(16),
      fontWeight: '500',
      textAlign: 'center',
      color: colors.textSecondary,
      marginBottom: scale(8),
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scale(8),
    },
    contactLabel: {
      fontSize: scale(14),
      fontWeight: '600',
      color: colors.textPrimary,
      width: scale(60),
    },
    contactValue: {
      fontSize: scale(14),
      color: colors.primary,
      textDecorationLine: 'underline',
      flex: 1,
    },
    techItem: {
      marginBottom: scale(12),
    },
  });
