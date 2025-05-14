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
  Modal,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton'; 
import { router } from 'expo-router';
import {BaseURL} from "../../config/api";

export default function EmployeesScreen() {
  const navigation = useNavigation();
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

        const response = await fetch(`${BaseURL}/users/employees`, {
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

  const handleDeleteEmployee = async (id: string) => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const res = await fetch(`${BaseURL}/users/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const result = await res.json();
      if (res.ok) {
        Alert.alert("Deleted", result.message);
        // remove from local state
        const updated = employees.filter(emp => emp._id !== id);
        setEmployees(updated);
        setFilteredEmployees(updated);
        setModalVisible(false);
      } else {
        Alert.alert("Error", result.message || "Failed to delete employee.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong.");
      console.error(err);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setSelectedEmployee(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {selectedEmployee && (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalName}>{selectedEmployee.name}</Text>
            <Text>Email: {selectedEmployee.email}</Text>
            <Text>Phone: {selectedEmployee.phone || "N/A"}</Text>
            <Text>Roles: {selectedEmployee.jobTitle?.join(', \n') || "None"}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => router.push("/admin/editEmployee")}
                style={styles.editButton}
              >
                <Text style={styles.editText}>Edit Employee</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Delete Employee",
                    "Are you sure you want to delete this employee?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => handleDeleteEmployee(selectedEmployee._id),
                      },
                    ]
                  )
                }
                style={styles.deleteButton}>
                <Text style={styles.deleteText}>Delete Employee</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    )}
  
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
          onPress={() => router.push("/admin/createEmployee")}
          iconName="add"
          text="New employee"
          position={{ bottom: 30, right: 30 }}
        />
      </View>
    </>
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
    paddingBottom: 100, 
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    backgroundColor: '#FFE8C7',
    padding: 20,
    borderRadius: 10,
    minWidth: '75%',
    elevation: 5,
  },
  modalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    marginRight: 10,
  },
  editText: {
    color: '#000',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
  
});
