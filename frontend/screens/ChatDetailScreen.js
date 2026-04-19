import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../constants/theme';

const initialMessages = {
  private: [
    { id: '1', text: 'Hi there!', sender: 'other' },
    { id: '2', text: 'Hello! How are you?', sender: 'me' },
    { id: '3', text: 'I am good, thanks. Ready to study?', sender: 'other' },
  ],
  group: [
    { id: '1', text: 'Hey everyone, are we meeting today?', sender: 'other' },
    { id: '2', text: 'Yes, I am ready at 6pm.', sender: 'other' },
    { id: '3', text: 'Perfect! I will bring the notes.', sender: 'me' },
  ],
};

export default function ChatDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { chatType = 'private', title = 'Chat' } = route.params || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages[chatType] || []);

  const headerLabel = useMemo(() => {
    return chatType === 'group' ? `${title} (Group)` : title;
  }, [chatType, title]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(prev.length + 1), text: message.trim(), sender: 'me' },
    ]);
    setMessage('');
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.messageItem, isMe ? styles.messageMe : styles.messageOther]}>
        <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerLabel}</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
          inverted
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E0EA',
  },
  backButton: {
    width: 60,
  },
  backText: {
    color: colors.button,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageList: {
    paddingVertical: 16,
    flexDirection: 'column-reverse',
  },
  messageItem: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
  },
  messageMe: {
    backgroundColor: colors.button,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },
  messageOther: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#fff',
  },
  messageTextOther: {
    color: colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: '#F0E0EA',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.text,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: colors.button,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontWeight: '700',
  },
});
