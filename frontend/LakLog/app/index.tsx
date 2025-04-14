import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../config/firebase";
import { API_URL } from "../config/ipconfig"


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  const handleLogin = async () => {
    setLoading(true);
    setError(""); 
    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const idToken = await userCredential.user.getIdToken();
      console.log("Got ID Token:", idToken);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('user', JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          jobTitle: data.user.jobTitle,
        }));

        router.replace(data.redirect);
      } else {
        setError(data.error || "Login failed"); 
      }
    } catch (error) {
      if ((error as { code: string }).code === "auth/invalid-credential" || (error as { code: string }).code === "auth/invalid-email") {
        setError("Invalid email or password");
      } else {
        console.error(error);
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Sign in"}</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{String(error)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAE8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#F7CB8C",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
