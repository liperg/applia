import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ScreenContainer, ListItem, Badge } from '../components';
import { getDocuments, DocumentSummary } from '../api/client';
import { colors, spacing, typography } from '../theme';

type ExamsScreenProps = {
  onAddPress: () => void;
};

function statusVariant(status: string): 'default' | 'success' | 'warning' | 'danger' {
  if (status === 'processed') return 'success';
  if (status === 'failed') return 'danger';
  if (status === 'processing') return 'warning';
  return 'default';
}

export function ExamsScreen({ onAddPress }: ExamsScreenProps) {
  const [items, setItems] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const { items: list } = await getDocuments();
      setItems(list);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
          <Text style={styles.addLabel}>+ Add12</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.secondary}>Loading…</Text>
      ) : items.length === 0 ? (
        <Text style={styles.secondary}>No documents yet. Tap "+ Add" to import a PDF.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(d) => d.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <ListItem
              title={item.fileName}
              subtitle={
                item.status === 'processed' && item.totalItems != null
                  ? `${item.totalItems} items${item.outOfRangeItems != null && item.outOfRangeItems > 0 ? ` · ${item.outOfRangeItems} need attention` : ''}`
                  : item.status
              }
              right={<Badge label={item.status} variant={statusVariant(item.status)} />}
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  addButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  addLabel: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
  secondary: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
