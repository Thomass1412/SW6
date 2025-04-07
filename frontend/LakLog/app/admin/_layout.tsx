import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="createShift" options={{ headerShown: true, title: "Create Shift" }} />
      <Stack.Screen name="specificShift" options={{ headerShown: true, title: "Shift Details" }} />
      <Stack.Screen name="employeesPage" options={{ headerShown: true, title: "Employees" }} />
    </Stack>
  );
}
