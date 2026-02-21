import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ScreenContainer, Button } from '../components';
import { uploadDocument } from '../api/client';
import { colors, spacing, typography } from '../theme';

type ImportScreenProps = {
  onDone: () => void;
};

export function ImportScreen({ onDone }: ImportScreenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickAndUpload = async () => {
    setError(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setLoading(true);
      await uploadDocument({ uri: file.uri, name: file.name ?? 'document.pdf' });
      onDone();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      setError(msg);
      Alert.alert('Upload failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Import PDF</Text>
      <Text style={styles.body}>Select a lab exam PDF to upload. It will be processed in the background.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title={loading ? 'Uploading…' : 'Choose PDF'}
        onPress={pickAndUpload}
        loading={loading}
        disabled={loading}
        style={styles.button}
      />
      <Button title="Cancel" variant="secondary" onPress={onDone} style={styles.cancel} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  button: {
    marginBottom: spacing.md,
  },
  cancel: {
    marginTop: spacing.sm,
  },
});
