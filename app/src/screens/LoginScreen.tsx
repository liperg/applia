import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, ScreenContainer } from '../components';
import { colors, spacing, typography } from '../theme';

type LoginScreenProps = {
  onSignIn: () => void;
  onNavigateToSignup: () => void;
};

export function LoginScreen({ onSignIn, onNavigateToSignup }: LoginScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Use Google to sign in to Dra Lia.</Text>
        <Button title="Sign in with Google" onPress={onSignIn} style={styles.button} />
        <Button
          title="Create account"
          variant="secondary"
          onPress={onNavigateToSignup}
          style={styles.buttonSecondary}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  button: {
    marginBottom: spacing.md,
  },
  buttonSecondary: {
    marginTop: spacing.sm,
  },
});
