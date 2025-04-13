import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const handleContinue = () => {
    if (!userData.name || !userData.phone || !userData.email) {
      Alert.alert('Missing Information', 'Please fill all fields');
      return;
    }
    router.push({
        pathname: '/signup/additional-info',
        params: userData
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Your Account</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={userData.name}
        onChangeText={(text) => setUserData({...userData, name: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={userData.phone}
        onChangeText={(text) => setUserData({...userData, phone: text.replace(/[^0-9]/g, '')})}
        maxLength={10}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={userData.email}
        onChangeText={(text) => setUserData({...userData, email: text})}
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleContinue}
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b998e',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#1b998e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});