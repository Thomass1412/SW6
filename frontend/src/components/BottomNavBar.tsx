import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";

export default function BottomNavBar() {
  const router = useRouter();

  return (
    <View className="flex-row justify-between p-4 bg-black">
      <TouchableOpacity onPress={() => router.push("/managerScreens/managerHome")}>
        <Text className="text-white">📅 Schedule</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/managerScreens/managerHome")}>
        <Text className="text-white">⚙️ Operations</Text>
      </TouchableOpacity>
    </View>
  );
}
