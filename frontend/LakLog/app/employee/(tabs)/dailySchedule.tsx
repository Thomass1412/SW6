import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import dayjs from 'dayjs';

export default function EmployeeDailySchedule() {
  const router = useRouter();
  const { date } = useLocalSearchParams(); // Get the date from query params

  // Convert date to dayjs object for easy manipulation
  const selectedDate = dayjs(date as string);

  // Functions to go to next/prev day
  const goToPreviousDay = () => {
    const prevDate = selectedDate.subtract(1, 'day').format('YYYY-MM-DD');
    router.replace(`/employee/(tabs)/dailySchedule?date=${prevDate}`);
  };

  const goToNextDay = () => {
    const nextDate = selectedDate.add(1, 'day').format('YYYY-MM-DD');
    router.replace(`/employee/(tabs)/dailySchedule?date=${nextDate}`);
  };

  return (
    <View style={styles.container}>
      {/* Header with Previous and Next Day Buttons */}
      <View style={styles.header}>
        <Button title="<" onPress={goToPreviousDay} />
        <Text style={styles.dateText}>{selectedDate.format('DD MMMM YYYY')}</Text>
        <Button title=">" onPress={goToNextDay} />
      </View>

      {/* Main Content */}
      <Text style={styles.infoText}>Schedule for {selectedDate.format('DD MMMM YYYY')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
