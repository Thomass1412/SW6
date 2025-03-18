import { View, FlatList } from "react-native";
import ShiftCard from "./shiftCard";
import { Shift } from "../types";

interface ShiftListProps {
  shifts: Shift[];
}

const ShiftList: React.FC<ShiftListProps> = ({ shifts }) => {
  // Sort shifts by startTime (ascending)
  const sortedShifts = [...shifts].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <View>
      <FlatList
        data={sortedShifts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ShiftCard shift={item} />}
      />
    </View>
  );
};

export default ShiftList;
