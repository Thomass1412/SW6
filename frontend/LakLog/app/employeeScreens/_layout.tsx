import { Stack } from "expo-router";

export default function EmployeeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs Layout */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
