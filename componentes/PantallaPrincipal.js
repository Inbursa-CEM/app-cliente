// Autores: Ares Ortiz Botello A01747848, Andrés Iván Rodríguez Méndez A01754650
// Objetivo: Mostrar los datos bancarios del cliente (tarjetas, cuentas asociadas, saldo, transacciones recientes)

import React, { useEffect, useState, useCallback } from "react";
import {StyleSheet, View, ImageBackground, Text, Image, Modal, TouchableOpacity, ScrollView, ActivityIndicator,} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Boton from "./Boton";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Definición del componente funcional 'PantallaPrincipal'
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

 // Función asíncrona para obtener los datos del cliente
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

// Función asíncrona para descargar las transacciones de una cuenta
  const descargarTransacciones = async (numCuenta) => {
    try {
      const info = JSON.stringify({ numCuenta });
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: info,
      };
      const response = await fetch(
        "http://10.48.104.45:8080/transaccion/getTransacciones",
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

  // Hook useEffect para ejecutar código al montar el componente
  useEffect(() => {
    fetchClienteData();
  }, []);
  // Hook useFocusEffect para ejecutar código al enfocar el componente
  useFocusEffect(
    useCallback(() => {
      if (tarjetaSeleccionada) {
        fetchClienteData();
      }
    }, [tarjetaSeleccionada])
  );

  // Función para formatear la fecha de una transacción
  const formatearFecha = (fecha) => {
    const opciones = { year: "numeric", month: "long", day: "numeric" };
    const fechaNueva = new Date(fecha).toLocaleDateString("es-ES", opciones);
    return fechaNueva.charAt(0).toUpperCase() + fechaNueva.slice(1);
  };

  // Formatear las transacciones para mostrarlas en la pantalla
  const transaccionesFormateadas = arrayTransacciones.map(t => ({
    fecha: formatearFecha(t[2].split("T")[0]),
    descripcion: t[0],
    monto: `$${t[4]}`,
  }));

  // Función para manejar el evento de presionar una tarjeta
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

  // Renderizado del componente
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
                {/* Botón para mostrar el modal con las tarjetas */}
                <TouchableOpacity onPress={() => setPopupVisible(true)}>
                  <Image
                    source={require("../assets/tarjeta.png")}
                    style={styles.image}
                  ></Image>
                </TouchableOpacity>
              </View>

              {/* Mostrar la información de la cuenta bancaria si está disponible */}
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

              {/* Botón para navegar a la pantalla de transacciones más recientes */}
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
          
          {/* Modal para seleccionar una tarjeta */}
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
                  {/* Listado de tarjetas */}
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

// Definición de los estilos del componente
const styles = StyleSheet.create({
  // Estilo para la imagen de fondo
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  // Estilo para el contenedor
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Estilo para el contenedor principal
  contenedorPrincipal: {
    width: "90%",
    marginTop: 22,
  },
  // Estilo para el subcontenedor
  subContainer: {
    backgroundColor: "rgba(217, 217, 217, 0.42)",
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
  },
  // Estilo para el nombre de usuario
  usuario: {
    fontSize: 19,
    color: "#012148",
    marginTop: 188,
  },
  // Estilo para el centrado de componentes
  center: {
    textAlign: "center",
    color: "#012148",
  },
  // Estilo para el titulo
  titulo: {
    fontSize: 20,
  },
  // Estilo para el texto
  text: {
    fontSize: 17,
    marginTop: 6,
  },
  // Estilo para el texto mediano
  textMediano: {
    fontSize: 17,
    color: "#235894",
    marginTop: 6,
  },
  // Estilo para el texto del saldo de la cuenta 
  textCantidadCuenta: {
    fontSize: 16,
    fontStyle: "italic",
  },
  // Estilo para el texto de descripcion de transaccion
  textDescripcion: {
    fontSize: 14,
    color: "#235894",
  },
  // Estilo para el texto del tituo de transaccion
  textTransaccion: {
    fontSize: 20,
    fontStyle: "italic",
  },
  // Estilo para poder usar negritas
  bold: {
    fontWeight: "bold",
  },
  // Estilo para alinear a la derecha
  right: {
    textAlign: "right",
  },
  // Estilo para la imagen de tarjetas
  image: {
    width: 203,
    height: 135,
    alignSelf: "center",
    marginTop: 10,
  },
  // Estilo para el display de transacciones
  transaccion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Estilo para el contenedor del modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  // Estilo para el contenido del modal
  modalContent: {
    backgroundColor: "#D9D9D9",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    maxHeight: "80%",
  },
  // Estilo del scroll en pantalla
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  // Estilo de bordes
  border: {
    borderWidth: 1,
    borderColor: "gray",
  },
});

export default PantallaPrincipal;