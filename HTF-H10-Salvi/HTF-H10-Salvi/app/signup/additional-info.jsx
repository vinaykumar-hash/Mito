import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

export default function AdditionalInfoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  // Initialize with empty values if params are undefined
  const [userData, setUserData] = useState({
    name: params.name || '',
    phone: params.phone || '',
    email: params.email || '',
    birthDate: '',
    bloodGroup: '',
    gender: ''
  });

  const handleSubmit = () => {
    if (!userData.birthDate || !userData.bloodGroup || !userData.gender) {
      Alert.alert('Missing Information', 'Please fill all fields');
      return;
    }
    
    // Navigate to PIN setup with all collected data
    router.push({
      pathname: '/signup/set-pin',
      params: userData
    });
  };
    
    
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Additional Information</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Birth Date (DD/MM/YYYY)"
        value={userData.birthDate}
        onChangeText={(text) => setUserData({...userData, birthDate: text})}
      />
      
      <Picker
        selectedValue={userData.bloodGroup}
        style={styles.picker}
        onValueChange={(itemValue) => setUserData({...userData, bloodGroup: itemValue})}
      >
        <Picker.Item label="Select Blood Group" value="" />
        {bloodGroups.map(group => (
          <Picker.Item key={group} label={group} value={group} />
        ))}
      </Picker>
      
      <Picker
        selectedValue={userData.gender}
        style={styles.picker}
        onValueChange={(itemValue) => setUserData({...userData, gender: itemValue})}
      >
        <Picker.Item label="Select Gender" value="" />
        {genders.map(gender => (
          <Picker.Item key={gender} label={gender} value={gender} />
        ))}
      </Picker>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Complete Signup</Text>
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
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
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