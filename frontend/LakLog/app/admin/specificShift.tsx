import React, { useLayoutEffect, useState, useEffect } from 'react';
import {TouchableOpacity, Text, View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { API_URL } from "@env";

export default function AdminShiftDetails() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [shift, setShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchShift = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await fetch(`${API_URL}/shifts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setShift(data);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to load shift data.");
      } finally {
        setLoading(false);
      }
    };

    fetchShift();
  }, []);

  useLayoutEffect(() => {
    if (shift?.employee?.name) {
      navigation.setOptions({
        title: shift.employee.name,
        headerStyle: { height: 80, backgroundColor: '#F7CB8C' },
        headerTitleAlign: 'center',
      });
    }
  }, [navigation, shift]);

  if (loading || !shift) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F7CB8C" />
        <Text style={styles.loadingText}>Loading shift details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.shiftBox}>
        <Text style={styles.timeText}>{shift.startTime} - {shift.endTime}</Text>
        <Text style={styles.dateText}>{dayjs(shift.date).format('DD-MM-YYYY')}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{shift.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Shift Type</Text>
          <Text style={styles.value}>{shift.jobTitle}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{shift.status}</Text>
        </View>

        {shift.employee && (
          <View style={styles.section}>
            <Text style={styles.label}>Assigned Employee</Text>
            <Text style={styles.value}>{shift.employee.name}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {router.push(`/admin/editShift?id=${id}`);}}>
        <Text style={styles.buttonText}>Update Shift</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
            Alert.alert(
            "Delete Shift",
            "Are you sure you want to delete this shift?",
            [
                { text: "Cancel", style: "cancel" },
                {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                    const token = await AsyncStorage.getItem("accessToken");
                    const res = await fetch(`${API_URL}/shifts/delete/${shift._id}`, {
                        method: "DELETE",
                        headers: {
                        Authorization: `Bearer ${token}`,
                        },
                    });

                    const result = await res.json();
                    if (res.ok) {
                        Alert.alert("Deleted", result.message);
                        navigation.goBack(); 
                    } else {
                        Alert.alert("Error", result.error || "Failed to delete shift.");
                    }
                    } catch (err) {
                    console.error(err);
                    Alert.alert("Error", "Network error while deleting shift.");
                    }
                },
                },
            ]
            );
        }}
        >
        <Text style={styles.deleteText}>Delete Shift</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E6",
    alignItems: "center",
    paddingTop: 50,
  },
  shiftBox: {
    backgroundColor: "#FFF7E6",
    padding: 25,
    width: "85%",
    marginTop: 30,
  },
  timeText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  section: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    color: "#888",
  },
  value: {
    fontSize: 16,
    color: "#000",
    marginTop: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7E6',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  deleteText: {
    color: "#FF0000",
    textAlign: "center",
    fontSize: 15,
    marginTop: 20,
    textDecorationLine: "underline",
    fontWeight: "500",
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
