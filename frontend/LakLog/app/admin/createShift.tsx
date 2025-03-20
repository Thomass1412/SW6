import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function CreateShift() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#F7CB8C" },
      headerTitle: () => (
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 85 }}>
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
    <View style={styles.container}>
      <Text style={styles.title}>Create Shift</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
