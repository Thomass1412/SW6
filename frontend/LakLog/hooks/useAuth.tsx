import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useAuth() {
  const [user, setUser] = useState<{ role: "User" | "Admin" } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (role: "User" | "Admin") => {
    const userData = { role };
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  return { user, loading, login, logout };
}
