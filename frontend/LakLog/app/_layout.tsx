import { useEffect, useState } from "react";
import { Stack, Slot, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function Layout() {
  const router = useRouter();
  const { user, loading } = useAuth(); // Fetch user role
  const [isMounted, setIsMounted] = useState(false);

  // Ensure layout is mounted before redirection
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !loading) {
      if (!user) {
        router.replace("/"); // Redirect to login
      } else if (user.role === "employee") {
        router.replace("/employeeScreens/(tabs)/monthlySchedule");
      } else if (user.role === "manager") {
        router.replace("/managerScreens/(tabs)/monthlySchedule");
      }
    }
  }, [user, loading, isMounted]);

  if (!isMounted || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Slot /> {/* Ensures Expo Router mounts correctly */}
    </Stack>
  );
}
