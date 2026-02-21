import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { PencilSimple } from 'phosphor-react-native';
import { Card } from './Card';
import { ListItem } from './ListItem';
import { Input } from './Input';
import { Button } from './Button';
import { colors, spacing, typography } from '../theme';

const AVATAR_SIZE = 80;

function SectionHeader({ children }: { children: string }) {
  return <Text style={styles.sectionHeader}>{children}</Text>;
}

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export type ProfileContentProps = {
  userDisplayName?: string | null;
  userEmail?: string | null;
  memberSince?: string | null;
  /** Compact mode: smaller avatar, less padding (e.g. for drawer) */
  compact?: boolean;
};

export function ProfileContent({
  userDisplayName,
  userEmail,
  memberSince = 'January 2024',
  compact = false,
}: ProfileContentProps) {
  const displayName = userDisplayName ?? 'User';
  const email = userEmail ?? '';

  const [name, setName] = useState(displayName);
  const [emailValue, setEmailValue] = useState(email);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isNameExpanded, setIsNameExpanded] = useState(false);
  const [isEmailExpanded, setIsEmailExpanded] = useState(false);

  const initials = displayName
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSaveName = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Name is required');
      return;
    }
    setNameError('');
    setIsNameExpanded(false);
  };

  const handleCancelName = () => {
    setName(displayName);
    setNameError('');
    setIsNameExpanded(false);
  };

  const handleSaveEmail = () => {
    const trimmed = emailValue.trim();
    if (!trimmed) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(trimmed)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setIsEmailExpanded(false);
  };

  const handleCancelEmail = () => {
    setEmailValue(email);
    setEmailError('');
    setIsEmailExpanded(false);
  };

  const avatarSize = compact ? AVATAR_SIZE : 120;

  return (
    <View style={[styles.wrapper, compact && styles.wrapperCompact]}>
      {/* Avatar */}
      <View style={[styles.avatarSection, compact && styles.avatarSectionCompact]}>
        <View style={[styles.avatarWrapper, { width: avatarSize, height: avatarSize }]}>
          <View style={[styles.avatarCircle, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
            <Text style={[styles.avatarInitials, compact && styles.avatarInitialsCompact]}>{initials}</Text>
          </View>
          <TouchableOpacity
            style={[styles.editAvatarBtn, compact && styles.editAvatarBtnCompact]}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <PencilSimple size={compact ? 14 : 18} color={colors.surface} weight="bold" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.userName, compact && styles.userNameCompact]} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={[styles.userEmail, compact && styles.userEmailCompact]} numberOfLines={1}>
          {email || 'No email'}
        </Text>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, compact && styles.statsRowCompact]}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Documents</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Exams</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>—</Text>
          <Text style={styles.statLabel}>Member</Text>
        </View>
      </View>

      {/* Personal Information */}
      <SectionHeader>Personal Information</SectionHeader>
      <Card style={styles.sectionCardList}>
        <ListItem title="Member since" subtitle={memberSince} style={styles.listItem} />
        <View style={styles.divider} />
        <ListItem
          title="Full name"
          subtitle={isNameExpanded ? 'Your full legal name' : name}
          onPress={() => setIsNameExpanded(!isNameExpanded)}
          right={<Text style={styles.editLink}>{isNameExpanded ? 'Cancel' : 'Edit'}</Text>}
          style={styles.listItem}
        />
        {isNameExpanded && (
          <View style={styles.accordionContent}>
            <Input
              value={name}
              onChangeText={(t) => { setName(t); setNameError(''); }}
              placeholder="Full name"
              autoCapitalize="words"
              error={nameError}
            />
            <View style={styles.accordionActions}>
              <Button title="Cancel" variant="secondary" onPress={handleCancelName} style={styles.accordionBtn} />
              <Button title="Save" onPress={handleSaveName} style={styles.accordionBtn} />
            </View>
          </View>
        )}
        <View style={styles.divider} />
        <ListItem
          title="Email address"
          subtitle={isEmailExpanded ? 'Used for account notifications' : emailValue || 'Not set'}
          onPress={() => setIsEmailExpanded(!isEmailExpanded)}
          right={<Text style={styles.editLink}>{isEmailExpanded ? 'Cancel' : 'Edit'}</Text>}
          style={styles.listItem}
        />
        {isEmailExpanded && (
          <View style={styles.accordionContent}>
            <Input
              value={emailValue}
              onChangeText={(t) => { setEmailValue(t); setEmailError(''); }}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />
            <View style={styles.accordionActions}>
              <Button title="Cancel" variant="secondary" onPress={handleCancelEmail} style={styles.accordionBtn} />
              <Button title="Save" onPress={handleSaveEmail} style={styles.accordionBtn} />
            </View>
          </View>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  wrapperCompact: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  sectionHeader: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatarSectionCompact: {
    paddingVertical: spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    ...typography.title,
    fontSize: 36,
    color: colors.primary,
  },
  avatarInitialsCompact: {
    fontSize: 28,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarBtnCompact: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  userName: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  userNameCompact: {
    fontSize: 16,
    marginBottom: 0,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  userEmailCompact: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statsRowCompact: {
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    ...typography.subtitle,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionCardList: {
    padding: 0,
    overflow: 'hidden',
  },
  listItem: {
    borderBottomWidth: 0,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  editLink: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
  },
  accordionContent: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
  },
  accordionActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  accordionBtn: {
    flex: 1,
  },
});
