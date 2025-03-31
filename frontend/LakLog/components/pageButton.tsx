import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
    icon?: React.ReactNode;
    text?: string;
    position?: { bottom?: number; right?: number };
}

const PageButton: React.FC<ButtonProps> = ({ icon, text, position }) => {
    const styles = StyleSheet.create({
        baseButton: {
            backgroundColor: "#FFDDAD",
            padding: 10,
            marginVertical: 10,
            borderRadius: 20,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            borderWidth: 2, 
            borderColor: "#000",
            flexDirection: 'row',
            alignItems: 'center',
        },
        floatingButton: {
            position: 'absolute',
            bottom: position?.bottom || 30,
            right: position?.right || 30,
            backgroundColor: '#F7CB8C',
            padding: 15,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 2, 
            borderColor: '#000',
        },
        floatingButtonText: {
            color: '#000',
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: 5, 
        },
    });

    return (
        <TouchableOpacity onPress={() => alert("hello")} style={position ? styles.floatingButton : styles.baseButton}>
            {icon && <View>{icon}</View>}
            {text && <Text style={styles.floatingButtonText}>{text}</Text>}
        </TouchableOpacity>
    );
};

export default PageButton;