import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EmployeeLayout() {
  return (
    <Stack>
      {/* Tab Navigator (Main Employee Screens) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="specificShift" options={{ headerShown: true, title: "Shift Details" }} />
      <Stack.Screen name="createUnavailability" options={{ headerShown: true, title: "Create Unavailability"}} />
    </Stack>
  );
}
