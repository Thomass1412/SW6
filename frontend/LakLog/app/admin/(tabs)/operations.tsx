import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function OperationsScreen() {
  const navigation = useNavigation();
  const router = useRouter(); 

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Operations",
      headerStyle: {
        height: 80,
        backgroundColor: '#F7CB8C',
      },
      headerTitleAlign: "center",
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 25,
      },
    });
  }, [navigation]);

  const handlePress = (page: string) => {
    Alert.alert(`This takes you to the ${page} page`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/admin/employeesPage")}>
        <Text style={styles.buttonText}>Employees</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.button} onPress={() => handlePress("Shift Types")}>
        <Text style={styles.buttonText}>Shift Types</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.button} onPress={() => handlePress("Lokations")}>
        <Text style={styles.buttonText}>Lokations</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.button} onPress={() => alert("This generates a report")}>
        <Text style={styles.buttonText}>Generate Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7E6',
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    width: '85%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 23,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '85%',
  },
});
