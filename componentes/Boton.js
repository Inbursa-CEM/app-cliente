import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Boton = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    backgroundColor: '#012148',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,

  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Boton;