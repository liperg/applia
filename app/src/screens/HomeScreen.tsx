import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { ScreenContainer, Card, Badge } from '../components';
import { getDocuments, DocumentSummary } from '../api/client';
import { colors, spacing, typography } from '../theme';

/** Relevant exams: processed docs with out-of-range items (FR-016); follow-up list empty in MVP (FR-017). */
function relevantDocs(items: DocumentSummary[]): DocumentSummary[] {
  return items.filter(
    (d) =>
      d.status === 'processed' &&
      d.outOfRangeItems != null &&
      d.outOfRangeItems > 0
  );
}

export function HomeScreen() {
  const [docs, setDocs] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocuments()
      .then(({ items }) => setDocs(items))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, []);

  const relevant = relevantDocs(docs);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Home</Text>
      {loading ? (
        <Text style={styles.secondary}>Loading…</Text>
      ) : relevant.length === 0 ? (
        <Text style={styles.secondary}>
          No exams need attention. Upload PDFs and check back after processing.
        </Text>
      ) : (
        <>
          <Text style={styles.subtitle}>Exams needing attention</Text>
          <FlatList
            data={relevant}
            keyExtractor={(d) => d.id}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Text style={styles.fileName}>{item.fileName}</Text>
                <View style={styles.row}>
                  <Badge label={`${item.outOfRangeItems} out of range`} variant="warning" />
                </View>
              </Card>
            )}
          />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  secondary: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.md,
  },
  fileName: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
