import { Stack } from "expo-router";

export default function ManagerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="monthlySchedule" />
      <Stack.Screen name="operations" />
      <Stack.Screen name="dailySchedule" options={{ presentation: "modal" }} /> 
    </Stack>
  );
}
