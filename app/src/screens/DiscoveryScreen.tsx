import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components';
import { colors, spacing, typography } from '../theme';

export function DiscoveryScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Discovery</Text>
      <Text style={styles.subtitle}>
        Explore content and features. Coming soon.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
