import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ListItem } from '../../components';
import { colors, typography } from '../../theme';
import { CaretUp, CaretDown, Minus } from 'phosphor-react-native';
import type { ExamHighlightItem } from './types';

type ExamHighlightRowProps = {
  item: ExamHighlightItem;
  onPress?: () => void;
};

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  const size = 14;
  if (trend === 'up')
    return <CaretUp size={size} color={colors.danger} weight="bold" />;
  if (trend === 'down')
    return <CaretDown size={size} color={colors.success} weight="bold" />;
  return <Minus size={size} color={colors.textSecondary} weight="bold" />;
}

export function ExamHighlightRow({ item, onPress }: ExamHighlightRowProps) {
  const valueText = item.currentValue != null && item.unit != null
    ? `${item.currentValue} ${item.unit}`
    : item.currentValue ?? '—';
  const refText = item.referenceRange != null ? `Ref: ${item.referenceRange}` : null;

  const right = (
    <View style={styles.right}>
      <View style={styles.valueBlock}>
        <Text style={styles.valueText} numberOfLines={1}>
          {valueText}
        </Text>
        {refText ? (
          <Text style={styles.refText} numberOfLines={1}>
            {refText}
          </Text>
        ) : null}
      </View>
      <TrendIcon trend={item.trend} />
    </View>
  );

  return (
    <ListItem
      title={item.title}
      subtitle={item.subtitle}
      right={right}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueBlock: {
    alignItems: 'flex-end',
  },
  valueText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  refText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
