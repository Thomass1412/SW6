import { Tabs } from "expo-router";

export default function EmployeeTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="monthlySchedule" options={{ title: "Schedule" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />

      {/* DailySchedule is inside tabs but hidden */}
      <Tabs.Screen name="dailySchedule" options={{ href: null }} />
    </Tabs>
  );
}
