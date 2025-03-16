import { View, Text, StyleSheet } from "react-native";
import { Shift } from "../types"; // Import the Shift type

interface ShiftCardProps {
  shift: Shift;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.role}>{shift.role}</Text>
      <Text>{shift.location}</Text>
      <Text>{shift.startTime} - {shift.endTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  role: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ShiftCard;
