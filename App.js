//Autor: Ares Ortiz Botello AO1747848
// Objetivo: Establecer las pantallas que se usaran al llamar a navigation.navigate

import InicioSesion from './componentes/InicioSesion';
import PantallaPrincipal from './componentes/PantallaPrincipal';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Transacciones from './componentes/Transacciones';
import DetalleTransaccion from './componentes/DetalleTransaccion';

// Creación de un stack navigator
const Stack = createNativeStackNavigator()

// Definir las pantallas y la forma en que se navega entre ellas
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='InicioSesion'>
        <Stack.Screen name="InicioSesion" component={InicioSesion} options={{headerShown: false}}/>
        <Stack.Screen name="PantallaPrincipal" component={PantallaPrincipal} options={{headerShown: false}}/>
        <Stack.Screen name="Transacciones" component={Transacciones} options={{headerShown: false}}/>
        <Stack.Screen name='DetalleTransaccion' component={DetalleTransaccion} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}