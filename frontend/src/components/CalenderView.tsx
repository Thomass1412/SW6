import { View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarView() {
  return (
    <View>
      <Calendar
        markedDates={{
          "2025-02-01": { marked: true, dotColor: "red" },
          "2025-02-19": { marked: true, dotColor: "orange" },
        }}
      />
    </View>
  );
}
