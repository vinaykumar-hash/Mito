import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../../context/UserContext';
// Add this import

export default function OtpVerificationScreen() {
  const [otp, setOtp] = useState('');
  const { phoneNumber } = useLocalSearchParams();
  const router = useRouter();
  const { login } = useUser(); // Move this outside the handleVerify function

  const handleVerify = () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit code');
      return;
    }

    if (otp === "123456") {  // In production, verify against your backend
      login({
        phoneNumber,
        isVerified: true,
        name: 'User' // Add default name or get from your signup flow
      });
      router.replace('/home');
    } else {
      Alert.alert('Invalid OTP', 'The code you entered is incorrect');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Verify Your Number</Text>
      <Text style={styles.subheader}>Code sent to {phoneNumber}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#999"
        keyboardType="number-pad"
        value={otp}
        onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
        maxLength={6}
        autoFocus
      />

      <TouchableOpacity 
        style={[styles.verifyButton, otp.length < 6 && { opacity: 0.5 }]}
        onPress={handleVerify}
        disabled={otp.length < 6}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        setOtp('');
        Alert.alert('Code Resent', 'A new verification code has been sent');
      }}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );
}

// ... keep your existing styles ...



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
    marginBottom: 10,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    fontSize: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  verifyButton: {
    backgroundColor: '#1b998e',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  resendText: {
    color: '#1b998e',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
  },
});