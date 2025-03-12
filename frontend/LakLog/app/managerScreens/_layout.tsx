import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ManagerLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="monthlySchedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="operations"
        options={{
          title: "Operations",
          tabBarIcon: ({ color, size }) => <Ionicons name="cog" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
