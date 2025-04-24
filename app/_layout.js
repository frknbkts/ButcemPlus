import { Stack } from 'expo-router';
import AnaEkran from './index';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="index"
        component={AnaEkran}
      />
    </Stack>
  );
} 