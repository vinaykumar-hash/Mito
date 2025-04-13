import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="phone-login" options={{ title: 'Phone Login' }} />
      <Stack.Screen name="otp-verification" options={{ title: 'OTP verify ' }} />
    </Stack>
  );
}