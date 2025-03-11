import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* ❌ No Bottom Navigation for Login */}
      <Stack.Screen name="login" options={{ headerShown: false }} />

      {/* ❌ No Bottom Navigation for Standalone Screens (e.g., newShift) */}
      <Stack.Screen name="newShift" options={{ headerShown: true }} />

      {/* ✅ Manager Screens → Uses Tab Navigation */}
      <Stack.Screen name="managerScreens/index" options={{ headerShown: false }} />

      {/* ✅ Employee Screens → Uses Tab Navigation */}
      <Stack.Screen name="employeeScreens/index" options={{ headerShown: false }} />
    </Stack>
  );
}
