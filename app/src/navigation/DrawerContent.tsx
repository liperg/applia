import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Button } from '../components';
import { colors, spacing, typography } from '../theme';

type Props = DrawerContentComponentProps & {
  userDisplayName?: string | null;
  onEditProfile: () => void;
  onLogout: () => void;
};

export function DrawerContent(
  { navigation, userDisplayName, onEditProfile, onLogout }: Props
) {
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
    <DrawerContentScrollView style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.avatar} />
        <Text style={styles.name} numberOfLines={1}>
          {userDisplayName ?? 'User'}
        </Text>
        <Button title="Edit profile" variant="secondary" onPress={onEditProfile} style={styles.editBtn} />
      </View>
      <View style={styles.menu}>
        <Text
          style={styles.menuItem}
          onPress={() => navigation.navigate('Home')}
        >
          Home
        </Text>
        <Text
          style={styles.menuItem}
          onPress={() => navigation.navigate('Exams')}
        >
          Exams
        </Text>
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
  profile: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  editBtn: {
    alignSelf: 'flex-start',
  },
  menu: {
    padding: spacing.lg,
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
