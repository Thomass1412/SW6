import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomCalendar from '../../../components/customCalender';
import CustomButton from '../../../components/CustomButton';
import { useRouter } from 'expo-router';
import { BaseURL } from '../../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';


//should be moved to utils
const getMarkedDatesFromShifts = (shifts: { date: string; employee?: any }[]) => {
  const result: { [date: string]: any } = {};

  shifts.forEach(shift => {
    const dateKey = dayjs(shift.date).format('YYYY-MM-DD');

    const isAssigned = !!shift.employee;
    const dot = {
      key: isAssigned ? 'assigned' : 'unassigned',
      color: isAssigned ? '#FF9500' : '#000000', // Orange if assigned, Black if unassigned
    };

    if (result[dateKey]) {
      // If date already has dots, add to existing dots if not duplicate
      const existingDots = result[dateKey].dots || [];
      const alreadyHasDot = existingDots.some((d: any) => d.key === dot.key);
      if (!alreadyHasDot) {
        result[dateKey].dots.push(dot);
      }
    } else {
      // First dot for this date
      result[dateKey] = {
        dots: [dot],
      };
    }
  });

  return result;
};



const MonthlySchedule = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const router = useRouter();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    router.push(`/admin/(tabs)/dailySchedule?date=${date}`);
  };

  const fetchAllShiftsForMonth = async (date: dayjs.Dayjs) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found!");
        return;
      }
  
      const monthStart = date.startOf('month').format('YYYY-MM-DD');
      const monthEnd = date.endOf('month').format('YYYY-MM-DD');
  
      const response = await fetch(`${BaseURL}/shifts/all-shifts?start=${monthStart}&end=${monthEnd}`, {
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
    fetchAllShiftsForMonth(dayjs());
  }, []);

  return (
    <View style={styles.container}>
      <CustomCalendar
        markedDates={markedDates}
        markingType={'multi-dot'}
        onDateSelect={handleDateSelect}
        onMonthChange={fetchAllShiftsForMonth}
      />
      <CustomButton 
        onPress={() => router.push(`/admin/createShift`)}  
        iconName="add" 
        text="New Shift"
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
