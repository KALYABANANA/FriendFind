import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';

export default function GroupClassScreen({ navigation }) {
  const { activeSubject, fetchGroups, createGroup } = useApp();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memberLimit, setMemberLimit] = useState('5');
  const [creating, setCreating] = useState(false);

  const loadGroups = useCallback(async () => {
    if (!activeSubject) return;
    try {
      const data = await fetchGroups(activeSubject.id);
      setGroups(data.groups || []);
    } catch (error) {
      console.warn("Failed to load groups:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeSubject, fetchGroups]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const onRefresh = () => {
    setRefreshing(true);
    loadGroups();
  };

  const handleCreateGroup = async () => {
    if (!title.trim()) {
      alert('Please enter a group title');
      return;
    }
    
    setCreating(true);
    try {
      await createGroup({
        subject_id: activeSubject.id,
        title: title.trim(),
        description: description.trim(),
        member_limit: parseInt(memberLimit) || 5,
      });
      setModalVisible(false);
      setTitle('');
      setDescription('');
      setMemberLimit('5');
      // Refresh the list to show the new group
      setLoading(true);
      loadGroups();
    } catch (error) {
      alert("Failed to create group: " + (error.message || "Unknown error"));
    } finally {
      setCreating(false);
    }
  };

  const handleOpenAddMembers = (group) => {
    navigation.navigate('GroupAddMember', { group });
  };

  const renderGroupCard = ({ item, index }) => {
    const isHot = index === 0; // Mocking HOT badge for the first item
    const limit = item.member_limit || 5;
    const mockAvatars = ['A', 'B', 'C', 'D'].slice(0, Math.min(4, Math.max(0, limit - 1)));
    const hasOpenSlot = mockAvatars.length < limit;
    
    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('GroupJoin', { group: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {isHot && (
            <View style={styles.hotBadge}>
              <Text style={styles.hotBadgeText}>HOT</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.cardDetail} numberOfLines={2}>
          Detail : {item.description || "No description"}
        </Text>
        <Text style={styles.membersLabel}>Members</Text>
        <View style={styles.cardFooter}>
          <View style={styles.membersRow}>
            {mockAvatars.map((letter, i) => (
              <View key={i} style={[styles.memberAvatar, { marginRight: 10 }]}>
                <Text style={styles.avatarText}>{letter}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#FECEE6']} style={{flex: 1}}>
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activeSubject?.subject_code || 'Subject'}</Text>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.sectionTitle}>Group Hub</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F58882" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderGroupCard}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No groups found. Be the first to create one!</Text>
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create New Group</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Group Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. หาทำงานกลุ่ม"
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.inputLabel}>Description / Detail</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g. หาเพื่อนทำงานรายวิชานี้"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              <View style={styles.memberLimitSection}>
                <Text style={styles.inputLabel}>Members</Text>
                <View style={styles.memberPreviewRow}>
                  {Array.from({ length: parseInt(memberLimit) || 5 }).map((_, i) => (
                    <View key={i} style={styles.previewAvatar} />
                  ))}
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      const tempGroup = {
                        id: null,
                        title: title.trim() || 'New Group',
                        member_limit: parseInt(memberLimit) || 5,
                        isCreating: true,
                      };
                      navigation.navigate('GroupAddMember', { group: tempGroup });
                    }}
                  >
                    <Text style={styles.addButtonText}>add</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.memberLimitInputRow}>
                  <Text style={styles.memberLimitLabel}>Member Limit:</Text>
                  <TextInput
                    style={styles.memberLimitInput}
                    placeholder="5"
                    value={memberLimit}
                    onChangeText={setMemberLimit}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleCreateGroup}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Create Group</Text>
                )}
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Light pink background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#6B7280', // Grayish color
  },
  createButton: {
    backgroundColor: '#F58882', // Orange/pink pill
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  hotBadge: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  hotBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardDetail: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 12,
  },
  membersLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  addAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  addAvatarText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  memberCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 40,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#F58882',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberLimitSection: {
    marginTop: 12,
  },
  memberPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 10,
  },
  previewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  memberLimitInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  memberLimitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  memberLimitInput: {
    width: 50,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
});
