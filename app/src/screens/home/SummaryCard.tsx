import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { LineChart } from './LineChart';
import type { ChartDataPoint } from './types';
import { CaretDown, CaretUp } from 'phosphor-react-native';

type SummaryCardProps = {
  totalCount: number;
  trendLabel: string;
  trendUp: boolean;
  chartData: readonly ChartDataPoint[];
};

export function SummaryCard({
  totalCount,
  trendLabel,
  trendUp,
  chartData,
}: SummaryCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>Exams needing attention</Text>
      <Text style={styles.value}>{totalCount}</Text>
      <View style={styles.trendRow}>
        {trendUp ? (
          <CaretUp size={16} color={colors.danger} />
        ) : (
          <CaretDown size={16} color={colors.success} />
        )}
        <Text
          style={[styles.trendText, trendUp ? styles.trendNegative : styles.trendPositive]}
          numberOfLines={1}
        >
          {trendLabel}
        </Text>
      </View>
      <View style={styles.chartWrap}>
        <LineChart data={chartData} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.title,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  trendText: {
    ...typography.caption,
  },
  trendPositive: {
    color: colors.success,
  },
  trendNegative: {
    color: colors.danger,
  },
  chartWrap: {
    marginTop: spacing.sm,
  },
});
