// ShiftList.tsx
import { View, FlatList } from "react-native";
import ShiftCard from "./shiftCard";
import { useRouter } from "expo-router";
import { Shift } from "../types";

interface ShiftListProps {
  shifts: Shift[];
  isAdmin: boolean;
}

const ShiftList: React.FC<ShiftListProps> = ({ shifts, isAdmin }) => {
  const router = useRouter();

  const sortedShifts = [...shifts].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const handleShiftPress = (shift: Shift) => {
    const path = isAdmin ? "/admin/specificShift" : "/employee/specificShift";
    router.push({
      pathname: path,
      params: {
        id: shift._id,
        jobTitle: shift.jobTitle,
        location: shift.location,
        startTime: shift.startTime,
        endTime: shift.endTime,
        date: shift.date,
      },
    });
  };

  return (
    <View>
      <FlatList
        data={sortedShifts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ShiftCard shift={item} onPress={() => handleShiftPress(item)} isAdmin={isAdmin} />
        )}
      />
    </View>
  );
};

export default ShiftList;
