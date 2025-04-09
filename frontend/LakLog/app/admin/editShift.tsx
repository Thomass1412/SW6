import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Button, Alert, Platform,
} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import dayjs from 'dayjs';

const locations = ["Lokation A", "Lokation B", "Lokation C", "Silkeborggade 21"];
const jobTitles = ["Licorice Making", "Licorice Selling", "Cleaning Machines"];
const statuses = ["scheduled", "signed-in", "completed", "canceled", "unavailability"];

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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Update Shift',
      headerStyle: { backgroundColor: '#F7CB8C', height: 80 },
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  useEffect(() => {
    const fetchShift = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await fetch(`http://192.168.0.154:5000/shifts/${id}`, {
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
    const response = await fetch(`http://192.168.0.154:5000/shifts/${id}`, {
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <Button title={dayjs(date).format('YYYY-MM-DD')} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selectedDate) => {
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

      <Button title="Update Shift" onPress={handleSubmit} />
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
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
  },
});
