import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import BottomNavBar from "../../components/BottomNavBar";
import TopNavBar from "../../components/TopNavBar";

export default function ManagerHome() {
  const [month, setMonth] = useState(2); // February
  const [year, setYear] = useState(2025);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <View className="flex-1 bg-amber-100">
      {/* 🔝 Top Navigation Bar */}
      <TopNavBar month={month} year={year} onPrev={prevMonth} onNext={nextMonth} />

      {/* 📆 Monthly Calendar View */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl">📅 Calendar View (To be implemented)</Text>
      </View>

      {/* ➕ Floating New Shift Button */}
      <TouchableOpacity className="absolute bottom-20 right-5 p-4 bg-amber-400 rounded-lg shadow-lg">
        <Text className="text-black font-bold">➕ New Shift</Text>
      </TouchableOpacity>

      {/* 📌 Bottom Navigation */}
      <BottomNavBar />
    </View>
  );
}
