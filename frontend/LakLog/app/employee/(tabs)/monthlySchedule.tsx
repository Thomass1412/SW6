import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import CustomCalendar from '../../../components/customCalender';
import CustomButton from '../../../components/CustomButton';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseURL} from "../../../config/api";


// convert shift dates to markedDates move to utils
const getMarkedDatesFromShifts = (shifts: { date: string }[]) => {
  const result: { [date: string]: any } = {};
  shifts.forEach(shift => {
    const dateKey = dayjs(shift.date).format('YYYY-MM-DD'); 
    result[dateKey] = {
      marked: true,
      dotColor: '#FF9500',
    };
  });
  return result;
};

const MonthlySchedule = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const router = useRouter();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    router.push(`/employee/(tabs)/dailySchedule?date=${date}`);
  };

  const fetchShiftsForMonth = async (date: dayjs.Dayjs) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found!");
        return;
      }
  
      const monthStart = date.startOf('month').format('YYYY-MM-DD');
      const monthEnd = date.endOf('month').format('YYYY-MM-DD');
  
      const response = await fetch(`${BaseURL}/shifts/my-shifts?start=${monthStart}&end=${monthEnd}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      const marked = getMarkedDatesFromShifts(data);
      setMarkedDates(marked);
    } catch (err) {
      console.error('Failed to fetch shifts:', err);
    }
  };

  useEffect(() => {
    fetchShiftsForMonth(dayjs());
  }, []);

  return (
    <View style={styles.container}>
      <CustomCalendar
        markedDates={markedDates}
        onDateSelect={handleDateSelect}
        onMonthChange={fetchShiftsForMonth}
      />
      <CustomButton 
        onPress={() => router.push(`/employee/createUnavailability`)}  
        iconName="add" 
        text="New Unavailability"
        position={{ bottom: 30, right: 30 }}
      />
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
