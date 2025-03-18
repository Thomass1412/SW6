import React, { useLayoutEffect, useState, useEffect, useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import ShiftList from "../../../components/shiftList";
import dayjs from 'dayjs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

export default function DailySchedule() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedDate, setLastFetchedDate] = useState('');
  const router = useRouter();
  const navigation = useNavigation();
  const { date } = useLocalSearchParams();

  const selectedDate = useMemo(() => {
    return dayjs(date ? String(date) : dayjs().format('YYYY-MM-DD'));
  }, [date]);

  useEffect(() => {
    const fetchShifts = async () => {
      if (lastFetchedDate === selectedDate.format('YYYY-MM-DD')) {
        console.log("🔸 Skipping fetch, same date as last request.");
        return; 
      }

      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found!");
          return;
        }

        const formattedDate = selectedDate.format('YYYY-MM-DD');
        console.log(`📅 Fetching shifts for date: ${formattedDate}`);

        const response = await fetch(`http://192.168.0.154:5000/shifts/my-shifts?date=${formattedDate}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch shifts: ${response.status}`);
          return;
        }

        const data = await response.json();
  
        setShifts(data);
        setLastFetchedDate(formattedDate); 
      } catch (error) {
        console.error("Error fetching shifts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [selectedDate]); 

  const goToPreviousDay = useCallback(() => {
    const prevDate = selectedDate.subtract(1, 'day').format('YYYY-MM-DD');
    router.replace(`/admin/(tabs)/dailySchedule?date=${prevDate}`);
  }, [selectedDate, router]);

  const goToNextDay = useCallback(() => {
    const nextDate = selectedDate.add(1, 'day').format('YYYY-MM-DD');
    router.replace(`/admin/(tabs)/dailySchedule?date=${nextDate}`);
  }, [selectedDate, router]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#F7CB8C' },
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 85 }}>
          {selectedDate.format('DD MMMM YYYY')}
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={goToPreviousDay} style={{ marginLeft: 25 }}>
          <Text style={{ fontSize: 30 }}>◀</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={goToNextDay} style={{ marginRight: 25 }}>
          <Text style={{ fontSize: 30 }}>▶</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedDate, goToPreviousDay, goToNextDay]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  const styles = StyleSheet.create({
    button: {
      backgroundColor: "#FFDDAD",
      padding: 10,
      marginVertical: 10,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 2, 
      borderColor: "#000",
    },
    floatingButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      backgroundColor: '#F7CB8C',
      padding: 15,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2, 
      borderColor: '#000',
    },
    floatingButtonText: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 5, 
    },
  });

  return (
    <View style={{ backgroundColor: '#FFFAE8', flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}></Text>
        <ShiftList shifts={shifts} />
      </View>
      <TouchableOpacity style={styles.floatingButton} onPress={() => alert('This takes you to unavailability page')}>
        <Ionicons name="add" size={30} color="#000" />
        <Text style={styles.floatingButtonText}>Unavailability</Text>
      </TouchableOpacity>
    </View>
  );
}
