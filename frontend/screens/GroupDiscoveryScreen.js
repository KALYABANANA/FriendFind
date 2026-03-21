import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function GroupDiscoveryScreen() {
  const { activeSubject, token, fetchGroups, createGroup, joinGroup } = useApp();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memberLimit, setMemberLimit] = useState('8');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const subjectId = activeSubject?.id;
      const data = await fetchGroups(subjectId);
      setGroups(data.groups || []);
    } catch (e) {
      console.warn(e);
      setGroups([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeSubject, fetchGroups]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const submitCreate = async () => {
    if (!activeSubject) {
      setError('Pick an active subject first.');
      return;
    }
    if (!token) {
      setError('Log in from the Profile tab to create a group.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await createGroup({
        subject_id: activeSubject.id,
        title: title.trim(),
        description: description.trim() || undefined,
        member_limit: memberLimit ? Number(memberLimit) : undefined,
      });
      setModalOpen(false);
      setTitle('');
      setDescription('');
      setMemberLimit('8');
      await load();
    } catch (e) {
      setError(e.message || 'Could not create group');
    } finally {
      setSaving(false);
    }
  };

  const onJoin = async (groupId) => {
    if (!token) {
      setError('Log in from the Profile tab to join.');
      return;
    }
    try {
      await joinGroup(groupId);
      setError('');
    } catch (e) {
      setError(e.message || 'Join failed');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Group Discovery</Text>
        <Text style={styles.sub}>
          {activeSubject
            ? `Filtered by ${activeSubject.subject_code}`
            : 'Showing all groups (select a subject to filter)'}
        </Text>
      </View>

      {error ? <Text style={styles.err}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => {
          setError('');
          setModalOpen(true);
        }}
      >
        <Text style={styles.createBtnText}>+ Create study group</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={colors.button} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.button} />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.subject_code} · {item.subject_name}
              </Text>
              {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
              <Text style={styles.meta}>Limit: {item.member_limit ?? '—'}</Text>
              <TouchableOpacity style={styles.joinBtn} onPress={() => onJoin(item.id)}>
                <Text style={styles.joinText}>Request to join</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No groups yet. Create one or widen filters.</Text>
          }
        />
      )}

      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New study group</Text>
            {!token ? (
              <Text style={styles.warn}>Sign in on the Profile tab to create a group.</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Member limit"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              value={memberLimit}
              onChangeText={setMemberLimit}
            />
            {error ? <Text style={styles.errSmall}>{error}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancel} onPress={() => setModalOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.save, saving && { opacity: 0.7 }]}
                disabled={saving}
                onPress={submitCreate}
              >
                <Text style={styles.saveText}>{saving ? 'Saving…' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  sub: { marginTop: 6, fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  err: { color: '#c00', marginHorizontal: 20, marginBottom: 8 },
  createBtn: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: colors.button,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  meta: { marginTop: 6, fontSize: 13, color: colors.textMuted },
  desc: { marginTop: 10, fontSize: 14, color: colors.text, lineHeight: 20 },
  joinBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.button,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  joinText: { color: colors.button, fontWeight: '700' },
  empty: { textAlign: 'center', color: colors.textMuted, padding: 24 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  warn: { color: colors.textMuted, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    color: colors.text,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  errSmall: { color: '#c00', marginBottom: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  cancel: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelText: { color: colors.textMuted, fontWeight: '600' },
  save: {
    backgroundColor: colors.button,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  saveText: { color: '#fff', fontWeight: '700' },
});
