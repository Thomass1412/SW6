import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {BaseURL} from "../../../config/api";
import { Shift } from '../../../types';

export default function OperationsScreen() {
  const navigation = useNavigation();
  const router = useRouter(); 

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Operations",
      headerStyle: {
        height: 80,
        backgroundColor: '#F7CB8C',
      },
      headerTitleAlign: "center",
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 25,
      },
    });
  }, [navigation]);

  const handleGenerateReport = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No access token found.");
        return;
      }
  
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const fromDate = oneMonthAgo.toISOString().split("T")[0];
  
      const response = await fetch(`${BaseURL}/shifts/completed?from=${fromDate}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Backend returned error: ${response.status} - ${errText}`);
      }
  
      const shifts = await response.json();
  
      const csvHeaders = 'Date,Employee,Location,Job Title,Start Time,End Time\n';
      const csvRows = shifts.map((shift: Shift) => {
        const date = shift.date?.split('T')[0] || '';
        const employee = shift.employee?.name || '';
        const location = shift.location || '';
        const jobTitle = shift.jobTitle || '';
        const startTime = shift.startTime || '';
        const endTime = shift.endTime || '';
        return `${date},${employee},${location},${jobTitle},${startTime},${endTime}`;
      });
  
      const csvString = csvHeaders + csvRows.join('\n');
  
      const fileUri = FileSystem.documentDirectory + 'completed_shifts_report.csv';
      await FileSystem.writeAsStringAsync(fileUri, csvString, { encoding: FileSystem.EncodingType.UTF8 });
  
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Report Generation Failed', error.message || 'Unknown error');
      } else {
        Alert.alert('Report Generation Failed', 'Unknown error');
      }
    }
  };
  

  const handlePress = (page: string) => {
    Alert.alert(`This takes you to the ${page} page`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/admin/employeesPage")}>
        <Text style={styles.buttonText}>Employees</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.button} onPress={() => handlePress("Shift Types")}>
        <Text style={styles.buttonText}>Shift Types</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.button} onPress={() => handlePress("Lokations")}>
        <Text style={styles.buttonText}>Lokations</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          try {
            await handleGenerateReport();
          } catch (err) {
            console.error("Unexpected error in button press:", err);
          }
        }}
      >
        <Text style={styles.buttonText}>Generate Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7E6',
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    width: '85%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 23,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '85%',
  },
});
