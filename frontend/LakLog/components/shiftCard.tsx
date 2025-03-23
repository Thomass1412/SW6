// shiftCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Shift } from "../types";

interface ShiftCardProps {
  shift: Shift;
  onPress?: () => void;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{shift.role}</Text>
      <Text>{`${shift.startTime} - ${shift.endTime}`}</Text>
      <Text>{shift.location}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF3D9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ShiftCard;
