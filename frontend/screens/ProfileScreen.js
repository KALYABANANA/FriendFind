import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { getApiBase } from '../services/api';

export default function ProfileScreen() {
  const { user, login, register, logout, loading: bootLoading } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const onLogin = async () => {
    setMsg('');
    setBusy(true);
    try {
      await login(email.trim(), password);
      setMsg('Signed in.');
    } catch (e) {
      setMsg(e.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const onRegister = async () => {
    setMsg('');
    setBusy(true);
    try {
      await register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });
      setMsg('Account created. You can sign in now.');
    } catch (e) {
      setMsg(e.message || 'Register failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.apiHint}>
            API: {getApiBase()}
            {'\n'}
            Web + Docker บนเครื่องเดียวกัน: ใช้ localhost (ดู WEB-DOCKER.md)
            {'\n'}
            มือถือจริง: ตั้ง EXPO_PUBLIC_API_URL เป็น http://IP-เครื่อง-dev:5000
          </Text>

          {bootLoading ? (
            <Text style={styles.muted}>Loading…</Text>
          ) : user ? (
            <View style={styles.card}>
              <Text style={styles.label}>Signed in as</Text>
              <Text style={styles.name}>{user.username}</Text>
              <Text style={styles.email}>{user.email}</Text>
              <TouchableOpacity style={styles.btn} onPress={logout}>
                <Text style={styles.btnText}>Log out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.section}>Sign in</Text>
              <View style={styles.card}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={[styles.btn, busy && { opacity: 0.7 }]}
                  onPress={onLogin}
                  disabled={busy}
                >
                  <Text style={styles.btnText}>Login</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.section}>Register</Text>
              <View style={styles.card}>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  value={regUsername}
                  onChangeText={setRegUsername}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={regEmail}
                  onChangeText={setRegEmail}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={regPassword}
                  onChangeText={setRegPassword}
                />
                <TouchableOpacity
                  style={[styles.btn, busy && { opacity: 0.7 }]}
                  onPress={onRegister}
                  disabled={busy}
                >
                  <Text style={styles.btnText}>Create account</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {msg ? <Text style={styles.msg}>{msg}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  apiHint: { marginTop: 8, fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  section: { marginTop: 20, marginBottom: 8, fontSize: 16, fontWeight: '700', color: colors.text },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { fontSize: 13, color: colors.textMuted },
  name: { marginTop: 4, fontSize: 20, fontWeight: '800', color: colors.text },
  email: { marginTop: 4, fontSize: 15, color: colors.textMuted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    color: colors.text,
  },
  btn: {
    marginTop: 4,
    backgroundColor: colors.button,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  msg: { marginTop: 16, color: colors.text, fontSize: 14 },
  muted: { color: colors.textMuted },
});
