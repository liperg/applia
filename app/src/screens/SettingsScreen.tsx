import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components';
import { colors, spacing, typography } from '../theme';

export function SettingsScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.body}>Settings screen (empty in MVP).</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
