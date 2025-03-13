import { View, Text, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function ManagerMonthlySchedule() {
  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/");
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Manager Monthly Schedule</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
