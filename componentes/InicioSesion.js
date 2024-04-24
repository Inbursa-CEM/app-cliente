import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ImageBackground} from "react-native";
import Boton from "./Boton";

const InicioSesion = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
          //marginTop: -225, 
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
      <Boton title="Iniciar sesion" />
    </View>
  );
};

export default InicioSesion;
