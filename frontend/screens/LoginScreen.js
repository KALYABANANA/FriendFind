import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { login } = useApp();

  const handleContinue = async () => {
    try {
      const dummyEmail = `${phoneNumber}@friendfind.app`;
      await login(dummyEmail, phoneNumber);
      navigation.replace('MainTabs');
    } catch (error) {
      alert("Login failed: " + (error.message || "Unknown error"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <Image 
            source={require('../assets/fries_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Text Section */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>You don't have to study alone anymore</Text>
            <Text style={styles.subtitle}>Find your people and grow together</Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <View style={styles.countryCodeContainer}>
              <Text style={styles.countryCode}>+66</Text>
            </View>
            <View style={styles.dividerVertical} />
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerHorizontal} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.dividerHorizontal} />
          </View>

          {/* Social Login Buttons */}
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={20} color="#DB4437" style={styles.socialIcon} />
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={20} color="#000" style={styles.socialIcon} />
            <Text style={styles.socialText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Footer Terms */}
          <Text style={styles.footerText}>
            By clicking continue, you agree to our <Text style={styles.linkText}>Terms of Service</Text>{'\n'}
            and <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 50,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  countryCodeContainer: {
    justifyContent: 'center',
  },
  countryCode: {
    fontSize: 16,
    color: '#6B7280',
  },
  dividerVertical: {
    width: 1,
    height: 24,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  continueButton: {
    backgroundColor: '#000000',
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerHorizontal: {
    flex: 1,
    height: 1,
    backgroundColor: '#4B5563',
  },
  orText: {
    marginHorizontal: 12,
    color: '#6B7280',
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE7F3', // Light pink for social buttons
    borderWidth: 1,
    borderColor: '#FFFFFF', // slightly distinct border
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 10,
  },
  socialText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    color: '#111827',
    fontWeight: '500',
  },
});
