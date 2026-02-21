import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, ScreenContainer } from '../components';
import { colors, spacing, typography } from '../theme';

type SignupScreenProps = {
  onSignUp: () => void;
  onNavigateToLogin: () => void;
};

export function SignupScreen({ onSignUp, onNavigateToLogin }: SignupScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Sign up with Google to get started.</Text>
        <Button title="Sign up with Google" onPress={onSignUp} style={styles.button} />
        <Button
          title="Already have an account? Sign in"
          variant="secondary"
          onPress={onNavigateToLogin}
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
