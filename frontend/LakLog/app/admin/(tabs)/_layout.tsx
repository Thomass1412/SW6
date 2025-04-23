import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminTabsLayout() {
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
            <Ionicons name="calendar-outline" size={size + 5} color={color} /> // Increase icon size
          ),
        }}
      />
      <Tabs.Screen
        name="operations"
        options={{
          title: "Operations",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cog-outline" size={size + 5} color={color} /> // Increase icon size
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
