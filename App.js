import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';

import InicioSesion from './componentes/InicioSesion';

export default function App() {
  return (
    <ImageBackground source={require('./assets/pantInicioSesion.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
      <InicioSesion />
      <StatusBar style="auto" />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#AEC8D8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Opcional: puedes ajustar el modo de ajuste de la imagen de fondo
    justifyContent: 'center',
  },
  
});
