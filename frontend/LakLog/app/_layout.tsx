import { useEffect, useState } from "react";
import { Stack, Slot, useRouter, Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth"; // Assuming you have an auth context

export default function RootLayout() {
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
        } else if (user.role === "User") {
          router.replace("/employee/(tabs)/monthlySchedule");
        } else if (user.role === "Admin") {
          router.replace("/admin/(tabs)/monthlySchedule");
        }
      }
    }, [user, loading, isMounted]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="employee" options={{ headerShown: false }} />
    </Stack>
  );
}
