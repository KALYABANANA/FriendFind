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
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function GroupDiscoveryScreen() {
  const { activeSubject, fetchGroups, fetchUsersByActiveSubject } = useApp();
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('friends');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const load = useCallback(async () => {
    try {
      const subjectId = activeSubject?.id;
      const groupPromise = fetchGroups(subjectId);
      const userPromise = activeSubject
        ? fetchUsersByActiveSubject(activeSubject.subject_code)
        : Promise.resolve({ users: [] });

      const [groupData, userData] = await Promise.all([groupPromise, userPromise]);
      setGroups(groupData.groups || []);
      setUsers(userData.users || []);
      setError('');
    } catch (e) {
      console.warn(e);
      setGroups([]);
      setUsers([]);
      setError('Unable to load chat list.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeSubject, fetchGroups, fetchUsersByActiveSubject]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const handleOpenPrivateChat = (user) => {
    navigation.navigate('ChatDetail', {
      chatType: 'private',
      title: user.username || user.name || 'Friend',
    });
  };

  const handleOpenGroupChat = (group) => {
    navigation.navigate('ChatDetail', {
      chatType: 'group',
      title: group.title || group.subject_name || 'Group Chat',
    });
  };

  const activeData = selectedTab === 'friends' ? users : groups;
  const emptyText = selectedTab === 'friends' ? 'No friends to chat with.' : 'No group chats available.';

  return (
    <LinearGradient colors={['#FFFFFF', '#FECEE6']} style={{flex: 1}}>
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>Chat</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabItem, selectedTab === 'friends' && styles.tabSelected]}
          onPress={() => setSelectedTab('friends')}
        >
          <Text style={[styles.tabText, selectedTab === 'friends' && styles.tabTextSelected]}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, selectedTab === 'groups' && styles.tabSelected]}
          onPress={() => setSelectedTab('groups')}
        >
          <Text style={[styles.tabText, selectedTab === 'groups' && styles.tabTextSelected]}>Groups</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.err}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color={colors.button} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={activeData}
          keyExtractor={(item, index) => String(item.id ?? item.title ?? index)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.button} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatCard}
              onPress={() => (selectedTab === 'friends' ? handleOpenPrivateChat(item) : handleOpenGroupChat(item))}
            >
              <View style={styles.avatar} />
              <View style={styles.chatContent}>
                <Text style={styles.chatName}>
                  {selectedTab === 'friends' ? item.username || item.name || 'Friend' : item.title || item.subject_name || 'Group Chat'}
                </Text>
                <Text style={styles.chatLast}>
                  {selectedTab === 'friends'
                    ? 'Hello !'
                    : item.subject_name
                    ? `${item.subject_name} group chat`
                    : 'Group conversation'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
        />
      )}
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E0EA',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F9F2F7',
  },
  tabSelected: {
    backgroundColor: '#fff',
    borderBottomWidth: 3,
    borderBottomColor: colors.button,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  tabTextSelected: {
    color: colors.text,
  },
  err: {
    color: '#c00',
    marginHorizontal: 20,
    marginTop: 10,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 12,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#000',
    marginRight: 14,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  chatLast: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textMuted,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    padding: 24,
  },
});
