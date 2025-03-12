import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomCalendar from '../../components/customCalender'; 

const MonthlySchedule = () => {
  const handleDateSelect = (date: string) => {
    console.log('Selected Date:', date);
    // Fetch shifts or perform other actions
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Månedlig Vagtplan</Text>
      <CustomCalendar onDateSelect={handleDateSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default MonthlySchedule;
