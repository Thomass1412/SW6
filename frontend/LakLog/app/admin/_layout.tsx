import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="monthlySchedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
