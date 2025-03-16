import { View, FlatList } from "react-native";
import ShiftCard from "./shiftCard";
import { Shift } from "../types"; // Import the Shift type

interface ShiftListProps {
  shifts: Shift[];
}

const ShiftList: React.FC<ShiftListProps> = ({ shifts }) => {
  return (
    <View>
      <FlatList
        data={shifts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ShiftCard shift={item} />}
      />
    </View>
  );
};

export default ShiftList;
