import { View, Text, TouchableOpacity } from "react-native";

export default function TopNavBar({
  month,
  year,
  onPrev,
  onNext,
}: { month: number; year: number; onPrev: () => void; onNext: () => void; }) {
  return (
    <View className="flex-row justify-between items-center p-4 bg-amber-300">
      <TouchableOpacity onPress={onPrev}>
        <Text className="text-lg">⬅</Text>
      </TouchableOpacity>
      <Text className="text-xl font-bold">{month}-{year}</Text>
      <TouchableOpacity onPress={onNext}>
        <Text className="text-lg">➡</Text>
      </TouchableOpacity>
    </View>
  );
}
