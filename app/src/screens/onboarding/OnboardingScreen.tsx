import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, ScreenContainer } from '../../components';
import { colors, spacing, typography } from '../../theme';

type OnboardingScreenProps = {
  onComplete: () => void;
};

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Dra Lia</Text>
        <Text style={styles.body}>
          Upload your lab exam PDFs and keep track of results and out-of-range values in one place.
        </Text>
        <Button title="Get started" onPress={onComplete} style={styles.button} />
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
    marginBottom: spacing.lg,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  button: {
    alignSelf: 'flex-start',
  },
});
