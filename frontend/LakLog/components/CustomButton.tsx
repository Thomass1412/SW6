import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomButtonProps {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  text: string;
  position?: { bottom?: number; right?: number };
}

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, iconName, text, position }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        styles.floatingButton, 
        position && { bottom: position.bottom, right: position.right }
      ]} 
      onPress={onPress}
    >
      <Ionicons name={iconName} size={30} color="#000" />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7CB8C',
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#000',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,  
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
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CustomButton;
