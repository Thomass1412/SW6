import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import SwipeButton from "rn-swipe-button";
import { Ionicons } from '@expo/vector-icons';

export default function SpecificShift() {
  const { id, startTime, endTime, date, location, jobTitle } = useLocalSearchParams();

  const handleSwipeSuccess = () => {
    console.log("✅ User signed in to shift:", id);
    // Add sign-in logic here (e.g., API call, geofence check)
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF7E6",
      alignItems: "center",
      paddingTop: 50,
    },
    heading: {
      fontSize: 20,
      fontWeight: "bold",
      backgroundColor: "#F7CB8C",
      width: "100%",
      textAlign: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    shiftBox: {
      backgroundColor: "#FFF",
      padding: 25,
      borderRadius: 12,
      width: "85%",
      marginTop: 30,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    timeText: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 5,
    },
    dateText: {
      fontSize: 16,
      textAlign: "center",
      color: "#333",
      marginBottom: 20,
    },
    section: {
      borderTopWidth: 1,
      borderColor: "#ccc",
      paddingVertical: 10,
    },
    label: {
      fontSize: 14,
      color: "#888",
    },
    value: {
      fontSize: 16,
      color: "#000",
      marginTop: 2,
    },
    sellText: {
      color: "#000",
      textAlign: "center",
      marginTop: 20,
      textDecorationLine: "underline",
      fontWeight: "500",
    },
  });
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Shift</Text>

      <View style={styles.shiftBox}>
        <Text style={styles.timeText}>{startTime} - {endTime}</Text>
        <Text style={styles.dateText}>{date}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Lokation</Text>
          <Text style={styles.value}>{location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Shift Type</Text>
          <Text style={styles.value}>{jobTitle}</Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.sellText}>Sell Shift</Text>
        </TouchableOpacity>
      </View>

      <SwipeButton
        swipeSuccessThreshold={70}
        height={55}
        width={280}
        title="Sign In"
        thumbIconComponent={() => (
          <Ionicons name="arrow-forward" size={24} color="#000" />
        )}
        railBackgroundColor="#D9D9D9"
        railBorderColor="#999"
        railFillBackgroundColor="#F7CB8C"
        railFillBorderColor="#000"
        titleColor="#000"
        onSwipeSuccess={handleSwipeSuccess}
        shouldResetAfterSuccess={true}
      />
    </View>
  );
}
