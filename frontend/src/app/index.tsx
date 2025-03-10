import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome 3to Home Screen!</Text>
      <Button title="Go to Login" onPress={() => router.push("./login")} />
    </View>
  );
}