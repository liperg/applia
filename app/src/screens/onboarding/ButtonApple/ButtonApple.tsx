import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme';
import { AppleIcon } from './AppleIcon';

const ICON_SIZE = 48;

type ButtonAppleProps = {
  onPress: () => void;
};

export function ButtonApple({ onPress }: ButtonAppleProps) {
  return (
    <Pressable onPress={onPress} hitSlop={4}>
      {({ pressed }) => (
        <View style={[styles.button, pressed && styles.buttonPressed]}>
          <View style={styles.iconWrap}>
            <AppleIcon color={colors.surface} />
          </View>
          <Text style={styles.label}>Continue with Apple</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.textPrimary,
    borderRadius: 999,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  iconWrap: {
    position: 'absolute',
    width: ICON_SIZE,
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.surface,
    flex: 1,
    textAlign: 'center',
  },
});
