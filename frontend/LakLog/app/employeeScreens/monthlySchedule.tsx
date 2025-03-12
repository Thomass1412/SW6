import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

const MonthlySchedule = () => {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Månedlig Vagtplan</Text>
      <Calendar
        onDayPress={(day: { dateString: string }) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'blue' }
        }}
        theme={{
          selectedDayBackgroundColor: 'blue',
          todayTextColor: 'red',
          arrowColor: 'black'
        }}
      />
      <Text style={styles.selectedDateText}>
        Valgt dato: {selectedDate || 'Ingen dato valgt'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  selectedDateText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center'
  }
});

export default MonthlySchedule;
