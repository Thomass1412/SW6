import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import dayjs from 'dayjs';

interface CustomCalendarProps {
  markedDates?: { [date: string]: any };
  onDateSelect?: (date: string) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ markedDates = {}, onDateSelect }) => {
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
    setSelectedDate((prev) => prev.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setSelectedDate((prev) => prev.add(1, 'month'));
  };


  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#F7CB8C' },
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 85 }}>
          {selectedDate.format('DD MMMM YYYY')}
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={goToPreviousMonth} style={{ marginLeft: 25 }}>
          <Text style={{ fontSize: 30 }}>◀</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={goToNextMonth} style={{ marginRight: 25 }}>
          <Text style={{ fontSize: 30 }}>▶</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedDate]);

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        key={selectedDate.toString()} // Forces re-render when month changes
        onDayPress={handleDayPress}
        current={selectedDate.format('YYYY-MM-DD')}
        markedDates={{
          ...markedDates,
          [selectedDate.format('YYYY-MM-DD')]: { selected: true, selectedColor: '#F7CB8C' },
        }}
        hideArrows={true} 
        disableSwipeMonths={true}
        renderHeader={() => null} 
        style={styles.calendar}
        theme={{
          backgroundColor: '#FFFAE8',
          calendarBackground: '#FFFAE8',
          selectedDayBackgroundColor: 'blue',
          selectedDayTextColor: 'black',
          todayTextColor: 'red',
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