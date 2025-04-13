import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function UploadRecord() {
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState(null);

  const generateFakeIPFSHash = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    return 'Qm' + Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const generateTransactionDetails = () => ({
    gasCost: `${(Math.random() * 0.005).toFixed(6)} ETH`,
    transactionFee: `${(Math.random() * 0.001).toFixed(6)} ETH`,
    totalCost: `${(Math.random() * 0.006).toFixed(6)} ETH`
  });

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.type === 'success') {
      setUploading(true);
      setUploadData(null);
      setTimeout(() => {
        const ipfsHash = generateFakeIPFSHash();
        const txDetails = generateTransactionDetails();
        setUploadData({ name: result.name, ipfsHash, ...txDetails });
        setUploading(false);
      }, 3000); // Simulating 3 second delay
    } else {
      Alert.alert('Cancelled', 'File selection was cancelled.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📤 Upload Medical Record</Text>
      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={styles.buttonText}>Select and Upload PDF</Text>
      </TouchableOpacity>

      {uploading && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size="large" color="#1b998e" />
          <Text style={styles.uploadingText}>Uploading to Blockchain...</Text>
        </View>
      )}

      {uploadData && (
        <View style={styles.result}>
          <Text style={styles.successText}>✅ Uploaded Successfully!</Text>
          <Text style={styles.info}>File: {uploadData.name}</Text>
          <Text style={styles.info}>IPFS Hash: {uploadData.ipfsHash}</Text>
          <Text style={styles.info}>Gas Cost: {uploadData.gasCost}</Text>
          <Text style={styles.info}>Transaction Fee: {uploadData.transactionFee}</Text>
          <Text style={styles.info}>Total Cost: {uploadData.totalCost}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#f4f6f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b998e',
    textAlign: 'center',
    marginVertical: 30,
  },
  button: {
    backgroundColor: '#1b998e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  result: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginVertical: 3,
  },
});
