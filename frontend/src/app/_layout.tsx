import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="managerScreens/home" options={{ title: "Manager Dashboard" }} />
      <Stack.Screen name="employeeScreens" options={{ title: "Employee Home" }} />
      <Stack.Screen name="employeeScreens/home" options={{ title: "Employee Dashboard" }} />
    </Stack>
  );
}