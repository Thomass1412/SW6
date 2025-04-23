import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Button, Alert, Platform, TouchableOpacity
} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import dayjs from 'dayjs';
import { API_URL } from "@env";

const locations = ["Lokation A", "Lokation B", "Lokation C", "Silkeborggade 21"];
const jobTitles = ["Licorice Making", "Licorice Selling", "Cleaning Machines"];
const statuses = ["scheduled", "signed-in", "completed", "canceled"];

export default function UpdateShiftScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [shift, setShift] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateTime = (value: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Edit Shift',
      headerStyle: { backgroundColor: '#F7CB8C', height: 80 },
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  useEffect(() => {
    const fetchShift = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/shifts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setShift(data);
      setDate(dayjs(data.date).toDate());
      setStartTime(data.startTime);
      setEndTime(data.endTime);
      setLocation(data.location);
      setJobTitle(data.jobTitle);
      setStatus(data.status);
    };

    fetchShift();
  }, [id]);

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/shifts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date,
        startTime,
        endTime,
        location,
        jobTitle,
        status,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      Alert.alert("Success", "Shift updated successfully!");
      router.back();
    } else {
      Alert.alert("Error", result.message || "Failed to update shift.");
    }
  };

  if (!shift) return <Text>Loading shift...</Text>;

  const isFormValid =
    date &&
    startTime.trim() &&
    endTime.trim() &&
    location.trim() &&
    jobTitle.trim() &&
    validateTime(startTime) &&
    validateTime(endTime);


  return (
    <View style={styles.container}>
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

      <Text style={styles.label}>Start Time (HH:MM)</Text>
      <TextInput value={startTime} onChangeText={setStartTime} style={styles.input} />

      <Text style={styles.label}>End Time (HH:MM)</Text>
      <TextInput value={endTime} onChangeText={setEndTime} style={styles.input} />

      <Text style={styles.label}>Location</Text>
      <Picker selectedValue={location} onValueChange={setLocation}>
        {locations.map(loc => <Picker.Item key={loc} label={loc} value={loc} />)}
      </Picker>

      <Text style={styles.label}>Job Title</Text>
      <Picker selectedValue={jobTitle} onValueChange={setJobTitle}>
        {jobTitles.map(title => <Picker.Item key={title} label={title} value={title} />)}
      </Picker>

      <Text style={styles.label}>Status</Text>
      <Picker selectedValue={status} onValueChange={setStatus}>
        {statuses.map(stat => <Picker.Item key={stat} label={stat} value={stat} />)}
      </Picker>

      <TouchableOpacity
            style={[styles.createButton, { opacity: isFormValid ? 1 : 0.5 }]}
            onPress={handleSubmit}
            disabled={!isFormValid}>
            <Text style={styles.createButtonText}>Update Shift</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF7E6',
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#FFFBEE',
    padding: 10,
    marginBottom: 10,
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
