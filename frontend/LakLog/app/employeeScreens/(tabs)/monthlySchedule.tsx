import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import CustomCalendar from '../../../components/customCalender'; 
import { router } from 'expo-router';

const MonthlySchedule = () => {
  const handleDateSelect = (date: string) => {
    console.log('Selected Date:', date);
    // Fetch shifts or perform other actions
  };

  const handleRoute = () => {
    // Redirect
    router.replace('/employeeScreens/dailySchedule');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Månedlig Vagtplan</Text>
      <CustomCalendar onDateSelect={handleDateSelect} />
      <Button title="Opret Vagt" onPress={handleRoute}/>
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
