import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

interface ShiftData {
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  jobTitle: "Licorice Making" | "Licorice Selling" | "Cleaning Machines";
  status: "scheduled" | "completed" | "canceled";
}

export default function CreateShift() {
  const router = useRouter();
  const navigation = useNavigation();
  const { control, handleSubmit, setValue, watch } = useForm<ShiftData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [repeatWeeks, setRepeatWeeks] = useState(1);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { height: 80, backgroundColor: "#F7CB8C" },
      headerTitleAlign: "center",
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Create Shift</Text>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: 30 }}>◀</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);

  const onSubmit = async (data: ShiftData) => {
    setIsSubmitting(true);
    try {
      const shifts = [];
  
      for (let i = 0; i < (repeat ? repeatWeeks : 1); i++) {
        const shiftDate = new Date(data.date);
        shiftDate.setDate(shiftDate.getDate() + i * 7);
        shifts.push({
          ...data,
          date: shiftDate.toISOString(),
        });
      }
  
      await Promise.all(
        shifts.map((shift) => axios.post("http://192.168.0.154:5000/create", shift))
      );
  
      Alert.alert("Success", "Shift(s) created successfully!");
      router.push("/admin/(tabs)/monthlySchedule"); // Navigate to shift list page after creation
    } catch (error) {
      // Ensure we properly extract the error message
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
  
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Date:</Text>
      <Controller
        control={control}
        name="date"
        defaultValue=""
        rules={{ required: "Date is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Text style={styles.label}>Start Time:</Text>
      <Controller
        control={control}
        name="startTime"
        defaultValue=""
        rules={{ required: "Start time is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Text style={styles.label}>End Time:</Text>
      <Controller
        control={control}
        name="endTime"
        defaultValue=""
        rules={{ required: "End time is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Text style={styles.label}>Location:</Text>
      <Controller
        control={control}
        name="location"
        defaultValue=""
        rules={{ required: "Location is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Text style={styles.label}>Job Title:</Text>
      <Controller
        control={control}
        name="jobTitle"
        defaultValue="Licorice Making"
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
            <Picker.Item label="Licorice Making" value="Licorice Making" />
            <Picker.Item label="Licorice Selling" value="Licorice Selling" />
            <Picker.Item label="Cleaning Machines" value="Cleaning Machines" />
          </Picker>
        )}
      />

      <Text style={styles.label}>Status:</Text>
      <Controller
        control={control}
        name="status"
        defaultValue="scheduled"
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
            <Picker.Item label="Scheduled" value="scheduled" />
            <Picker.Item label="Completed" value="completed" />
            <Picker.Item label="Canceled" value="canceled" />
          </Picker>
        )}
      />

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setRepeat(!repeat)}
      >
        <Text style={styles.checkbox}>{repeat ? "☑" : "☐"} Repeat weekly</Text>
      </TouchableOpacity>

      {repeat && (
        <View>
          <Text style={styles.label}>Number of weeks:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter number of weeks"
            value={String(repeatWeeks)}
            onChangeText={(value) => setRepeatWeeks(parseInt(value) || 1)}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>{isSubmitting ? "Creating..." : "Create Shift"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFAE8',
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#F7CB8C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

