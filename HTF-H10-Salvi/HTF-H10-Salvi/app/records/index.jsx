import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const RecordsScreen = () => {
  const records = [
    {
      id: '1',
      title: 'Blood Test',
      date: 'Apr 5, 2025',
      type: 'Lab',
      addedBy: 'Dr. Smith',
      approved: true,
      tag: 'Urgent'
    },
    {
      id: '2',
      title: 'X-Ray Scan',
      date: 'Mar 28, 2025',
      type: 'Imaging',
      addedBy: 'Dr. Lee',
      approved: false,
      tag: 'Follow-up'
    },
    {
      id: '3',
      title: 'Doctor Note',
      date: 'Mar 15, 2025',
      type: 'Clinical',
      approved: true
    },
    {
      id: '4',
      title: 'ECG Report',
      date: 'Mar 1, 2025',
      type: 'Cardiology',
      tag: 'Routine'
    }
  ];

  const renderStatus = (record) => {
    return (
      <View style={styles.statusContainer}>
        {record.addedBy && (
          <Text style={styles.statusText}>👨‍⚕️ {record.addedBy}</Text>
        )}
        {'approved' in record && (
          <Text style={[styles.statusText, { color: record.approved ? '#4CAF50' : '#E91E63' }]}>
            {record.approved ? '✅ Approved' : '⏳ Pending'}
          </Text>
        )}
        {record.tag && (
          <Text style={styles.tag}>{record.tag}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medical Records</Text>
      <FlatList
        data={records}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Link href={`/records/${item.id}`} asChild>
            <TouchableOpacity style={styles.recordItem}>
              <View style={styles.row}>
                <Text style={styles.recordTitle}>{item.title}</Text>
                <Text style={styles.recordType}>{item.type}</Text>
              </View>
              <Text style={styles.recordDate}>📅 {item.date}</Text>
              {renderStatus(item)}
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#eef3f9'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e1e2d'
  },
  recordItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  recordTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222'
  },
  recordType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a90e2',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  recordDate: {
    fontSize: 13,
    color: '#666',
    marginTop: 6
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8
  },
  statusText: {
    fontSize: 13,
    color: '#555',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  tag: {
    fontSize: 13,
    color: '#fff',
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  }
});

export default RecordsScreen;
