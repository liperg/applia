import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Button, ProfileContent } from '../components';
import { colors, spacing, typography } from '../theme';

type Props = DrawerContentComponentProps & {
  userDisplayName?: string | null;
  userEmail?: string | null;
  memberSince?: string | null;
  onEditProfile: () => void;
  onLogout: () => void;
};

export function DrawerContent(props: Props) {
  const { navigation, userDisplayName, userEmail, memberSince, onEditProfile, onLogout } = props;

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  return (
    <DrawerContentScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ProfileContent
        userDisplayName={userDisplayName}
        userEmail={userEmail}
        memberSince={memberSince}
        compact
      />

      <View style={styles.menu}>
        <Text
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          Settings
        </Text>
      </View>

      <View style={styles.footer}>
        <Button title="Log out" variant="danger" onPress={handleLogout} />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  menu: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  menuItem: {
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    marginTop: 'auto',
  },
});
