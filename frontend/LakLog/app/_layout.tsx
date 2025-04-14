import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "../hooks/useAuth";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !loading) {
      if (!user) {
        router.replace("/"); 
      } else if (user.role === "User") {
        router.replace("/employee/(tabs)/monthlySchedule");
      } else if (user.role === "Admin") {
        router.replace("/admin/(tabs)/monthlySchedule");
      }
    }
  }, [user, loading, isMounted]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="employee" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" backgroundColor="#000000" translucent={false} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
