import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  FlatList,
  ImageBackground,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretDown } from 'phosphor-react-native';
import { Button, Input } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { GoogleIcon } from './icons/GoogleIcon';
import { AppleIcon } from './icons/AppleIcon';

const COUNTRY_OPTIONS = [
  { code: 'BR', name: 'Brazil (+55)' },
  { code: 'US', name: 'United States (+1)' },
  { code: 'PT', name: 'Portugal (+351)' },
];

type OnboardingSignUpScreenProps = {
  onContinueWithPhone?: (phoneNumber: string, countryCode: string) => void;
  onContinueWithGoogle?: () => void;
  onContinueWithApple?: () => void;
  onSignIn?: () => void;
};

export function OnboardingSignUpScreen({
  onContinueWithPhone,
  onContinueWithGoogle,
  onContinueWithApple,
  onSignIn,
}: OnboardingSignUpScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryIndex, setCountryIndex] = useState(0);
  const [phoneError, setPhoneError] = useState('');
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  const selectedCountry = COUNTRY_OPTIONS[countryIndex];

  const handleSelectCountry = (index: number) => {
    setCountryIndex(index);
    setCountryModalVisible(false);
  };

  const handleContinue = () => {
    const trimmed = phoneNumber.trim().replace(/\D/g, '');
    if (trimmed.length < 8) {
      setPhoneError('Enter a valid phone number');
      return;
    }
    setPhoneError('');
    onContinueWithPhone?.(phoneNumber, selectedCountry.code);
  };

  const insets = useSafeAreaInsets();
  const backgroundHeight = 350 + insets.top;
  const scrollContentPaddingTop = spacing.xl + insets.top;

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../../../assets/background.png')}
        style={[styles.backgroundImage, { height: backgroundHeight }]}
        resizeMode="cover"
      >
        <View style={styles.accentOverlay} />
        <Svg style={styles.gradientOverlay}>
          <Defs>
            <LinearGradient id="fadeGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.surface} stopOpacity="0" />
              <Stop offset="1" stopColor={colors.surface} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#fadeGradient)" />
        </Svg>
      </ImageBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: scrollContentPaddingTop },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.header}>Login or sign up</Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.countryRow}
              onPress={() => setCountryModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.countryLabel}>Country/region</Text>
              <View style={styles.countryValueRow}>
                <Text style={styles.countryValue}>{selectedCountry.name}</Text>
                <CaretDown size={20} color={colors.textPrimary} weight="bold" />
              </View>
            </TouchableOpacity>

            <Modal
              visible={countryModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setCountryModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setCountryModalVisible(false)} />
                <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                  <Text style={styles.modalTitle}>Select country</Text>
                  <FlatList
                    data={COUNTRY_OPTIONS}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={[
                          styles.modalItem,
                          index === countryIndex && styles.modalItemSelected,
                        ]}
                        onPress={() => handleSelectCountry(index)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.modalItemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setCountryModalVisible(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Input
              label="Phone number"
              value={phoneNumber}
              onChangeText={(t) => { setPhoneNumber(t); setPhoneError(''); }}
              placeholder="Your phone number"
              keyboardType="phone-pad"
              error={phoneError}
            />

            <Text style={styles.hint}>
              You will receive a code to confirm your phone number.
            </Text>

            <Button
              title="Continue"
              onPress={handleContinue}
              style={styles.continueBtn}
            />
          </View>

          <View style={styles.dividerWrap}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <Pressable
              style={({ pressed }) => [styles.socialButton, styles.googleButton, pressed && styles.socialPressed]}
              onPress={onContinueWithGoogle}
            >
              <View style={styles.socialIconWrap}>
                <GoogleIcon />
              </View>
              <Text style={[styles.googleButtonText, styles.socialButtonLabel]}>Continue with Google</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.socialButton, styles.appleButton, pressed && styles.socialPressed]}
              onPress={onContinueWithApple}
            >
              <View style={styles.socialIconWrap}>
                <AppleIcon color="#fff" />
              </View>
              <Text style={[styles.appleButtonText, styles.socialButtonLabel]}>Continue with Apple</Text>
            </Pressable>
          </View>

          {onSignIn ? (
            <TouchableOpacity style={styles.signInLink} onPress={onSignIn}>
              <Text style={styles.signInLinkText}>Already have an account? Sign in</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350, // overridden inline with insets
  },
  accentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primarySoft,
    opacity: 0.5,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scroll: {
    flex: 1,
    marginTop: -spacing.xxl,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    // paddingTop set inline with insets
  },
  container: {
    gap: spacing.lg,
  },
  header: {
    ...typography.title,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  inputContainer: {
    gap: spacing.md,
  },
  countryRow: {
    marginBottom: spacing.sm,
  },
  countryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  countryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  countryValue: {
    ...typography.body,
    color: colors.textPrimary,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  continueBtn: {
    marginTop: spacing.md,
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  socialContainer: {
    gap: spacing.md,
  },
  socialButton: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingLeft: 48 + spacing.lg,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    position: 'relative',
  },
  socialPressed: {
    opacity: 0.85,
  },
  googleButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  googleButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  socialButtonLabel: {
    flex: 1,
    textAlign: 'center',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  appleButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.surface,
  },
  signInLink: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
  },
  signInLinkText: {
    ...typography.body,
    color: colors.primary,
  },
  socialIconWrap: {
    position: 'absolute',
    left: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    maxHeight: 320,
  },
  modalTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  modalItemSelected: {
    backgroundColor: colors.primarySoft,
  },
  modalItemText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  modalCancel: {
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  modalCancelText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
