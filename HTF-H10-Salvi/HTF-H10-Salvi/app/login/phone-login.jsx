import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    // Basic validation
    if (phoneNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a 10-digit phone number');
      return;
    }
    
    // Navigate to OTP verification with phone number
    router.push({
      pathname: '/login/otp-verification',
      params: { phoneNumber: `+91${phoneNumber}` }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Your Phone Number</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
          maxLength={10}
          autoFocus
        />
      </View>

      <Text style={styles.note}>We'll send a verification code to this number</Text>

      <TouchableOpacity 
        style={styles.continueButton}
        onPress={handleContinue}
        disabled={phoneNumber.length < 10}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b998e',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  countryCode: {
    fontSize: 18,
    marginRight: 10,
    color: '#1b998e',
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 10,
    color: '#333',
  },
  note: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: '#1b998e',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    opacity: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});