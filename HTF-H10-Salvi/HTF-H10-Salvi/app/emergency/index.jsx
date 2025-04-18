import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration, ScrollView } from 'react-native';
import axios from 'axios';


const contacts = [
  { name: 'Arya', number: '9262585344', token: 'token_arya_123' },
  { name: 'Archie', number: '8595563855', token: 'token_archie_456' },
  { name: 'Salvi', number: '9462133655', token: 'token_salvi_789' }
];

export default function EmergencyAlertScreen() {
  const handleEmergency = async () => {
    Vibration.vibrate(1000); // Vibrate for 1 second
    Vibration.vibrate([500, 300, 500, 300, 1000]);


    for (const contact of contacts) {
        try {
            await axios.post('https://2892-103-246-193-34.ngrok-free.app/emergency', { test: true });
            Alert.alert('🚨 Alert Sent', `Notification sent to ${contact.name}`);
          } catch (error) {
            console.log('❌ Error sending alert:', error.message);
            Alert.alert('Failed to send alert', error?.message || 'Unknown error');
          }
          
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚨 Emergency Contacts</Text>

      {contacts.map((contact, index) => (
        <TouchableOpacity key={index} style={styles.contactCard}>
          <Text style={styles.contactText}>{contact.name}</Text>
          <Text style={styles.contactNumber}>{contact.number}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert("Feature coming soon!")}>
        <Text style={styles.addButtonText}>➕ Add Emergency Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
        <Text style={styles.emergencyButtonText}>Send Emergency Alert</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f6fa',
    flexGrow: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: '#e0f2fe',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  contactText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0369a1',
  },
  contactNumber: {
    fontSize: 16,
    color: '#0284c7',
  },
  addButton: {
    backgroundColor: '#38bdf8',
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center'
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  emergencyButton: {
    backgroundColor: '#ef4444',
    padding: 18,
    borderRadius: 14,
    marginTop: 30,
    alignItems: 'center'
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700'
  }
});
