import { Stack } from 'expo-router';

export default function SignupLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="additional-info" options={{ title: 'Additional Info' }} />
    </Stack>
  );
}