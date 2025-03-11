import "react-native-gesture-handler"; // Ensure this is at the very top
import { Stack, router, usePathname, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

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

  return userRole === "Manager" ? <ManagerTabs /> : <EmployeeTabs />;
}

// ⬇️ Bottom Tabs for Employees ⬇️
function EmployeeTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="employeeScreens/monthlySchedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

// ⬇️ Bottom Tabs for Managers ⬇️
function ManagerTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="managerScreens/monthlySchedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="managerScreens/operations"
        options={{
          title: "Operations",
          tabBarIcon: ({ color, size }) => <Ionicons name="cog" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
