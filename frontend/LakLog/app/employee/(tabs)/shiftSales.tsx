import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { BaseURL } from "../../../config/api";
import dayjs from 'dayjs';

type Employee = {
  name?: string;
  email?: string;
  _id?: string;
};

type Shift = {
  _id: string;
  jobTitle: string;
  start: string;
  end: string;
  employee: Employee;
};

type SaleShiftCardProps = {
  shift: Shift;
  onPress: (shift: Shift) => void;
};

const SaleShiftCard: React.FC<SaleShiftCardProps> = ({ shift, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(shift)}
    activeOpacity={0.85}
  >
    <Text style={styles.title}>{shift.jobTitle}</Text>
    <Text style={styles.time}>
      {dayjs(shift.start).format('DD MMM YYYY, HH:mm')} – {dayjs(shift.end).format('HH:mm')}
    </Text>
    <Text style={styles.postedBy}>
      Posted by: {shift.employee?.name || "Unknown"}
    </Text>
  </TouchableOpacity>
);

export default function ShiftSales() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#F7CB8C' },
      headerTitle: 'Shifts for Sale',
      headerTitleAlign: 'center',
      
    });
  }, [navigation]);

  useEffect(() => {
    const fetchShiftsForSale = async () => {
      setLoading(true);
      setError('');
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) throw new Error("No token found!");

        const response = await fetch(`${BaseURL}/shifts/forSale`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        setShifts(data);
      } catch (err: any) {
        setError(err.message || "Could not fetch shifts for sale.");
      } finally {
        setLoading(false);
      }
    };

    fetchShiftsForSale();
  }, []);

  // Handler to accept a shift with double confirmation
  const handleAcceptShift = useCallback((shift: Shift) => {
    Alert.alert(
      "Accept this shift?",
      `Do you want to take this shift as your own?\n\n${shift.jobTitle}\n${dayjs(shift.start).format('DD MMM YYYY, HH:mm')} – ${dayjs(shift.end).format('HH:mm')}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            // Second confirmation
            Alert.alert(
              "Are you sure?",
              "This action cannot be undone.",
              [
                { text: "No", style: "cancel" },
                {
                  text: "Yes, take shift",
                  style: "destructive",
                  onPress: () => confirmAcceptShift(shift._id)
                }
              ]
            );
          }
        }
      ]
    );
  }, []);

  // Backend call to accept the shift
  // Backend call to accept the shift
  // Backend call to accept the shift
  const confirmAcceptShift = async (shiftId: string) => {
    setAccepting(true);
    try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) throw new Error("No token found!");

        const response = await fetch(`${BaseURL}/shifts/claim/${shiftId}`, {
        method: "PATCH", // <--- PATCH, not POST
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        });

        if (!response.ok) {
        // Try to parse JSON error if possible, fallback to plain text
        let errMsg = "";
        try {
            const errorData = await response.json();
            errMsg = errorData.error || "";
        } catch {
            errMsg = await response.text();
        }
        throw new Error(errMsg || "Failed to claim shift.");
        }

        // Remove the shift from the list after success
        setShifts(prev => prev.filter(s => s._id !== shiftId));
        Alert.alert("Success", "You have taken this shift.");
    } catch (err: any) {
        Alert.alert("Error", err.message || "Could not claim the shift.");
    } finally {
        setAccepting(false);
    }
};



  if (loading || accepting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f28a0a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: '#FFFAE8', flex: 1, paddingHorizontal: 10, paddingTop: 16 }}>
      {shifts.length === 0 ? (
        <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: 'center' }}>
          No shifts for sale
        </Text>
      ) : (
        <FlatList
          data={shifts}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <SaleShiftCard shift={item} onPress={handleAcceptShift} />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFAE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF6DF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  time: {
    fontSize: 16,
    color: '#8E7B60',
    marginBottom: 4,
  },
  postedBy: {
    fontSize: 14,
    color: '#676767',
  }
});
