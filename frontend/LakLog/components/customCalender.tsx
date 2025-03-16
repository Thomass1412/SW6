import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams } from 'expo-router';

interface CustomCalendarProps {
  markedDates?: { [date: string]: any };
  onDateSelect?: (date: string) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ markedDates = {}, onDateSelect }) => {
  const { date } = useLocalSearchParams(); // Get date from URL params
  const [selectedDate, setSelectedDate] = useState<string>(date ? String(date) : '');

  useEffect(() => {
    if (date) {
      setSelectedDate(String(date)); // Convert to string explicitly
    }
  }, [date]);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    if (onDateSelect) {
      onDateSelect(day.dateString);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: 'blue' },
        }}
        style={styles.calendar}
        theme={{
          backgroundColor: '#f0f0f0',
          calendarBackground: '#f0f0f0',
          selectedDayBackgroundColor: 'blue',
          selectedDayTextColor: '#ffffff',
          todayTextColor: 'red',
          dayTextColor: 'black',
          arrowColor: 'black',
          monthTextColor: 'black',
          textDayFontWeight: 'bold',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
        }}
      />
      <Text style={styles.selectedDateText}>Valgt dato: {selectedDate || 'Ingen dato valgt'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
  },
  calendar: {
    borderRadius: 10,
    padding: 10,
  },
  selectedDateText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomCalendar;
