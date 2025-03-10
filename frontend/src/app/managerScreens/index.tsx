import { Stack } from "expo-router";

export default function ManagerLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: "Manager Dashboard" }} />
    </Stack>
  );
}
