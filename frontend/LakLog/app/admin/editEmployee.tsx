import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseURL} from "../../config/api";

const availableRoles = ["Licorice Making", "Licorice Selling", "Cleaning Machines"];

export default function CreateEmployeeScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'New Employee',
      headerStyle: {
        backgroundColor: '#F7CB8C',
        height: 80,
      },
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
      },
    });
  }, [navigation]);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const handleCreate = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found!");
        return;
      }
  
      const response = await fetch(`${BaseURL}/auth/signup`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          jobTitle: selectedRoles,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Employee created:", result);
        Alert.alert("Success", "Employee created successfully!");
        router.back();
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "Failed to create employee.");
      }
    } catch (error) {
      console.error("Failed to create employee", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };


  const isFormValid =
    name &&
    email.trim() &&
    phone.trim();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Roles</Text>
      {availableRoles.map((role) => (
        <TouchableOpacity
          key={role}
          style={styles.checkboxContainer}
          onPress={() => toggleRole(role)}
        >
          <Text style={styles.checkboxLabel}>{role}</Text>
          <Ionicons
            name={selectedRoles.includes(role) ? "checkbox" : "square-outline"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.createButton, { opacity: isFormValid ? 1 : 0.5 }]}
        onPress={handleCreate}
        disabled={!isFormValid}>
        <Text style={styles.createButtonText}>Create Employee</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7E6',
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: '#FFFBEE',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-between',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  createButton: {
    marginTop: 30,
    backgroundColor: '#F7CB8C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
