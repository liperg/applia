import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { CaretRight } from 'phosphor-react-native';
import { ScreenContainer, Card, ListItem, Button, Switch } from '../components';
import { colors, spacing, typography } from '../theme';

type SettingsScreenProps = {
  userDisplayName?: string | null;
  userEmail?: string | null;
  onEditProfile?: () => void;
  onLogout?: () => void;
};

function SectionHeader({ children }: { children: string }) {
  return <Text style={styles.sectionHeader}>{children}</Text>;
}

export function SettingsScreen({
  userDisplayName,
  userEmail,
  onEditProfile,
  onLogout,
}: SettingsScreenProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [muteNotifications, setMuteNotifications] = useState(false);
  const [syncContacts, setSyncContacts] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  const displayName = userDisplayName ?? 'User';
  const initials = displayName
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const email = userEmail ?? '';

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        <Card style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.profileRow}
            onPress={onEditProfile}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileContent}>
              <Text style={styles.profileName} numberOfLines={1}>{displayName}</Text>
              {email ? (
                <Text style={styles.profileEmail} numberOfLines={1}>{email}</Text>
              ) : null}
            </View>
            <CaretRight size={20} color={colors.textSecondary} weight="bold" />
          </TouchableOpacity>
        </Card>

        {/* Upgrade banner (optional) */}
        <Card style={[styles.sectionCard, styles.upgradeBanner]}>
          <View style={styles.upgradeContent}>
            <View>
              <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
              <Text style={styles.upgradeSubtitle}>
                Unlock exclusive features and get the most out of your experience.
              </Text>
            </View>
            <Button title="Upgrade" variant="secondary" onPress={() => {}} />
          </View>
        </Card>

        {/* Push notifications */}
        <SectionHeader>Push notifications</SectionHeader>
        <Card style={[styles.sectionCard, styles.sectionCardList]}>
          <ListItem
            title="Enable push notifications"
            right={<Switch value={pushEnabled} onValueChange={setPushEnabled} />}
          />
          <ListItem
            title="Mute all notifications"
            right={<Switch value={muteNotifications} onValueChange={setMuteNotifications} />}
            style={styles.lastItem}
          />
        </Card>

        {/* Security */}
        <SectionHeader>Security</SectionHeader>
        <Card style={[styles.sectionCard, styles.sectionCardList]}>
          <ListItem title="Change your passcode" onPress={() => {}} />
          <ListItem title="Your devices" subtitle="Manage connected devices" onPress={() => {}} />
          <ListItem
            title="Sign out"
            onPress={onLogout ? handleSignOut : undefined}
            style={styles.lastItem}
          />
        </Card>

        {/* Privacy */}
        <SectionHeader>Privacy</SectionHeader>
        <Card style={[styles.sectionCard, styles.sectionCardList]}>
          <ListItem
            title="Sync your phone contacts"
            subtitle="Access your contacts who use the app"
            right={<Switch value={syncContacts} onValueChange={setSyncContacts} />}
          />
          <ListItem
            title="Marketing communications"
            subtitle="Manage your marketing consent"
            onPress={() => {}}
            style={styles.lastItem}
          />
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  sectionCard: {
    marginBottom: 0,
  },
  sectionCardList: {
    marginBottom: 0,
    padding: 0,
    overflow: 'hidden',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 0,
  },
  profileContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  profileEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
  },
  upgradeBanner: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  upgradeTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  upgradeSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});
