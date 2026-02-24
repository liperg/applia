import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ScreenContainer, Card } from '../components';
import { getDocuments, getDocument } from '../api/client';
import type { DocumentSummary, ExamItem } from '../api/client';
import { colors, spacing, typography } from '../theme';
import {
  type ChartDataPoint,
  type ExamHighlightItem,
  getMockChartData,
} from './home/types';
import { SummaryCard } from './home/SummaryCard';
import { ExamHighlightRow } from './home/ExamHighlightRow';

function relevantDocs(items: DocumentSummary[]): DocumentSummary[] {
  return items.filter(
    (d) =>
      d.status === 'processed' &&
      d.outOfRangeItems != null &&
      d.outOfRangeItems > 0,
  );
}

function examItemToHighlight(
  docId: string,
  fileName: string,
  item: ExamItem,
  index: number,
): ExamHighlightItem {
  return {
    id: `${docId}-${item.code ?? item.name}-${index}`,
    type: 'exam',
    documentId: docId,
    title: item.name,
    subtitle: `${fileName}${item.date != null ? ` · ${item.date}` : ''}`,
    currentValue: item.resultValue,
    referenceRange: item.referenceRange ?? undefined,
    unit: item.unit ?? undefined,
    trend: 'stable',
    outOfRange: item.outOfRange,
  };
}

async function buildHighlightList(
  docs: DocumentSummary[],
): Promise<ExamHighlightItem[]> {
  const details = await Promise.all(docs.map((d) => getDocument(d.id)));
  const highlights: ExamHighlightItem[] = [];
  docs.forEach((doc, i) => {
    const detail = details[i];
    if (!detail) return;
    detail.examItems
      .filter((item) => item.outOfRange)
      .forEach((item, j) => {
        highlights.push(
          examItemToHighlight(doc.id, doc.fileName, item, j),
        );
      });
  });
  return highlights;
}

export function HomeScreen() {
  const [docs, setDocs] = useState<DocumentSummary[]>([]);
  const [highlights, setHighlights] = useState<ExamHighlightItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await getDocuments();
      setDocs(items);
      const relevant = relevantDocs(items);
      const list = await buildHighlightList(relevant);
      setHighlights(list);
    } catch {
      setDocs([]);
      setHighlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const relevant = relevantDocs(docs);
  const totalOutOfRange = relevant.reduce(
    (sum, d) => sum + (d.outOfRangeItems ?? 0),
    0,
  );
  const chartData = getMockChartData(totalOutOfRange);
  const trendUp = false;
  const trendLabel = totalOutOfRange > 0 ? '−2 vs last month' : '0 vs last month';

  const handlePressItem = useCallback((_item: ExamHighlightItem) => {
    // TODO: navigate to document detail when screen exists
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={[styles.centered, styles.padded]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.secondary}>Loading…</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (relevant.length === 0) {
    return (
      <ScreenContainer>
        <Text style={[styles.emptyMessage, styles.padded]}>
          No exams need attention. Upload PDFs and check back after processing.
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SummaryCard
        totalCount={totalOutOfRange}
        trendLabel={trendLabel}
        trendUp={trendUp}
        chartData={chartData}
      />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exams needing attention</Text>
        <Card style={styles.listCard}>
          {highlights.map((item) => (
            <ExamHighlightRow
              key={item.id}
              item={item}
              onPress={() => handlePressItem(item)}
            />
          ))}
        </Card>
      </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  secondary: {
    ...typography.body,
    color: colors.textSecondary,
  },
  emptyMessage: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  listCard: {
    padding: 0,
    overflow: 'hidden',
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
});
