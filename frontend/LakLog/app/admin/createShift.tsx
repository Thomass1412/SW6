import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Switch } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import {BaseURL} from "../../config/api";
import { Shift } from "../../types";

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
  const navigation = useNavigation();
  const router = useRouter();
  const [shiftsOnSelectedDate, setShiftsOnSelectedDate] = useState<Shift[]>([]);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Shift",
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
  
  const timesOverlap = (startA: string, endA: string, startB: string, endB: string): boolean => {
    return !(endA <= startB || startA >= endB);
  };
  
  useEffect(() => {
    const fetchShiftsForDate = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found!");
          return;
        }
  
        const selectedDateFormatted = dayjs(date).format("YYYY-MM-DD");
  
        const response = await fetch(`${BaseURL}/shifts/all-date?date=${selectedDateFormatted}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();
        setShiftsOnSelectedDate(data);
      } catch (error) {
        console.error("Failed to fetch shifts for selected date", error);
      }
    };
  
    if (date) {
      fetchShiftsForDate();
    }
  }, [date, startTime, endTime]);

  const availableEmployees = employees.filter((emp) => {
    const employeeShifts = shiftsOnSelectedDate.filter(
      (shift) => shift.employee?._id === emp._id
    );
  
    if (employeeShifts.length === 0) return true;
  
    if (!startTime || !endTime) return true;
  
    return !employeeShifts.some((shift) =>
      timesOverlap(shift.startTime, shift.endTime, startTime, endTime)
    );
  });
  

  const validateTime = (value: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

  useEffect(() => {
    const fetchEmployees = async (jobTitle?: string) => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found!");
          return;
        }
    
        let url = `${BaseURL}/users/employees`;
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

    const fixedDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
    const shiftData = {
      ...(selectedEmployee !== "none" && { employee: selectedEmployee }),
      date: fixedDate.toISOString(),
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

      const response = await fetch(`${BaseURL}/shifts/create`, {
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
        <Picker.Item label="Bagsværd Hovedgade 122" value="Bagsværd Hovedgade 122" />
        <Picker.Item label="Ankervej 1" value="Ankervej 1" />
        <Picker.Item label="A. C. Meyers Vænge 15" value="A. C. Meyers Vænge 15" />
        <Picker.Item label="Silkeborggade 21" value="Silkeborggade 19" />
      </Picker>

      <Text style={styles.label}>Job Title</Text>
      <Picker selectedValue={jobTitle} onValueChange={handleJobTitleChange} style={styles.picker}>
      <Picker.Item label="None" value="None" />
        <Picker.Item label="Licorice Maker" value="Licorice Maker" />
        <Picker.Item label="Production" value="Production" />
      </Picker>

      <Text style={styles.label}>Assign to Employee (Optional)</Text>
      <Picker
        selectedValue={selectedEmployee}
        onValueChange={(value) => setSelectedEmployee(value)}
        style={styles.picker}
      >
        <Picker.Item label="None" value="none" />
        {availableEmployees.map((emp) => (
          <Picker.Item key={emp._id} label={emp.name} value={emp._id} />
        ))}
      </Picker>

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
    backgroundColor: '#FFFBEE',
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
