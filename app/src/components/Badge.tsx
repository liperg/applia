import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const variantBg: Record<BadgeVariant, string> = {
  default: colors.primarySoft,
  success: '#DCFCE7',
  warning: '#FEF3C7',
  danger: '#FEE2E2',
};

const variantText: Record<BadgeVariant, string> = {
  default: colors.primary,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: variantBg[variant] }]}>
      <Text style={[styles.text, { color: variantText[variant] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});
