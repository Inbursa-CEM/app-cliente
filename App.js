import InicioSesion from './componentes/InicioSesion';
import PantallaPrincipal from './componentes/PantallaPrincipal';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Transacciones from './componentes/Transacciones';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='InicioSesion'>
        <Stack.Screen name="InicioSesion" component={InicioSesion} options={{headerShown: false}}/>
        <Stack.Screen name="PantallaPrincipal" component={PantallaPrincipal} options={{headerShown: false}}/>
        <Stack.Screen name="Transacciones" component={Transacciones} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}