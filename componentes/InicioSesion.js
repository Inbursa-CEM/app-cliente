import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground, StyleSheet, ActivityIndicator, Alert } from "react-native";
import Boton from "./Boton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InicioSesion = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setLoginError(null);
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, password: password })
    };

    try {
      //Cambiar localhost a IP
      const response = await fetch('http://10.48.70.212:8080/cliente/getDatosCliente', requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      //Si no funciona, tengo que cambiar estas lineas jiji
      await AsyncStorage.setItem('idCliente', data.idCliente.toString());
      await AsyncStorage.setItem('nombre', data.nombre);
      console.log('idCliente pantalla principal:', data.idCliente.toString());
      navigation.navigate('PantallaPrincipal');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
      setLoginError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../assets/pantInicioSesion.png')} style={styles.background} resizeMode="cover">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.inputCorreo}
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          style={styles.inputPassword}
        />
        <Boton title="Iniciar sesión" onPress={handleLogin} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {loginError && <Text style={styles.error}>{loginError}</Text>}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputCorreo: {
    padding: 10,
    marginBottom: 30,
    marginTop: 205,
    width: 300,
    height: 60,
    backgroundColor: "white",
    borderRadius: 20, 
  },
  inputPassword: {
    padding: 10,
    marginBottom: 40,
    marginTop: 15,
    width: 300,
    height: 60,
    backgroundColor: "white",
    borderRadius: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
  }
});

export default InicioSesion;