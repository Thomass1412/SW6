import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function CreateShift() {
  const [date, setDate] = useState("Select Date");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [jobTitle, setJobTitle] = useState("Licorice Making");
  const [status, setStatus] = useState("scheduled");
  const [repeat, setRepeat] = useState("none");

  const handleSubmit = async () => {
    const shiftData = {
      date,
      startTime,
      endTime,
      location,
      jobTitle,
      status,
      repeat,
    };

    try {
      const response = await fetch("https://192.168.0.154:5000/shifts/create", {
        method: "POST",
        headers: {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select Date</Text>
      <Picker selectedValue={date} onValueChange={(value) => setDate(value)} style={styles.picker}>
        <Picker.Item label="Select Date" value="Select Date" />
        <Picker.Item label="Today" value="Today" />
        <Picker.Item label="Tomorrow" value="Tomorrow" />
        <Picker.Item label="Next Week" value="Next Week" />
      </Picker>

      <Text style={styles.label}>Start Time</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM"
        value={startTime}
        onChangeText={setStartTime}
      />

      <Text style={styles.label}>End Time</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM"
        value={endTime}
        onChangeText={setEndTime}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Job Title</Text>
      <Picker selectedValue={jobTitle} onValueChange={(value) => setJobTitle(value)} style={styles.picker}>
        <Picker.Item label="Licorice Making" value="Licorice Making" />
        <Picker.Item label="Licorice Selling" value="Licorice Selling" />
        <Picker.Item label="Cleaning Machines" value="Cleaning Machines" />
      </Picker>

      <Text style={styles.label}>Status</Text>
      <Picker selectedValue={status} onValueChange={(value) => setStatus(value)} style={styles.picker}>
        <Picker.Item label="Scheduled" value="scheduled" />
        <Picker.Item label="Completed" value="completed" />
        <Picker.Item label="Canceled" value="canceled" />
      </Picker>

      <Text style={styles.label}>Repeat</Text>
      <Picker selectedValue={repeat} onValueChange={(value) => setRepeat(value)} style={styles.picker}>
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
    backgroundColor: "#fff",
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
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
