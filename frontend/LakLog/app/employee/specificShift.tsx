// specificShift.tsx
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function SpecificShift() {
  const { id, role, location, startTime, endTime, date } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text>🕒 {date}</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{role}</Text>
      <Text>{location}</Text>
      <Text>{startTime} - {endTime}</Text>
      <Text>Shift ID: {id}</Text>
    </View>
  );
}
