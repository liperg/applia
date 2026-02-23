import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  Modal,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Button, Input } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { ButtonApple } from './ButtonApple';
import { ButtonGoogle } from './ButtonGoogle';
import { countryCodes, type CountryCode } from './data/countryCodes';

const BACKGROUND_HEIGHT = 350;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingScreenProps = {
  onComplete: () => void;
};

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>('BR');
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  const selectedCountry = countryCodes.find(c => c.code === countryCode) ?? countryCodes[0];

  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleGoogle = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleApple = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <View style={styles.mainContainer}>
      {/* Background: wrapper with explicit dimensions so ImageBackground renders reliably */}
      <View style={styles.backgroundWrapper}>
        <ImageBackground
          source={require('./assets/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.accentOverlay} />
        </ImageBackground>
        <Svg style={styles.gradientOverlay} width={SCREEN_WIDTH} height={BACKGROUND_HEIGHT}>
          <Defs>
            <LinearGradient id="fadeGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.background} stopOpacity="0" />
              <Stop offset="1" stopColor={colors.background} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#fadeGradient)" />
        </Svg>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.header}>Login or sign up</Text>

            <Pressable onPress={() => setCountryPickerVisible(true)}>
              <Input
                label="Country/region"
                value={selectedCountry.name}
                editable={false}
                containerStyle={styles.inputRow}
              />
            </Pressable>
            <Input
              label="Phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder=""
              containerStyle={styles.inputRow}
            />
            <Text style={styles.hint}>
              You will receive a code to confirm your phone number.
            </Text>
            <Button
              title="Continue"
              onPress={handleContinue}
              style={styles.continueButton}
            />

            <View style={styles.dividerWrap}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerTextWrap}>
                <Text style={styles.dividerText}>or</Text>
              </View>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialWrap}>
              <ButtonGoogle onPress={handleGoogle} />
              <ButtonApple onPress={handleApple} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={countryPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCountryPickerVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setCountryPickerVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Country/region</Text>
            <FlatList
              data={countryCodes}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.modalItem,
                    item.code === countryCode && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setCountryCode(item.code);
                    setCountryPickerVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      item.code === countryCode && styles.modalItemTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: BACKGROUND_HEIGHT,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  accentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.textSecondary,
    opacity: 0.15,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xxl,
  },
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: 0,
  },
  header: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  inputRow: {
    marginBottom: spacing.md,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  continueButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerTextWrap: {
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  socialWrap: {
    gap: spacing.md,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    maxHeight: '70%',
    padding: spacing.lg,
  },
  modalTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  modalItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
  modalItemSelected: {
    backgroundColor: colors.primarySoft,
  },
  modalItemText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  modalItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
