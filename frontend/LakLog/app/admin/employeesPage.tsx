import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton'; 

export default function EmployeesScreen() {
  const navigation = useNavigation();
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Employees',
      headerStyle: {
        backgroundColor: '#F7CB8C',
        height: 80,
      },
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
      },
    });
  }, [navigation]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found!");
          return;
        }

        const response = await fetch('http://192.168.0.154:5000/users/employees', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log("👀 Fetched employees:", data);

        if (Array.isArray(data)) {
        setEmployees(data);
        setFilteredEmployees(data);
        } else {
        throw new Error("Expected an array of employees, got: " + JSON.stringify(data));
        }
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        Alert.alert("Error", "Failed to load employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchText, employees]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
        placeholderTextColor="#999"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#F7CB8C" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <CustomButton
        onPress={() => Alert.alert("This takes you to the create employee page")}
        iconName="add"
        text="New employee"
        position={{ bottom: 30, right: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E6',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  list: {
    paddingBottom: 100, // space for the floating button
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});
