import { Stack } from "expo-router";

export default function EmployeeLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: "Employee Dashboard" }} />
    </Stack>
  );
}
