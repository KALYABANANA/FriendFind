import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function SubjectSelectorScreen() {
  const { activeSubject, setActiveSubject, fetchSubjects } = useApp();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchSubjects();
      setSubjects(data.subjects || []);
    } catch (e) {
      console.warn(e);
      setSubjects([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchSubjects]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const renderItem = ({ item }) => {
    const selected = activeSubject?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => setActiveSubject(item)}
        activeOpacity={0.85}
      >
        <Text style={styles.code}>{item.subject_code}</Text>
        <Text style={styles.name}>{item.subject_name}</Text>
        {selected ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Active</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Subject Selector</Text>
        <Text style={styles.sub}>
          Choose your active subject. Swipe and discovery use this subject.
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.button} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.button} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              No subjects in the database yet. Add rows to the `subjects` table, then pull to refresh.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  sub: { marginTop: 6, fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  cardSelected: {
    borderColor: colors.button,
  },
  code: { fontSize: 18, fontWeight: '700', color: colors.text },
  name: { marginTop: 4, fontSize: 15, color: colors.textMuted },
  badge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: colors.button,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.textMuted, padding: 24 },
});
