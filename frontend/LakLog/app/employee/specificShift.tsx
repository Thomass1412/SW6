import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import SwipeButton from "rn-swipe-button";
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SpecificShift() {
  const { id, startTime, endTime, date, location, jobTitle } = useLocalSearchParams();
  const [shiftCoords, setShiftCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isEligibleTime, setIsEligibleTime] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get location of shift
  useEffect(() => {
    const setup = async () => {
      try {
        // 🔐 Request permissions first
        console.log("🔐 Requesting location permissions...");
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Location denied", "Cannot access your position.");
          return;
        }
  
        // ✅ Now it's safe to geocode
        console.log("📍 Geocoding shift location...");
        const geo = await Location.geocodeAsync(location as string);
        if (geo.length > 0) {
          setShiftCoords({
            latitude: geo[0].latitude,
            longitude: geo[0].longitude,
          });
          console.log("✅ Shift coordinates:", geo[0]);
        } else {
          throw new Error("No geocode results found");
        }
  
        // 📡 Get current position
        console.log("📡 Getting current location...");
        const pos = await Location.getCurrentPositionAsync({});
        setCurrentCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        console.log("Current coordinates:", pos.coords);
  
        // 🕒 Time check
        const shiftStartTime = dayjs(`${date}T${startTime}`);
        const now = dayjs();
        const diffInMinutes = shiftStartTime.diff(now, 'minute');
        setIsEligibleTime(diffInMinutes <= 10 && diffInMinutes >= -30);
        console.log("Time diff (min):", diffInMinutes);
      } catch (err: any) {
        console.error("Setup error:", err.message || err);
        Alert.alert("Error", "Failed to get required data.");
      } finally {
        setLoading(false);
      }
    };
    setup();
  }, []);

  const handleSwipeSuccess = async () => {
    if (!currentCoords || !shiftCoords) {
      Alert.alert("Location Error", "Missing coordinates.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await fetch("http://192.168.0.154:5000/shifts/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          shiftId: id,
          location: currentCoords,
          timestamp: new Date().toISOString()
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", result.message || "Signed in successfully");
      } else {
        Alert.alert("Error", result.error || "Sign-in failed");
      }

    } catch (error) {
      Alert.alert("Error", "An error occurred while signing in.");
    }
  };

  const swipeDisabled = loading || !currentCoords || !shiftCoords || !isEligibleTime;


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
        disabled={swipeDisabled}
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
