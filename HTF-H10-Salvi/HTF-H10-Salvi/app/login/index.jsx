import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router=useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Mito</Text>
      <Text style={styles.subtitle}>Let's get started!</Text>
      <Text style={styles.description}>Login to get access to your health vault.</Text>
      
      {/* Login Button */}
      <TouchableOpacity 
        style={styles.loginButton}
        onPress={() => router.push('/login/phone-login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Sign Up Section */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  textHeader: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1b998e',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
    fontWeight: '400',
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    maxWidth: '80%',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#1b998e',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 30, // Increased margin to separate from signup
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  signupLink: {
    color: '#1b998e',
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontSize: 14,
  }
});