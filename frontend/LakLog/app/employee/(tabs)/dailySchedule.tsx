import React, { useLayoutEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import dayjs from 'dayjs';

export default function EmployeeDailySchedule() {
  const router = useRouter();
  const navigation = useNavigation();
  const { date } = useLocalSearchParams();

  // Convert the selected date into a dayjs object
  const selectedDate = dayjs(date as string);

  // Functions to navigate to previous or next day
  const goToPreviousDay = () => {
    const prevDate = selectedDate.subtract(1, 'day').format('YYYY-MM-DD');
    router.replace(`/employee/(tabs)/dailySchedule?date=${prevDate}`);
  };

  const goToNextDay = () => {
    const nextDate = selectedDate.add(1, 'day').format('YYYY-MM-DD');
    router.replace(`/employee/(tabs)/dailySchedule?date=${nextDate}`);
  };

  // Set the header title and add navigation arrows
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {selectedDate.format('DD MMMM YYYY')}
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={goToPreviousDay} style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: 18 }}>◀</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={goToNextDay} style={{ marginRight: 15 }}>
          <Text style={{ fontSize: 18 }}>▶</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedDate]);

  return null; // No need for a visible header in the page body
}
