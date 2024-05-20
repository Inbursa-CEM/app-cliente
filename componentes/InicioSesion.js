import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ImageBackground, Dimensions, StyleSheet} from "react-native";
import Boton from "./Boton";
import Logica from "./Logica";

const InicioSesion = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    //Aqui vamos a tener que poner toda la logica para validar a un usuario
    navigation.navigate('PantallaPrincipal')
  };

  return (
    <ImageBackground source={require('../assets/pantInicioSesion.png')} style={styles.background} resizeMode="cover">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Logica/>
        <TextInput
          placeholder="Correo electrónico"
          //backgroundColor="white"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{
            padding: 10,
            marginBottom: 30,
            marginTop: 205,
            width: 300,
            height: 60,
            backgroundColor: "white",
            borderRadius: 20, 
          }}
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          style={{
            padding: 10,
            marginBottom: 40,
            marginTop: 15,
            width: 300,
            height: 60,
            backgroundColor: "white",
            borderRadius: 20,
          }}
        />
        <Boton title="Iniciar sesion" onPress={handleLogin}/>
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
  }
});

export default InicioSesion;
