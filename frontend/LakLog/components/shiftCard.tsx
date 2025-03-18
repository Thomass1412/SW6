import { View, Text, StyleSheet } from "react-native";
import { Shift } from "../types"; // Import the Shift type

interface ShiftCardProps {
  shift: Shift;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  return (
    <View style={styles.card}>
      <Text>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>{shift.startTime} - {shift.endTime}</Text>
        <Text style={{ fontSize: 15 }}> {shift.jobTitle}</Text>
      </Text>
      <Text style={{ fontSize: 15 }} >Lokation: {shift.location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFDDAD",
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2, 
    borderColor: "#000",
  }
});

export default ShiftCard;
