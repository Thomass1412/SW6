import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert} from "react-native";
import axios from "axios";
import api from "../axiosConfig"; //relative path import

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
        setError("Email and password are required");
        return;
    }
    try {
        const response = await api.post("/login", { email, password });


        router.push("/employeeScreens/home"); 
        if (response.data.role == "Admin") {
          router.push("/managerScreens/home"); 
        } 

        if (response.data.role == "Employee") {
          router.push("/employeeScreens/home");
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            setError(error.response.data.message);
        } else {
            setError("An unexpected error occurred");
        }
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
