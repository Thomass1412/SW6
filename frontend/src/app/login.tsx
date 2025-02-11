import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (email === "test@example.com" && password === "password") {
      router.push("./protected");
    } else {
      Alert.alert("Invalid Credentials", "Please try again.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} onChangeText={setEmail} />
      <Text>Password:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
