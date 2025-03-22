import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";

export default function CreateShift() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("None");
  const [jobTitle, setJobTitle] = useState("None");
  const [repeat, setRepeat] = useState("none");
  const [employees, setEmployees] = useState<{ _id: string; name: string }[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("none");
  const { date: rawPrefillDate } = useLocalSearchParams();
  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");

  useEffect(() => {
    const resolvedDate = Array.isArray(rawPrefillDate) ? rawPrefillDate[0] : rawPrefillDate;
    if (resolvedDate) {
      const parsed = dayjs(resolvedDate);
      if (parsed.isValid()) {
        setDate(parsed.toDate());
      }
    }
  }, [rawPrefillDate]);

  const validateTime = (value: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

  useEffect(() => {
    const fetchEmployees = async (jobTitle?: string) => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found!");
          return;
        }
    
        let url = "http://192.168.0.154:5000/users/employees";
        if (jobTitle && jobTitle !== "None") {
          url += `?jobTitle=${encodeURIComponent(jobTitle)}`;
        }
    
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        const text = await response.text();
    
        try {
          const data = JSON.parse(text);
          setEmployees(data);
        } catch (e) {
          console.error("Invalid JSON response:", text);
        }
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };
  
    fetchEmployees(jobTitle);
  }, [jobTitle]);

  const handleSubmit = async () => {
    const shiftData = {
      ...(selectedEmployee !== "none" && { employee: selectedEmployee }),
      date: date.toISOString(),
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

  const handleJobTitleChange = (title: string) => {
    setJobTitle(title);
    setSelectedEmployee("none");
  };

  const showDatepicker = () => setShowDatePicker(true);

  const isFormValid =
    date &&
    startTime.trim() &&
    endTime.trim() &&
    location.trim() &&
    jobTitle.trim() &&
    repeat.trim() &&
    validateTime(startTime) &&
    validateTime(endTime);

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

      <Text style={styles.label}>Start Time (Hour:Minute)</Text>
      <TextInput
        style={styles.input}
        value={startTime}
        onChangeText={(value) => {
          setStartTime(value);
          setStartTimeError(validateTime(value) ? "" : "Invalid time (HH:MM)");
        }}/>
      {startTimeError ? <Text style={styles.error}>{startTimeError}</Text> : null}

      <Text style={styles.label}>End Time (Hour:Minute)</Text>
      <TextInput
        style={styles.input}
        value={endTime}
        onChangeText={(value) => {
          setEndTime(value);
          setEndTimeError(validateTime(value) ? "" : "Invalid time (HH:MM)");
        }}/>
      {endTimeError ? <Text style={styles.error}>{endTimeError}</Text> : null}

      <Text style={styles.label}>Location</Text>
      <Picker selectedValue={location} onValueChange={setLocation} style={styles.picker}>
        <Picker.Item label="None" value="" />
        <Picker.Item label="Lokation A" value="Lokation A" />
        <Picker.Item label="Lokation B" value="Lokation B" />
        <Picker.Item label="Lokation C" value="Lokation C" />
      </Picker>

      <Text style={styles.label}>Job Title</Text>
      <Picker selectedValue={jobTitle} onValueChange={handleJobTitleChange} style={styles.picker}>
      <Picker.Item label="None" value="None" />
        <Picker.Item label="Licorice Making" value="Licorice Making" />
        <Picker.Item label="Licorice Selling" value="Licorice Selling" />
        <Picker.Item label="Cleaning Machines" value="Cleaning Machines" />
      </Picker>

      <Text style={styles.label}>Assign to Employee (Optional)</Text>
      <Picker
        selectedValue={selectedEmployee}
        onValueChange={(value) => setSelectedEmployee(value)}
        style={styles.picker}
      >
        <Picker.Item label="None" value="none" />
        {employees.map((emp) => (
          <Picker.Item key={emp._id} label={emp.name} value={emp._id} />
        ))}
      </Picker>

      <Text style={styles.label}>Repeat (Next 4 Weeks)</Text>
      <Picker selectedValue={repeat} onValueChange={setRepeat} style={styles.picker}>
        <Picker.Item label="None" value="" />
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Bi-Weekly" value="bi-weekly" />
        <Picker.Item label="Monthly" value="monthly" />
      </Picker>

      <TouchableOpacity
        style={[styles.button, { opacity: isFormValid ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!isFormValid}>
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
  error: {
    color: "red",
    marginTop: 5,
    fontSize: 13,
  }
});
