import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateShift() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [location, setLocation] = useState("Lokation A");
  const [jobTitle, setJobTitle] = useState("Licorice Making");
  const [repeat, setRepeat] = useState("none");

  // TEMP: Hardcoded employee ID (should come from a picker or auth context)
  const employeeId = "67ce9a90534573f3bca2d814";

  const handleSubmit = async () => {
    const shiftData = {
      employee: employeeId,
      date: date.toISOString(), // ISO string to match backend format
      startTime,
      endTime,
      location,
      jobTitle,
      status: "scheduled",
      repeat,
    };

    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found!");
        return;
      }

      const response = await fetch("http://192.168.0.154:5000/shifts/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shiftData),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Shift created successfully");
      } else {
        Alert.alert("Error", result.error || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", "Network error");
    }
  };

  const showDatepicker = () => setShowDatePicker(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity style={styles.input} onPress={showDatepicker}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Start Time (HH:MM)</Text>
      <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} />

      <Text style={styles.label}>End Time (HH:MM)</Text>
      <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} />

      <Text style={styles.label}>Location</Text>
      <Picker selectedValue={location} onValueChange={setLocation} style={styles.picker}>
        <Picker.Item label="Lokation A" value="Lokation A" />
        <Picker.Item label="Lokation B" value="Lokation B" />
        <Picker.Item label="Lokation C" value="Lokation C" />
      </Picker>

      <Text style={styles.label}>Job Title</Text>
      <Picker selectedValue={jobTitle} onValueChange={setJobTitle} style={styles.picker}>
        <Picker.Item label="Licorice Making" value="Licorice Making" />
        <Picker.Item label="Licorice Selling" value="Licorice Selling" />
        <Picker.Item label="Cleaning Machines" value="Cleaning Machines" />
      </Picker>

      <Text style={styles.label}>Repeat</Text>
      <Picker selectedValue={repeat} onValueChange={setRepeat} style={styles.picker}>
        <Picker.Item label="None" value="none" />
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Bi-Weekly" value="bi-weekly" />
        <Picker.Item label="Monthly" value="monthly" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Shift</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFFAE8",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  picker: {
    marginTop: 5,
  },
  button: {
    backgroundColor: "#F7CB8C",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
