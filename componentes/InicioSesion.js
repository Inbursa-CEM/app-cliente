import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground, StyleSheet, ActivityIndicator, Alert } from "react-native";
import Boton from "./Boton";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Definición del componente funcional 'InicioSesion'
const InicioSesion = ({ navigation }) => {
  // Definición de estados locales con useState
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const arrayValores = [1, 2, 3, 4, 5];
  const arrayTarjetas = [];

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    setLoading(true); // Mostrar indicador de carga
    setLoginError(null); // Resetear error de inicio de sesión
    
     // Opciones de la petición POST
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, password: password })
    };

    try {
      // Envío de la petición POST para obtener datos del cliente
      const response = await fetch('http://54.163.30.178:8080/cliente/getDatosCliente', requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Almacenamiento de datos del cliente en AsyncStorage
      await AsyncStorage.setItem('idCliente', data.idCliente.toString());
      await AsyncStorage.setItem('nombre', data.nombre);
      var idCliente = data.idCliente;

      if (idCliente) {
        //Llamada a la API para obtener los datos del cliente
        const requestOptions2 = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idCliente }),
        };
        const response2 = await fetch(
          "http://54.163.30.178:8080/cuenta/cuentas",
          requestOptions2
        );
        const data2 = await response2.json();
        const cuentas = data2[0].idCuenta;
        console.log('Cuentas en login:', cuentas);
        await AsyncStorage.setItem('cuentas', cuentas.toString());

        if (cuentas) {
          //Llamada a la API para obtener los datos de la tarjeta
          const requestOptions3 = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idCuenta: cuentas }),
          };
          const response3 = await fetch(
            "http://54.163.30.178:8080/tarjeta/getTarjetasxCuenta",
            requestOptions3
          );
          const data3 = await response3.json();
          var temp = []
          for (let i = 0; i < data3.length; i++) {
            temp.push(data3[i].numCuenta);
          }
          arrayTarjetas.push(temp);
          temp = []
          for (let i = 0; i < data3.length; i++) {
            temp.push(data3[i].saldo);
          }
          arrayTarjetas.push(temp);
          console.log('Array tarjetas:', arrayTarjetas);
          await AsyncStorage.setItem('InfoTarjetas', JSON.stringify(arrayTarjetas));
      };
    }
      // Guardar array usando AsyncStorage
      await AsyncStorage.setItem('arrayValores', JSON.stringify(arrayValores));
  
      console.log('Array guardado: ', arrayValores);
      console.log('idCliente pantalla principal:', data.idCliente.toString());

      navigation.navigate('PantallaPrincipal');
    } catch (error) {
      console.error('Error al iniciar sesión:', error); // Manejo de errores de la petición
      Alert.alert('Error', error.message || 'Error al iniciar sesión'); // Mostrar alerta de error
      setLoginError(error.message || 'Error al iniciar sesión'); // Guardar mensaje de error
    } finally {
      setLoading(false);  // Ocultar indicador de carga
    }
  };

  // Retorno de la vista del componente
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

// Definición de los estilos del componente
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