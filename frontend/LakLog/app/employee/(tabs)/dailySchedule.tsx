import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import ShiftList from "../../../components/shiftList";
import dayjs from 'dayjs';

export default function EmployeeDailySchedule() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();
  const { date } = useLocalSearchParams();

  // Ensure date is always valid
  const selectedDate = dayjs(date ? String(date) : dayjs().format('YYYY-MM-DD'));

  // Fetch shifts when date changes
  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://192.168.0.154:5000/shifts/my-shifts");
        const data = await response.json();
        setShifts(data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [date]);

  // Navigation functions memoized
  const goToPreviousDay = useCallback(() => {
    const prevDate = selectedDate.subtract(1, 'day').format('YYYY-MM-DD');
    router.replace(`/employee/(tabs)/dailySchedule?date=${prevDate}`);
  }, [selectedDate, router]);

  const goToNextDay = useCallback(() => {
    const nextDate = selectedDate.add(1, 'day').format('YYYY-MM-DD');
    router.replace(`/employee/(tabs)/dailySchedule?date=${nextDate}`);
  }, [selectedDate, router]);

  // Set navigation options
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
