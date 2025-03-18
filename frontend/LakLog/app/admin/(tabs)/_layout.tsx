import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminTabsLayout() {
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
        name="operations"
        options={{
          title: "Operations",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dailySchedule"
        options={{
          href: null, 
        }}
      />
    </Tabs>
  );
}
