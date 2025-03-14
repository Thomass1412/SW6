import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EmployeeTabsLayout() {
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
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Include dailySchedule in the tab group but hide from the tab bar */}
      <Tabs.Screen
        name="dailySchedule"
        options={{
          href: null, // This makes sure it doesn't show in the bottom tab bar
        }}
      />
    </Tabs>
  );
}
