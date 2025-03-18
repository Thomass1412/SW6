import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminLayout() {
  return (
    <Stack>
      {/* Tab Navigator (Main Employee Screens) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
