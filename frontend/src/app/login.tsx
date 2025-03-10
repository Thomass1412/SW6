import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../axiosConfig"; // relative path import
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { auth } from "../utils/firebaseConfig"; // Import Firebase config

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const handleLogin = async () => {
        setError(""); // Clear previous errors

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            // Sign in with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            //console.log("Firebase Token:", idToken);

            // Send ID Token to Backend using axios instance
            const response = await api.post("/auth/login", { idToken });
            const { accessToken, user, redirect } = response.data;

            // Store token securely (use SecureStorage in production)
            await AsyncStorage.setItem("authToken", accessToken);
            
            router.push(redirect); // Redirect to the URL sent by the backend
        
            
        } catch (error) {
            setError(""+error);
        } 
    };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} onChangeText={setEmail} />
      <Text>Password:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={() => {handleLogin();}} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}
