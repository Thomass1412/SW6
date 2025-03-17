import React, { useLayoutEffect, useState, useEffect, useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import ShiftList from "../../../components/shiftList";
import dayjs from 'dayjs';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    router.replace(`/employee/(tabs)/dailySchedule?date=${prevDate}`);
  }, [selectedDate, router]);

  const goToNextDay = useCallback(() => {
    const nextDate = selectedDate.add(1, 'day').format('YYYY-MM-DD');
    router.replace(`/employee/(tabs)/dailySchedule?date=${nextDate}`);
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

  return (
    <View style={{ backgroundColor: '#FFFAE8', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Today's Shifts</Text>
      <ShiftList shifts={shifts} />
    </View>
  );
}
