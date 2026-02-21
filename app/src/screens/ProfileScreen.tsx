import React from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenContainer, ProfileContent } from '../components';

type ProfileScreenProps = {
  userDisplayName?: string | null;
  userEmail?: string | null;
  memberSince?: string | null;
};

export function ProfileScreen({
  userDisplayName,
  userEmail,
  memberSince = 'January 2024',
}: ProfileScreenProps) {
  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ProfileContent
            userDisplayName={userDisplayName}
            userEmail={userEmail}
            memberSince={memberSince}
            compact={false}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
