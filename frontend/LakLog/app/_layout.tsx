import { Stack, router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token && pathname !== "/") {
        router.replace("/");
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, [pathname]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Login", headerShown: false }} />
      <Stack.Screen name="employeeScreens/monthlySchedule" options={{ title: "Employee Schedule" }} />
      <Stack.Screen name="managerScreens/monthlySchedule" options={{ title: "Manager Schedule" }} />
    </Stack>
  );
}
