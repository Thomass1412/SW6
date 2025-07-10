import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EmployeeTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#090908", 
          borderTopWidth: 0, 
          height: 70, 
        },
        tabBarActiveBackgroundColor: "#1D1D1D", 
        tabBarActiveTintColor: "#F7CB8C",
        tabBarInactiveTintColor: "#F7CB8C", 
        tabBarIconStyle: {
          alignItems: 'center',
          justifyContent: 'center', 
        },
        tabBarLabelStyle: {
          fontSize: 16,
          textAlign: 'center', 
          marginTop: 5, 
        },
      }}
    >
      <Tabs.Screen
        name="shiftSales"
        options={{
          title: "Shift Sales",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-outline" size={size+5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="monthlySchedule"
        options={{
          title: "Schedule",
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
      <Tabs.Screen
        name="dailySchedule"
        options={{
          href: null, 
        }}
      />
    </Tabs>
  );
}
