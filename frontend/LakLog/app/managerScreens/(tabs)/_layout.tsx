import { Tabs } from "expo-router";

export default function ManagerTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="monthlySchedule" options={{ title: "Schedule" }} />
      <Tabs.Screen name="operations" options={{ title: "Operations" }} />
    </Tabs>
  );
}
