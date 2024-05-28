import React, { useEffect, useState } from "react";
import { StyleSheet, View, ImageBackground, Text, Image, Modal, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Boton from "./Boton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PantallaPrincipal = () => {
  const [cliente, setCliente] = useState(null);
  const [cuentas, setCuentas] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchClienteData = async() => {
      const idCliente = await AsyncStorage.getItem('idCliente');
      if (idCliente) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idCliente: idCliente})
        };

        try {
          const response = await fetch('http://10.48.70.212:8080/cuenta/cuentas', requestOptions);
          const data = await response.json();
          console.log('data:', data);
          if (!response.ok) {
            throw new Error(data.error || 'Error al obtener los datos del cliente en pantalla');
          }
          setCliente(data.cliente);
          setCuentas(data.cuentas);
        } catch (error) {
          console.error('Error al obtener los datos del cliente en pantalla:', error);
        }
      }
    };
    fetchClienteData();
  }, []);

  if(!cliente) {
    return <Text>Cargando...</Text>;
  }

  return (
    <ImageBackground source={require('../assets/PantallaFondo.png')} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.usuario}>{cliente.nombre}</Text>
        <View style={styles.contenedorPrincipal}>
          <View style={[styles.subContainer, styles.border]}>
            <Text style={[styles.titulo, styles.bold, styles.center]}>Mis tarjetas</Text>
            <TouchableOpacity onPress={() => setPopupVisible(true)}>
              <Image source={require('../assets/tarjeta.png')} style={styles.image}></Image>
            </TouchableOpacity>
          </View>

          {cuentas.map((cuenta, index) => (
            <View key={index} style={[styles.subContainer, styles.border]}>
              <Text style={[styles.titulo, styles.bold, { color: '#012148' }]}>Cuenta bancaria</Text>
              <View style={styles.transaccion}>
                <View>
                  <Text style={styles.textMediano}>Terminación</Text>
                  <Text style={styles.textCantidadCuenta}>*{cuenta.numCuenta.slice(-4)}</Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.textMediano}>Saldo disponible</Text>
                  <Text style={styles.textCantidadCuenta}>${cuenta.saldo}</Text>
                </View>
              </View>
            </View>
          ))}


        <TouchableOpacity onPress={() => navigation.navigate('Transacciones')}>
            <View style={[styles.subContainer, styles.border]}>
              <Text style={[styles.titulo, styles.bold, { color: '#012148' }]}>Transacciones recientes</Text>
              {cuentas.map((cuenta, index) => (
                cuenta.Transacciones.slice(0, 2).map((transaccion, tIndex) => (
                  <View key={tIndex} style={styles.transaccion}>
                    <View>
                      <Text style={styles.text}>{new Date(transaccion.fecha).toLocaleDateString()}</Text>
                      <Text style={styles.textDescripcion}>{transaccion.nombre}</Text>
                    </View>
                    <Text style={[styles.textTransaccion, styles.right]}>${transaccion.monto}</Text>
                  </View>
                ))
              ))}
            </View>
        </TouchableOpacity>

        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={popupVisible}
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Text style={[styles.titulo, styles.bold, styles.center]}>Tarjeta de crédito</Text>
            <ScrollView contentContainerStyle={styles.scrollView}>
              <TouchableOpacity onPress={() => setPopupVisible(false)}>
                <Image source={require('../assets/tarjeta.png')} style={styles.image}></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPopupVisible(false)}>
                <Image source={require('../assets/tarjeta.png')} style={styles.image}></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPopupVisible(false)}>
                <Image source={require('../assets/tarjeta.png')} style={styles.image}></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPopupVisible(false)}>
                <Image source={require('../assets/tarjeta.png')} style={styles.image}></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPopupVisible(false)}>
                <Image source={require('../assets/tarjeta.png')} style={styles.image}></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPopupVisible(false)}>
                <Image source={require('../assets/tarjeta.png')} style={styles.image}></Image>
              </TouchableOpacity>
            
            </ScrollView>
            <Boton title="Cerrar" onPress={() => setPopupVisible(false)} />
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contenedorPrincipal: {
    width: '90%',
    marginTop: 27
  },
  subContainer: {
    backgroundColor: 'rgba(217, 217, 217, 0.42)',
    borderRadius: 10,
    padding: 18,
    marginBottom: 18
  },
  usuario: {
    fontSize: 18,
    color: '#012148',
    marginTop: 185,
    fontWeight: 'bold'
  },
  center: {
    textAlign: 'center',
    color: '#012148'
  },
  titulo: {
    fontSize: 20
  },
  text: {
    fontSize: 17,
    marginTop: 6
  },
  textMediano: {
    fontSize: 17,
    color: '#235894',
    marginTop: 6
  },
  textCantidadCuenta: {
    fontSize: 16,
    fontStyle: 'italic'
  },
  textDescripcion: {
    fontSize: 14,
    color: '#235894',

  },
  textTransaccion: {
    fontSize: 20,
    fontStyle: 'italic'
  },
  bold: {
    fontWeight: 'bold'
  },
  right: {
    textAlign: 'right'
  },
  image: {
    width: 203,
    height: 135,
    alignSelf: 'center',
    marginTop: 10
  },
  transaccion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: '80%',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  border: {
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default PantallaPrincipal;