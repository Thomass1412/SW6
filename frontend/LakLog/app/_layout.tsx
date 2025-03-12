import "react-native-gesture-handler"; // Ensure this is at the very top
import { Stack, router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      const role = await AsyncStorage.getItem("userRole");

      if (!token) {
        router.replace("/");
      } else {
        setIsAuthenticated(true);
        setUserRole(role);
      }
    };
    checkAuth();
  }, [pathname]);

  if (!isAuthenticated) {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ title: "Login", headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack>
      {userRole === "Manager" ? (
        <Stack.Screen name="managerScreens" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="employeeScreens" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
