import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function EmployeeTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#090908", // Dark background
          borderTopWidth: 0, // Optional: Removes top border
        },
        tabBarActiveBackgroundColor: "#1D1D1D", // Dark background
        tabBarActiveTintColor: "#F7CB8C", // Slightly grayish active tab
        tabBarInactiveTintColor: "#F7CB8C", // Icon color
      }}
    >
      <Tabs.Screen
        name="monthlySchedule"
        options={{
          title: "Monthly Schedule",
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
