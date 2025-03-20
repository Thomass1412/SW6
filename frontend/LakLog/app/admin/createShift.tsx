import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function CreateShift() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { height: 80,backgroundColor: "#F7CB8C" },
      headerTitleAlign: "center",
      headerTitle: () => (
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Create Shift
              </Text>
            ), 
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()} 
          style={{ marginLeft: 15 }}
        >
          <Text style={{ fontSize: 30 }}>◀</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);

  return (
    <View>
      <Text >Create Shift</Text>
    </View>
  );
}
