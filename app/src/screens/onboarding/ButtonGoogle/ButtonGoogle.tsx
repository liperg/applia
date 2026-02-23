import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme';
import { GoogleIcon } from './GoogleIcon';

const ICON_SIZE = 48;

type ButtonGoogleProps = {
  onPress: () => void;
};

export function ButtonGoogle({ onPress }: ButtonGoogleProps) {
  return (
    <Pressable onPress={onPress} hitSlop={4}>
      {({ pressed }) => (
        <View style={[styles.button, pressed && styles.buttonPressed]}>
          <View style={styles.iconWrap}>
            <GoogleIcon />
          </View>
          <Text style={styles.label}>Continue with Google</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.border,
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
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
});
