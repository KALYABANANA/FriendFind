import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ChatDetailScreen({ route, navigation }) {
  const { chatType = 'group', title = 'Chat' } = route.params || {};
  const { activeSubject, user } = useApp();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'User A',
      content: 'Hello everyone!',
      timestamp: '21:41',
      isOwn: false,
      avatar: 'A',
    },
    {
      id: 2,
      sender: 'You',
      content: 'Hi there!',
      timestamp: '21:42',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'User B',
      content: 'How are you all doing?',
      timestamp: '21:43',
      isOwn: false,
      avatar: 'B',
    },
  ]);

  const getTimeString = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        content: message.trim(),
        timestamp: getTimeString(),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.isOwn && styles.ownMessageContainer]}>
      {!item.isOwn && (
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{item.avatar || 'U'}</Text>
        </View>
      )}
      <View style={[styles.messageBubble, item.isOwn && styles.ownMessageBubble]}>
        <Text style={[styles.messageText, item.isOwn && styles.ownMessageText]}>
          {item.content}
        </Text>
        <Text style={[styles.timestamp, item.isOwn && styles.ownTimestamp]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.subjectCode}>{activeSubject?.subject_code || 'Code'}</Text>
          <Text style={styles.groupName}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.memberButton}>
          <MaterialCommunityIcons name="account-multiple" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Messages Section */}
      <View style={styles.groupNameSection}>
        <Text style={styles.groupNameLabel}>{title}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.messagesContent}
        scrollEnabled={true}
      />

      {/* Input Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="big title"
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
          />
          <TextInput
            style={styles.pinInput}
            placeholder="1 2 3 4 5"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Message ..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.attachmentButton}>
            <Ionicons name="mic" size={20} color="#F58882" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentButton}>
            <MaterialCommunityIcons name="emoticon-happy-outline" size={20} color="#F58882" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={handleSendMessage}
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#F58882" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEAF2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  subjectCode: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginTop: 2,
  },
  memberButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 3,
    backgroundColor: '#4DB8FF',
  },
  groupNameSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFEAF2',
  },
  groupNameLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  messagesContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  messageBubble: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '75%',
  },
  ownMessageBubble: {
    backgroundColor: '#D1D5DB',
    marginRight: 0,
  },
  messageText: {
    fontSize: 14,
    color: '#000',
  },
  ownMessageText: {
    color: '#FFF',
  },
  timestamp: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  ownTimestamp: {
    color: '#9CA3AF',
  },
  inputContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    maxHeight: 100,
  },
  attachmentButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
