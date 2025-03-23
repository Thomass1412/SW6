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
    shiftBox: {
      backgroundColor: "#FFF7E6",
      padding: 25,
      width: "85%",
      marginTop: 30,
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
      color: "#FF0000",
      textAlign: "center",
      marginTop: 20,
      textDecorationLine: "underline",
      fontWeight: "500",
    },
  });
  

  return (
    <View style={styles.container}>
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
        swipeSuccessThreshold={75}
        height={55}
        width={280}
        title="Sign In"
        thumbIconComponent={() => (
          <Ionicons name="arrow-forward" size={24} color="#000" />
        )}
        disabled={false}
        disableResetOnTap={false}
        disabledThumbIconBackgroundColor="D9D9D9"
        disabledRailBackgroundColor="#BCBCBC"
        disabledThumbIconBorderColor="D9D9D9"
        railBackgroundColor="#F7CB8C"
        railBorderColor="#999"
        railFillBackgroundColor="#FFE8C7"
        railFillBorderColor="#FFE8C7"
        thumbIconBackgroundColor= "#FFDDAD"
        thumbIconBorderColor="#FFDDAD"
        titleColor="#000"
        onSwipeSuccess={handleSwipeSuccess}
        shouldResetAfterSuccess={true}
      />
    </View>
  );
}
