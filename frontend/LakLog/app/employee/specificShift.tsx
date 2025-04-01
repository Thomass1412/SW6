import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import SwipeButton from "rn-swipe-button";
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLayoutEffect, useEffect, useState } from "react";
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Coords = { latitude: number; longitude: number };

type ShiftStatus = "scheduled" | "signed-in" | "completed";

export default function SpecificShift() {
  const { id } = useLocalSearchParams();
  const [shift, setShift] = useState<any>(null);
  const [shiftCoords, setShiftCoords] = useState<Coords | null>(null);
  const [currentCoords, setCurrentCoords] = useState<Coords | null>(null);
  const [eligibleTime, setEligibleTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
      navigation.setOptions({
        title: "My Shift",
        headerStyle: { height: 80, backgroundColor: '#F7CB8C' },
        headerTitleAlign: "center",
      });
    }, [navigation]);
  

  useEffect(() => {
    const setup = async () => {
      try {

        const token = await AsyncStorage.getItem("accessToken");
        const res = await fetch(`http://192.168.0.154:5000/shifts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setShift(data);
        console.log("🔄 Loaded shift:", data);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Location denied", "Cannot access your position.");
          return;
        }

        const geo = await Location.geocodeAsync(data.location);
        if (geo.length > 0) {
          setShiftCoords({ latitude: geo[0].latitude, longitude: geo[0].longitude });
        }

        const pos = await Location.getCurrentPositionAsync({});
        setCurrentCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });

        const now = dayjs();
        console.log("Now:", now.format());
        const dateStr = dayjs(data.date).format("YYYY-MM-DD");
        const refTime = dayjs(`${dateStr}T${data.status === 'scheduled' ? data.startTime : data.endTime}`);
        console.log("🕒 Ref Time:", refTime.format());
        const diff = refTime.diff(now, 'minute');
        console.log("⏳ Diff (minutes):", diff);
        const validTime = data.status === 'scheduled' ? (diff <= 100 && diff >= -100) : Math.abs(diff) <= 100;
        setEligibleTime(validTime);
        console.log("✔️ Eligible:", validTime)
      } catch (err) {
        console.error("Setup error:", err);
        Alert.alert("Error", "Failed to load shift data.");
      } finally {
        setLoading(false);
      }
    };
    setup();
  }, []);

  const handleSwipe = async () => {
    if (!currentCoords) return;
    const token = await AsyncStorage.getItem("accessToken");
    const endpoint = shift.status === 'scheduled' ? 'sign-in' : 'complete';

    try {
      const res = await fetch(`http://192.168.0.154:5000/shifts/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shiftId: id,
          location: currentCoords,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await res.json();
      if (res.ok) {
        Alert.alert("Success", result.message);
        setShift({ ...shift, status: shift.status === 'scheduled' ? 'signed-in' : 'completed' });
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update shift.");
    }
  };

  if (!shift || loading) return <Text>Loading...</Text>;

  const swipeTitle = shift.status === 'scheduled' ? 'Sign In' : 'Complete Shift';
  const swipeDisabled = !eligibleTime || !currentCoords || !shiftCoords || shift.status === 'completed';

  return (
    <View style={styles.container}>
      <View style={styles.shiftBox}>
        <Text style={styles.timeText}>{shift.startTime} - {shift.endTime}</Text>
        <Text style={styles.dateText}>{dayjs(shift.date).format('DD-MM-YYYY')}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Lokation</Text>
          <Text style={styles.value}>{shift.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Shift Type</Text>
          <Text style={styles.value}>{shift.jobTitle}</Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.sellText}>Sell Shift</Text>
        </TouchableOpacity>
      </View>

      <SwipeButton
        swipeSuccessThreshold={75}
        height={55}
        width={280}
        title={swipeTitle}
        thumbIconComponent={() => (
          <Ionicons name="arrow-forward" size={24} color="#000" />
        )}
        disabled={swipeDisabled}
        disableResetOnTap={false}
        disabledThumbIconBackgroundColor="#D9D9D9"
        disabledRailBackgroundColor="#BCBCBC"
        disabledThumbIconBorderColor="#D9D9D9"
        railBackgroundColor="#F7CB8C"
        railBorderColor="#999"
        railFillBackgroundColor="#FFE8C7"
        railFillBorderColor="#FFE8C7"
        thumbIconBackgroundColor="#FFDDAD"
        thumbIconBorderColor="#FFDDAD"
        titleColor="#000"
        onSwipeSuccess={handleSwipe}
        shouldResetAfterSuccess={true}
      />
    </View>
  );
}

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
