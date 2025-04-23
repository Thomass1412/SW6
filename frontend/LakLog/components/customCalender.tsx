import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';

interface CustomCalendarProps {
  markedDates?: { [date: string]: any };
  onDateSelect?: (date: string) => void;
  onMonthChange?: (month: dayjs.Dayjs) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ markedDates = {}, onDateSelect, onMonthChange }) => {
  const { date } = useLocalSearchParams();
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(dayjs(date ? String(date) : new Date()));

  useEffect(() => {
    if (date) {
      setSelectedDate(dayjs(String(date)));
    }
  }, [date]);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(dayjs(day.dateString));
    if (onDateSelect) {
      onDateSelect(day.dateString);
    }
  };

  // Handle month navigation
  const goToPreviousMonth = () => {
    setSelectedDate((prev) => {
      const newDate = prev.subtract(1, 'month');
      onMonthChange?.(newDate);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setSelectedDate((prev) => {
      const newDate = prev.add(1, 'month');
      onMonthChange?.(newDate);
      return newDate;
    });
  };


  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { height: 80, backgroundColor: '#F7CB8C' },
      headerTitleAlign: 'center', 
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontWeight: 'bold'}}>
          {selectedDate.format('MMMM YYYY')}
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={goToPreviousMonth} style={{ marginLeft: 35 }}>
          <Ionicons name="arrow-back" size={34} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={goToNextMonth} style={{ marginRight: 35 }}>
          <Ionicons name="arrow-forward" size={34} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedDate]);

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        key={selectedDate.toString()}
        onDayPress={handleDayPress}
        current={selectedDate.format('YYYY-MM-DD')}
        markedDates={markedDates}
        hideArrows={true}
        disableSwipeMonths={true}
        renderHeader={() => null}
        style={styles.calendar}
        theme={{
          backgroundColor: '#FFFAE8',
          calendarBackground: '#FFFAE8',
          selectedDayTextColor: 'black',
          todayTextColor: '#FF9500',
          dayTextColor: 'black',
          monthTextColor: 'black',
          textDayFontWeight: 'regular',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textSectionTitleColor: 'black',
          textDayFontSize: 18,
          textMonthFontSize: 13,
          textDayHeaderFontSize: 15.5,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 10,
    padding: 0,
  },
  selectedDateText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomCalendar;