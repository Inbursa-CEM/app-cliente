import React, { useEffect, useState } from "react";
import {StyleSheet, View, ImageBackground, Text, Image, Modal, TouchableOpacity, ScrollView,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Boton from "./Boton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PantallaPrincipal = () => {
  const [nombre, setNombre] = useState(null);
  let tarjetas = [];
  const [numCuenta, setnumCuenta] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const navigation = useNavigation();
  const [cuentas, setCuentas] = useState(null); 
  const [saldo, setSaldo] = useState(null);
  //Array
  const [arrayValores, setArrayValores] = useState([]);

  useEffect(() => {
    const fetchClienteData = async () => {
      try {
        const idCliente = await AsyncStorage.getItem("idCliente");
        const nombre = await AsyncStorage.getItem("nombre");
        const cliente = idCliente[0];
        //Jalar los datitos del array guardado
        const arrayValoresString = await AsyncStorage.getItem('arrayValores');

        setNombre(nombre);
        setCliente(cliente);
        if (idCliente) {
          //Llamada a la API para obtener los datos del cliente
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idCliente }),
          };


          const response = await fetch(
            "http://10.48.70.212:8080/cuenta/cuentas",
            requestOptions
          );
          const data = await response.json();
          const cuentas = data[0].idCuenta;
          setCuentas(cuentas);

          const requestOptions2 = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idCuenta: cuentas }),
          };
          const response2 = await fetch(
            "http://10.48.70.212:8080/tarjeta/getTarjetasxCuenta",
            requestOptions2
          );
          const data2 = await response2.json();
          tarjetas = data2;
          console.log(tarjetas);
          setnumCuenta(tarjetas[0].numCuenta);
          setSaldo(tarjetas[0].saldo);
          

          if (!response.ok) {
            throw new Error(
              data.error || "Error al obtener los datos del cliente en pantalla"
            );
          }

          //Hacer un parse para volver a pasar el string de array a un array
          if(arrayValoresString) {
            const arrayValores = JSON.parse(arrayValoresString);
            setArrayValores(arrayValores);
            console.log('Array recuperado: ', arrayValores);
          }
          
        } else {
          console.error("idCliente no encontrado en AsyncStorage");
        }
      } catch (error) {
        console.error(
          "Error al obtener los datos del cliente en pantalla:",
          error
        );
      }
    };
    console.log("Tarjetas", tarjetas);
    fetchClienteData();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/PantallaFondo.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.usuario}>{nombre}</Text>
        <View style={styles.contenedorPrincipal}>
          <View style={[styles.subContainer, styles.border]}>
            <Text style={[styles.titulo, styles.bold, styles.center]}>
              Mis tarjetas
            </Text>
            <TouchableOpacity onPress={() => setPopupVisible(true)}>
              <Text>{}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.subContainer, styles.border]}>
            <Text style={[styles.titulo, styles.bold, { color: "#012148" }]}>
              Cuenta bancaria
            </Text>
            <View style={styles.transaccion}>
              <View>
                <Text style={styles.textMediano}>Terminación</Text>
                <Text style={styles.textCantidadCuenta}>{numCuenta}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.textMediano}>Saldo disponible</Text>
                <Text style={styles.textCantidadCuenta}>{saldo}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Transacciones")}
          >
            <View style={[styles.subContainer, styles.border]}>
              <Text style={[styles.titulo, styles.bold, { color: "#012148" }]}>
                Transacciones recientes
              </Text>
              <View style={styles.transaccion}>
                <View>
                  <Text style={styles.text}>18 Mayo 2024</Text>
                  <Text style={styles.textDescripcion}>Pull bear polanco</Text>
                </View>
                <Text style={[styles.textTransaccion, styles.right]}>
                  $3000
                </Text>
              </View>
              <View style={styles.transaccion}>
                <View>
                  <Text style={styles.text}>12 Mayo 2024</Text>
                  <Text style={styles.textDescripcion}>
                    Pago cuenta de tercero
                  </Text>
                </View>
                <Text style={[styles.textTransaccion, styles.right]}>
                  $1000
                </Text>
              </View>
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
            <Text style={[styles.titulo, styles.bold, styles.center]}>
              Tarjeta de crédito
            </Text>
            <ScrollView contentContainerStyle={styles.scrollView}>
              {[...Array(6)].map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setPopupVisible(false)}
                >
                  <Image
                    source={require("../assets/tarjeta.png")}
                    style={styles.image}
                  ></Image>
                </TouchableOpacity>
              ))}
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
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contenedorPrincipal: {
    width: "90%",
    marginTop: 27,
  },
  subContainer: {
    backgroundColor: "rgba(217, 217, 217, 0.42)",
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
  },
  usuario: {
    fontSize: 18,
    color: "#012148",
    marginTop: 185,
    fontWeight: "bold",
  },
  center: {
    textAlign: "center",
    color: "#012148",
  },
  titulo: {
    fontSize: 20,
  },
  text: {
    fontSize: 17,
    marginTop: 6,
  },
  textMediano: {
    fontSize: 17,
    color: "#235894",
    marginTop: 6,
  },
  textCantidadCuenta: {
    fontSize: 16,
    fontStyle: "italic",
  },
  textDescripcion: {
    fontSize: 14,
    color: "#235894",
  },
  textTransaccion: {
    fontSize: 20,
    fontStyle: "italic",
  },
  bold: {
    fontWeight: "bold",
  },
  right: {
    textAlign: "right",
  },
  image: {
    width: 203,
    height: 135,
    alignSelf: "center",
    marginTop: 10,
  },
  transaccion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    maxHeight: "80%",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  border: {
    borderWidth: 1,
    borderColor: "gray",
  },
});

export default PantallaPrincipal;
