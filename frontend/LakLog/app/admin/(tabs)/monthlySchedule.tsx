import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomCalendar from '../../../components/customCalender';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

const MonthlySchedule = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const router = useRouter();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    router.push(`/admin/(tabs)/dailySchedule?date=${date}`);
  };

  return (
    <View style={styles.container}>
      <CustomCalendar onDateSelect={handleDateSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFAE8',
  },
});

export default MonthlySchedule;
