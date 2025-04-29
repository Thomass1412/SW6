import React, { useLayoutEffect, useState, useEffect, useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import ShiftList from "../../../components/shiftList";
import CustomButton from '../../../components/CustomButton';
import dayjs from 'dayjs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import {BaseURL} from "../../../config/api";

export default function DailySchedule() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedDate, setLastFetchedDate] = useState('');
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter();
  const navigation = useNavigation();
  const { date } = useLocalSearchParams();


  const selectedDate = useMemo(() => {
    return dayjs(date ? String(date) : dayjs().format('YYYY-MM-DD'));
  }, [date]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem("userRole"); 
        setIsAdmin(role === "user");
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
  
    fetchUserRole();
  }, []);

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

        const response = await fetch(`${BaseURL}/shifts/my-shifts?date=${formattedDate}`, {
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
    router.replace(`/employee/(tabs)/dailySchedule?date=${prevDate}`);
  }, [selectedDate, router]);

  const goToNextDay = useCallback(() => {
    const nextDate = selectedDate.add(1, 'day').format('YYYY-MM-DD');
    router.replace(`/employee/(tabs)/dailySchedule?date=${nextDate}`);
  }, [selectedDate, router]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#F7CB8C' },
      headerTitleAlign: 'center', 
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

const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      backgroundColor: '#FFFAE8',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f28a0a" />
      </View>
    );
  }

  
  return (
    <View style={{ backgroundColor: '#FFFAE8', flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}></Text>
        <ShiftList shifts={shifts} isAdmin={isAdmin} />
      </View>
      <CustomButton 
        onPress={() => router.push(`/employee/createUnavailability?date=${selectedDate.format("YYYY-MM-DD")}`)}  
        iconName="add" 
        text="New Unavailability"
        position={{ bottom: 30, right: 30 }}
        />
    </View>
  );
}
