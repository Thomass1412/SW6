import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EmployeeTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#090908", // Dark background
          borderTopWidth: 0, // Optional: Removes top border
          height: 70, // Adjust the height as needed
        },
        tabBarActiveBackgroundColor: "#1D1D1D", // Dark background
        tabBarActiveTintColor: "#F7CB8C", // Slightly grayish active tab
        tabBarInactiveTintColor: "#F7CB8C", // Icon color
        tabBarIconStyle: {
          alignItems: 'center', // Center the icons horizontally
          justifyContent: 'center', // Center the icons vertically
        },
        tabBarLabelStyle: {
          fontSize: 16, // Increase font size
          textAlign: 'center', // Center the text horizontally
          marginTop: 5, // Adjust the margin to bring down the text
        },
      }}
    >
      <Tabs.Screen
        name="monthlySchedule"
        options={{
          title: "Monthly Schedule",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size+5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size+5} color={color} />
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
