import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Switch } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";

export default function CreateShift() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeat, setRepeat] = useState("none");
  const { date: rawPrefillDate } = useLocalSearchParams();
  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");
  const navigation = useNavigation();
  const router = useRouter();


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Unavailability",
      headerStyle: { height: 80, backgroundColor: '#F7CB8C' },
      headerTitleAlign: "center",
    });
  }, [navigation]);

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

  const handleSubmit = async () => {
    const shiftData = {
      date: date.toISOString(),
      startTime,
      endTime,
      status: "scheduled",
      repeat,
    };

    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found!");
        return;
      }

      const response = await fetch("http://192.168.0.154:5000/shifts/new-unavailability", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shiftData),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Unavailability created successfully");
        setStartTime("");
        setEndTime("");
        setRepeat("none");
        router.back();
      } else {
        Alert.alert("Error", result.error || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", "Network error");
    }
  };



  const isFormValid =
    date &&
    startTime.trim() &&
    endTime.trim() &&
    validateTime(startTime) &&
    validateTime(endTime);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
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

      <Text style={styles.label}>Repeat Weekly for 4 Weeks</Text>
      <View style={styles.switchContainer}>
      <Switch
        value={repeat === "weekly"}
        onValueChange={(value) => setRepeat(value ? "weekly" : "")}
        trackColor={{ false: "#ccc", true: "#F7CB8C" }}
        thumbColor={repeat === "weekly" ? "#FF9900" : "#f4f3f4"}/>
        <Text>{repeat === "weekly" ? "Yes" : "No"}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { opacity: isFormValid ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!isFormValid}>
        <Text style={styles.buttonText}>Submit Unavailability</Text>
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
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
