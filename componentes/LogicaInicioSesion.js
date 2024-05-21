import React, { useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogicaInicioSesion = ({ email, password, onLoginSuccess }) => {
    // const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogin = async () => {
      setLoading(true);
      try {
          const response = await fetch('http://192.168.0.20:8080/cliente/getDatosCliente', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ correo: email, contrasena: password }),
          });

          if (response.ok) {
              const data = await response.json();
              await AsyncStorage.setItem('cliente', JSON.stringify(data));
              onLoginSuccess(data);
          } else {
              const error = await response.json();
              Alert.alert('Error', error.error || 'Error al iniciar sesión');
          }
      } catch (error) {
          console.error('Error al iniciar sesión:', error);
          Alert.alert('Error', 'Error al iniciar sesión');
      } finally {
          setLoading(false);
      }
  };

  return (
      <View>
          {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
          ) : (
              <Text></Text>
          )}
      </View>
  );
};
export default LogicaInicioSesion;
