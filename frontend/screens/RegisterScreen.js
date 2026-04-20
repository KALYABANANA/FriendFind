import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  
  // States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = useRef([]);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [major, setMajor] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [bio, setBio] = useState('');

  const { register, login } = useApp();
  const GOALS = [
    "Find study partners", "Stay motivated to study", 
    "Prepare for exams together", "Improve my grades", 
    "Join group study sessions", "Learn new skills"
  ];

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      try {
        const dummyEmail = `${phoneNumber}@friendfind.app`;
        await register({
          username: name || phoneNumber || 'New User',
          email: dummyEmail,
          password: phoneNumber, // Use phone number as password
          faculty: major || 'N/A',
          year: 1, // default
          interests: `Goals: ${selectedGoals.join(', ')} | Bio: ${bio}`,
          profile_image_url: ''
        });
        
        // Auto-login after registration
        await login(dummyEmail, phoneNumber);
        navigation.replace('MainTabs'); // Finished registration
      } catch (error) {
        alert("Registration failed: " + (error.message || "Unknown error"));
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.navigate('Loader');
    }
  };

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      if (selectedGoals.length < 5) {
        setSelectedGoals([...selectedGoals, goal]);
      }
    }
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) {
      otpRefs.current[index + 1].focus();
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.questionTitle}>What's your phone number?</Text>
      
      <View style={styles.phoneInputContainer}>
        <Text style={styles.countryCode}>+66</Text>
        <View style={styles.dividerVertical} />
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          autoFocus
        />
      </View>
      <Text style={styles.helperText}>We'll send you a verification code to keep your account secure.</Text>
      
      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Send code</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.titleLarge}>ENTER YOUR CONFIRMATION CODE</Text>
      <Text style={styles.subtitleGray}>Sent to: +66 {phoneNumber || '08xxxxxxxx'}</Text>
      
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (otpRefs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
          />
        ))}
      </View>
      
      <TouchableOpacity>
        <Text style={styles.resendText}>Didn't receive the code? Resend OTP</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.inputLabel}>What's your name?</Text>
      <TextInput
        style={styles.formInput}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.inputLabel}>When's your birthday?</Text>
      <View style={styles.formInputContainer}>
        <TextInput
          style={styles.inputFlex}
          value={birthday}
          onChangeText={setBirthday}
        />
        <Ionicons name="calendar-outline" size={20} color="#000" />
      </View>

      <Text style={styles.inputLabel}>What gender are you?</Text>
      <View style={styles.formInputContainer}>
        <TextInput
          style={styles.inputFlex}
          value={gender}
          onChangeText={setGender}
        />
        <Ionicons name="chevron-down" size={20} color="#000" />
      </View>

      <Text style={styles.inputLabel}>What is your major?</Text>
      <TextInput
        style={styles.formInput}
        value={major}
        onChangeText={setMajor}
      />

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.headerRight}>
         <TouchableOpacity onPress={handleNext}><Text style={styles.skipText}>Skip</Text></TouchableOpacity>
      </View>
      
      <Text style={styles.titleCenter}>What are your goals?</Text>
      <Text style={styles.counterText}>{selectedGoals.length}/5</Text>
      
      <View style={styles.goalsContainer}>
        {GOALS.map((goal, index) => {
          const isSelected = selectedGoals.includes(goal);
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.goalPill, isSelected && styles.goalPillSelected]}
              onPress={() => toggleGoal(goal)}
            >
              <Text style={[styles.goalText, isSelected && styles.goalTextSelected]}>{goal}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.titleCenter}>Add your first photo</Text>
      <Text style={styles.subtitleCenter}>Select at least 1 photo</Text>
      
      <View style={styles.photosGrid}>
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <TouchableOpacity key={item} style={styles.photoBox}>
            <Ionicons name="add" size={30} color="#F58882" />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.titleCenterSmall}>Add a bio</Text>
      <TextInput
        style={styles.bioInput}
        multiline
        numberOfLines={4}
        value={bio}
        onChangeText={setBio}
      />

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#FFFFFF', '#FECEE6']} style={{flex: 1}}>
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleBack} 
            style={styles.backButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    position: 'absolute',
    top: -40,
    right: 0,
  },
  skipText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  // Step 1 & Common
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 55,
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 12,
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
  helperText: {
    fontSize: 13,
    color: '#9CA3AF',
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#F58882',
    width: '100%',
    height: 55,
    borderRadius: 25, // Rounded pill shape as seen in design
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Step 2
  titleLarge: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    marginBottom: 8,
  },
  subtitleGray: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  resendText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  
  // Step 3
  inputLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFF',
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  formInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputFlex: {
    flex: 1,
    fontSize: 15,
  },
  
  // Step 4
  titleCenter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },
  counterText: {
    fontSize: 12,
    color: '#9CA3AF',
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  goalPill: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  goalPillSelected: {
    borderColor: '#F58882',
    backgroundColor: '#FFF0F0',
  },
  goalText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  goalTextSelected: {
    color: '#F58882',
  },
  
  // Step 5
  subtitleCenter: {
    fontSize: 14,
    color: '#F58882',
    marginTop: 4,
    marginBottom: 20,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  photoBox: {
    width: (width - 48 - 20) / 3, // Screen width minus padding minus gap
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  titleCenterSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
  },
  bioInput: {
    backgroundColor: '#FFF',
    width: '100%',
    height: 100,
    borderRadius: 8,
    padding: 16,
    fontSize: 15,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
});
