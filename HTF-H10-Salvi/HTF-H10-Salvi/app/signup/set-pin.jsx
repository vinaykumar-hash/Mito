import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import messaging from "@react-native-firebase/messaging";
import * as Notifications from 'expo-notifications';

const baseURL = "https://00e7-2409-40f2-3148-e1d8-3c04-e640-cdcd-15cc.ngrok-free.app/";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function SetPinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useUser();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [deviceToken, setDeviceToken] = useState('');

  useEffect(() => {
    requestUserPermission();
    setupNotificationHandlers();
  }, []);

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled = 
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
      if (enabled) {
        console.log("Authorization status:", authStatus);
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        setDeviceToken(token);
      }
    } catch (error) {
      console.error("Permission request error:", error);
    }
  };

  const setupNotificationHandlers = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      return Promise.resolve();
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification?.body === "P1234") {
        const response = await showConfirmationAlert(
          remoteMessage.notification?.title || 'Permission Request',
          'Would you like to grant permission?'
        );
        
        await sendResponseToServer({
          requestId: remoteMessage.data?.requestId,
          phoneNumber: remoteMessage.data?.phoneNumber,
          response: response ? 'approved' : 'rejected'
        });
      }
    });

    messaging().getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open:', remoteMessage);
        }
      });

    return unsubscribe;
  };

  const showConfirmationAlert = (title, message) => {
    return new Promise(resolve => {
      Alert.alert(
        title,
        message,
        [
          {
            text: 'No',
            onPress: () => resolve(false),
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () => resolve(true)
          }
        ],
        { cancelable: false }
      );
    });
  };
  
  const sendResponseToServer = async (responseData) => {
    try {
      const response = await fetch(`${baseURL}notification-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      });
  
      if (!response.ok) {
        console.error('Failed to send response to server');
      }
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  const handleSubmit = async () => {
    // Validation checks
    if (pin.length !== 6 || confirmPin.length !== 6) {
      Alert.alert('Invalid PIN', 'PIN must be 6 digits');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('PIN Mismatch', 'PINs do not match');
      return;
    }

    // Combine all user data with PIN
    const completeUserData = {
      ...params,
      pin: pin,
      isPinSet: true,
      deviceToken: deviceToken
    };
    console.log(completeUserData)
    try {
      // Register user with backend
      const response = await fetch(`${baseURL}signup`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...completeUserData,
          PhoneNumber : completeUserData.phone,
          deviceToken: completeUserData.deviceToken // In production, use a proper hashing function
        })
      });

      const data = await response.json();
      console.log("Registration response:", data);

      // Save user locally and redirect to home
      login(completeUserData);
      router.replace('/home');
    } catch (error) {
      console.error("Registration failed:", error);
      Alert.alert("Error", "Failed to complete registration");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Set Your 6-Digit Private Key</Text>
      <Text style={styles.subheader}>This will be used to secure your health data</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit PIN"
        placeholderTextColor="#999"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
        value={pin}
        onChangeText={setPin}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm 6-digit PIN"
        placeholderTextColor="#999"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
        value={confirmPin}
        onChangeText={setConfirmPin}
      />

      <TouchableOpacity 
        style={[styles.button, (pin.length !== 6 || confirmPin.length !== 6) && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={pin.length !== 6 || confirmPin.length !== 6}
      >
        <Text style={styles.buttonText}>Save Private Key</Text>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    color: '#7f8c8d',
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
    textAlign: 'center',
    fontSize: 18,
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