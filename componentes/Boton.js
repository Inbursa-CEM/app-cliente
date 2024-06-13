// Autor: Andrés Iván Rodríguez Méndez A01754650
// Objetivo: Crear un boton para el inicio de sesion

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Definición del componente funcional 'Boton' que recibe dos props
const Boton = ({ onPress, title }) => {
  return (
    // 'TouchableOpacity' es un componente que se puede presionar. Aquí se le asigna un estilo y un manejador de evento onPress.
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// Definición de estilos para los componentes usando StyleSheet.create.
const styles = StyleSheet.create({
  // Estilo del botón
  button: {
    marginTop: 30,
    backgroundColor: '#012148',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,

  },
  // Estilo del texto dentro del botón
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Boton;