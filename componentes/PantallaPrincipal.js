import React, { useEffect, useState, useCallback } from "react";
import {StyleSheet, View, ImageBackground, Text, Image, Modal, TouchableOpacity, ScrollView, ActivityIndicator,} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Boton from "./Boton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PantallaPrincipal = () => {
  const [nombre, setNombre] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [infotarjetas, setInfoTarjetas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
  const [terminacion, setTerminacion] = useState(null);
  const [saldo, setSaldo] = useState(null);
  const [arrayTransacciones, setArrayTransacciones] = useState([]);
  const navigation = useNavigation();

  const fetchClienteData = async () => {
    try {
      const nombre = await AsyncStorage.getItem("nombre");
      const infotarjetasString = await AsyncStorage.getItem("InfoTarjetas");
      setNombre(nombre);

      if (infotarjetasString) {
        const infotarjetas = JSON.parse(infotarjetasString);
        setInfoTarjetas(infotarjetas);

        if (
          !tarjetaSeleccionada &&
          infotarjetas[0] &&
          infotarjetas[0].length > 0
        ) {
          setTerminacion(infotarjetas[0][0]);
          setSaldo(infotarjetas[1][0]);
          await descargarTransacciones(infotarjetas[0][0]);
          await AsyncStorage.setItem(
            "terminacion",
            infotarjetas[0][0].toString()
          );
        }
      }
    } catch (error) {
      console.error("Error al obtener los datos del cliente en pantalla:", error);
    } finally {
      setCargando(false);
    }
  };

  const descargarTransacciones = async (numCuenta) => {
    try {
      const info = JSON.stringify({ numCuenta });
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: info,
      };
      const response = await fetch(
        "http://192.168.0.17:8080/transaccion/getTransacciones",
        requestOptions
      );
      const data = await response.json();
      const temp = data.map(transaccion => [
        transaccion.detalle,
        transaccion.estatus,
        transaccion.fecha,
        transaccion.idTransaccion,
        transaccion.monto,
        transaccion.nombre,
      ]);
      setArrayTransacciones(temp);
    } catch (error) {
      console.error("Error al obtener las transacciones:", error);
    }
  };

  useEffect(() => {
    fetchClienteData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (tarjetaSeleccionada) {
        fetchClienteData();
      }
    }, [tarjetaSeleccionada])
  );

  const formatearFecha = (fecha) => {
    const opciones = { year: "numeric", month: "long", day: "numeric" };
    const fechaNueva = new Date(fecha).toLocaleDateString("es-ES", opciones);
    return fechaNueva.charAt(0).toUpperCase() + fechaNueva.slice(1);
  };

  const transaccionesFormateadas = arrayTransacciones.map(t => ({
    fecha: formatearFecha(t[2].split("T")[0]),
    descripcion: t[0],
    monto: `$${t[4]}`,
  }));

  const handlePress = async (i) => {
    setPopupVisible(false);
    setTarjetaSeleccionada(infotarjetas[0][i]);
    setTerminacion(infotarjetas[0][i]);
    setSaldo(infotarjetas[1][i]);
    setArrayTransacciones([]);
    await descargarTransacciones(infotarjetas[0][i]);
    await AsyncStorage.setItem("terminacion", infotarjetas[0][i].toString());
  };

  if (cargando) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground
      source={require("../assets/PantallaFondo.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.contenedorScroll}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.usuario}>Hola, {nombre}</Text>
            <View style={styles.contenedorPrincipal}>
              <View style={[styles.subContainer, styles.border]}>
                <Text style={[styles.titulo, styles.bold, styles.center]}>
                  Mis tarjetas
                </Text>
                <TouchableOpacity onPress={() => setPopupVisible(true)}>
                  <Image
                    source={require("../assets/tarjeta.png")}
                    style={styles.image}
                  ></Image>
                </TouchableOpacity>
              </View>

              {infotarjetas && infotarjetas.length === 2 && (
                <View style={[styles.subContainer, styles.border]}>
                  <Text style={[styles.titulo, styles.bold, { color: "#012148" }]}>
                    Cuenta bancaria
                  </Text>
                  <View style={styles.transaccion}>
                    <View>
                      <Text style={styles.textMediano}>Terminación</Text>
                      <Text style={styles.textCantidadCuenta}>{terminacion}</Text>
                    </View>
                    <View style={styles.right}>
                      <Text style={styles.textMediano}>Saldo disponible</Text>
                      <Text style={styles.textCantidadCuenta}>{saldo}</Text>
                    </View>
                  </View>
                </View>
              )}

              <TouchableOpacity onPress={() => navigation.navigate("Transacciones")}>
                <View style={[styles.subContainer, styles.border]}>
                  <Text style={[styles.titulo, styles.bold, { color: "#012148" }]}>
                    Transacciones más recientes
                  </Text>
                  {transaccionesFormateadas.length > 0 ? (
                    transaccionesFormateadas.slice(0, 3).map((transaccion, index) => (
                      <View key={index} style={styles.transaccion}>
                        <View>
                          <Text style={styles.text}>{transaccion.fecha}</Text>
                          <Text style={styles.textDescripcion}>{transaccion.descripcion}</Text>
                        </View>
                        <Text style={[styles.textTransaccion, styles.right]}>
                          {transaccion.monto}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.text}>No hay transacciones disponibles</Text>
                  )}
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
                  Tarjetas
                </Text>
                  {infotarjetas[0].map((_, i) => (
                    <TouchableOpacity key={i} onPress={() => handlePress(i)}>
                      <Text style={styles.text}>{infotarjetas[0][i]}</Text>
                    </TouchableOpacity>
                  ))}
                <Boton title="Cerrar" onPress={() => setPopupVisible(false)} />
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
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
    marginTop: 22,
  },
  subContainer: {
    backgroundColor: "rgba(217, 217, 217, 0.42)",
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
  },
  usuario: {
    fontSize: 19,
    color: "#012148",
    marginTop: 188,
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
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  modalContent: {
    backgroundColor: "#D9D9D9",
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
