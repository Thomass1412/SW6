import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserRole = "User" | "Admin";

export function useAuth() {
  const [user, setUser] = useState<{ role: UserRole } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const accessToken = await AsyncStorage.getItem("accessToken");
        const loginTime = await AsyncStorage.getItem("loginTime");
        const staySignedIn = await AsyncStorage.getItem("staySignedIn");

        if (storedUser && accessToken && loginTime) {
          const loginTimestamp = parseInt(loginTime, 10);
          const now = Date.now();
          const oneHour = 60 * 60 * 1000;
          const isExpired = now - loginTimestamp > oneHour;

          if (isExpired && staySignedIn !== "true") {
            // Token expired and user doesn't want to stay signed in
            await AsyncStorage.multiRemove([
              "user",
              "accessToken",
              "loginTime",
              "staySignedIn",
            ]);
            setUser(null);
          } else {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Failed to load auth state", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (
    role: UserRole,
    accessToken: string,
    staySignedIn: boolean
  ) => {
    const userData = { role };
    await AsyncStorage.multiSet([
      ["user", JSON.stringify(userData)],
      ["accessToken", accessToken],
      ["loginTime", Date.now().toString()],
      ["staySignedIn", staySignedIn ? "true" : "false"],
    ]);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([
      "user",
      "accessToken",
      "loginTime",
      "staySignedIn",
    ]);
    setUser(null);
  };

  return { user, loading, login, logout };
}
