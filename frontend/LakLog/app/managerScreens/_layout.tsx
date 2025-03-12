import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ManagerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#090908', borderTopColor: '#e0e0e0' },
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'regular', color: '#F7CB8C' },
        tabBarIconStyle: { marginBottom: -3 },
        tabBarActiveTintColor: '#F7CB8C',
        tabBarInactiveTintColor: '#F7CB8C',
        tabBarActiveBackgroundColor: '#2e2e2e', 
      }}
    >
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
