import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const RecordDetail = () => {
  const { id } = useLocalSearchParams();

  const [showDetails, setShowDetails] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const record = {
    id,
    title: 'Blood Test Results',
    date: 'Apr 5, 2025',
    type: 'Laboratory',
    details: 'Complete blood count results: WBC - 5.5, RBC - 4.8, Hemoglobin - 13.5, Platelets - 250K...',
  };

  const toggleDetails = () => setShowDetails(!showDetails);

  const handleReview = () => {
    setReviewed(true);
    Alert.alert('Marked as Reviewed', 'This record has been marked as reviewed.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{record.title}</Text>
      <Text style={styles.meta}>{record.type} • {record.date}</Text>

      <TouchableOpacity onPress={toggleDetails}>
        <Text style={styles.toggleBtn}>
          {showDetails ? 'Hide Details ▲' : 'Show Details ▼'}
        </Text>
      </TouchableOpacity>

      {showDetails && (
        <Text style={styles.details}>{record.details}</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={reviewed ? 'Reviewed ✅' : 'Mark as Reviewed'}
          onPress={handleReview}
          color={reviewed ? '#4CAF50' : '#2196F3'}
          disabled={reviewed}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  meta: { color: '#666', marginVertical: 8 },
  details: { fontSize: 16, marginTop: 8 },
  toggleBtn: {
    color: '#007BFF',
    marginVertical: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 16,
    alignSelf: 'flex-start',
  },
});

export default RecordDetail;
