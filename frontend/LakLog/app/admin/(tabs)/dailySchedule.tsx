import React, { useLayoutEffect, useState, useEffect, useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import ShiftList from "../../../components/shiftList";
import CustomButton from '../../../components/CustomButton';
import dayjs from 'dayjs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

export default function DailySchedule() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedDate, setLastFetchedDate] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const { date } = useLocalSearchParams();

  const selectedDate = useMemo(() => {
    return dayjs(date ? String(date) : dayjs().format('YYYY-MM-DD'));
  }, [date]);

  useEffect(() => {
    const fetchShifts = async () => {
      if (lastFetchedDate === selectedDate.format('YYYY-MM-DD')) {
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

        const response = await fetch(`http://192.168.0.154:5000/shifts/all-date?date=${formattedDate}`, {
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

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem("userRole"); 
        setIsAdmin(role === "admin");
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
  
    fetchUserRole();
  }, []);

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
      headerStyle: { height: 80, backgroundColor: '#F7CB8C' },
      headerTitleAlign: "center",
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontWeight: 'bold'}}>
          {selectedDate.format('DD MMMM YYYY')}
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={goToPreviousDay} style={{ marginLeft: 35 }}>
          <Ionicons name="arrow-back" size={34} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={goToNextDay} style={{ marginRight: 35 }}>
          <Ionicons name="arrow-forward" size={34} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedDate, goToPreviousDay, goToNextDay]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={{ backgroundColor: '#FFFAE8', flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}></Text>
        <ShiftList shifts={shifts} isAdmin={true} />
      </View>
      <CustomButton 
        onPress={() => router.push(`/admin/createShift?date=${selectedDate.format("YYYY-MM-DD")}`)}  
        iconName="add" 
        text="New Shift"
        position={{ bottom: 30, right: 30 }}
      />
    </View>
  );
}
