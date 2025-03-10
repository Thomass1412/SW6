import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios from "axios";
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
            console.log("Firebase Token:", idToken);
            //Send ID Token to Backend
            const response = await fetch("http://192.168.0.154:5000/auth/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ idToken }),
            });
            console.log("API Response:", response);
            const text = await response.text(); // Log raw response before parsing
            console.log("Raw Response:", text); // Debug API response
  
            const data = JSON.parse(text); // Try parsing JSON
            console.log("Parsed Response:", data);
            
        } catch (error) {
            console.error("Firebase Auth Error:", error);
      } finally {
        console.log("Login complete.");
      }
    };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} onChangeText={setEmail} />
      <Text>Password:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={() => {console.log("Login button pressed");  handleLogin(); }} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}
