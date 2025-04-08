import { useLayoutEffect } from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function CreateEmployeeScreen() {
    const navigation = useNavigation();
    const router = useRouter(); // Use the router from expo-router
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Create Employee',
            headerStyle: {
                backgroundColor: '#F7CB8C',
                height: 80,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
            },
        });
    }, [navigation]);
    return(
        <View>
            <Text>
                Create Employee
            </Text>
        </View>
    )
}