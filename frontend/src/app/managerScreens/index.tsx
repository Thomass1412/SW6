import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function managerLayout() {
  return (
    <Tabs screenOptions={{ tabBarStyle: { backgroundColor: "#000" }, tabBarActiveTintColor: "orange" }}>
      {/* 🏠 Manager Home (Schedule equivalent) */}
      <Tabs.Screen
        name="managerHome"
        options={{
          tabBarLabel: "Schedule",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />

      {/* ⚙️ Operations */}
      <Tabs.Screen
        name="operations"
        options={{
          tabBarLabel: "Operations",
          tabBarIcon: ({ color, size }) => <Ionicons name="cog" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
