import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
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
  const [arrayTransacciones, setArrayTransacciones] = useState([]); // [fecha, descripcion, cantidad
  const [cuentas, setCuentas] = useState(null);
  const navigation = useNavigation();
  //Definir variables para las transacciones
  const [nombreTransaccion, setNombreTransaccion] = useState(null);
  const [montoTransaccion, setMontoTransaccion] = useState(null);
  const [fechaTransaccion, setFechaTransaccion] = useState(null);
  const [estatusTransaccion, setEstatusTransaccion] = useState(null);
  const [idTransaccion, setIdTransaccion] = useState(null);
  const [detalleTransaccion, setDetalleTransaccion] = useState(null);
  const [newList, setNewList] = useState([]);

  const descargarTransacciones = async (info, lista) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: info,
      };
      const response = await fetch(
        "http://192.168.0.22:8080/transaccion/getTransacciones",
        requestOptions
      );
      const data = await response.json();
      //por transaccion
      var temp = [];
      for (var i = 0; i < data.length; i++) {
        temp.push([
          data[i].detalle,
          data[i].estatus,
          data[i].fecha,
          data[i].idTransaccion,
          data[i].monto,
          data[i].nombre,
        ]);
      }
      lista.push(temp);
      console.log("Array transacciones:", lista);

      return lista;
    } catch (error) {
      console.error("Error al obtener las transacciones:", error);
    }
  };

  const fetchClienteData = async () => {
    try {
      const nombre = await AsyncStorage.getItem("nombre");
      const infotarjetasString = await AsyncStorage.getItem("InfoTarjetas");
      const cuentas = await AsyncStorage.getItem("cuentas");

      setNombre(nombre);

      if (infotarjetasString) {
        const infotarjetas = JSON.parse(infotarjetasString);
        setInfoTarjetas(infotarjetas);
        console.log("Array recuperado: ", infotarjetas);

        if (
          !tarjetaSeleccionada &&
          infotarjetas[0] &&
          infotarjetas[0].length > 0
        ) {
          setTerminacion(infotarjetas[0][0]); // Establecer la terminación inicial num cuenta
          setSaldo(infotarjetas[1][0]); // Establecer el saldo inicial
          await descargarTransacciones(
            JSON.stringify({ numCuenta: infotarjetas[0][0] }),
            arrayTransacciones
          );
          setNombreTransaccion(arrayTransacciones[0][0][5]);
          setMontoTransaccion(arrayTransacciones[0][0][4]);
          setFechaTransaccion(arrayTransacciones[0][0][2]);
          setEstatusTransaccion(arrayTransacciones[0][0][1]);
          setIdTransaccion(arrayTransacciones[0][0][3]);
          setDetalleTransaccion(arrayTransacciones[0][0][0]);

          await AsyncStorage.setItem(
            "terminacion",
            infotarjetas[0][0].toString()
          );
        }
      }
    } catch (error) {
      console.error(
        "Error al obtener los datos del cliente en pantalla:",
        error
      );
    } finally {
      setCargando(false);
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
    if (!fecha) return "Fecha no disponible";
    const opciones = { year: "numeric", month: "long", day: "numeric" };
    const fechaNueva = new Date(fecha).toLocaleDateString("es-ES", opciones);
    return fechaNueva.charAt(0).toUpperCase() + fechaNueva.slice(1);

  };

  const transaccionesFormateadas = Array.isArray(arrayTransacciones) ? arrayTransacciones.flat().map(t => {
    if (t && t[2] && typeof t[2] === "string") {
      return {
        fecha: formatearFecha(t[2].split("T")[0]),
        descripcion: t[0],
        monto: `$${t[4]}`
      };
    } else {
      return {
        fecha: "Fecha no disponible",
        descripcion: t[0] || "Descripción no disponible",
        monto: t[4] ? `$${t[4]}` : "Monto no disponible"
      };
    }}) : [];


  if (cargando) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const clearList = () => {
    setArrayTransacciones([]); // Actualiza el estado a una matriz vacía
  };

  const handlePress = async (i) => {
    setPopupVisible(false);
    setTarjetaSeleccionada(infotarjetas[0][i]);
    setTerminacion(infotarjetas[0][i]); // Actualizar la terminación
    setSaldo(infotarjetas[1][i]); // Actualizar el saldo
    clearList();
    setNewList([]);
    console.log("Array transacciones en handle:", arrayTransacciones);
    await descargarTransacciones(
      JSON.stringify({ numCuenta: infotarjetas[0][i] }),
      newList
    );
    console.log("Array transacciones en handle2 :", newList);
    setNombreTransaccion(newList[0][0][5]);
    setMontoTransaccion(newList[0][0][4]);
    setEstatusTransaccion(newList[0][0][1]);
    setIdTransaccion(newList[0][0][3]);
    setDetalleTransaccion(newList[0][0][0]);
    console.log(`Tarjeta seleccionada: ${infotarjetas[0][i]}`);

    await AsyncStorage.setItem("terminacion", infotarjetas[0][i].toString());
  };

  return (
    <ImageBackground
      source={require("../assets/PantallaFondo.png")}
      style={styles.background}
      resizeMode="cover"
    >
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
    transaccionesFormateadas.slice(0, 4).map((transaccion, index) => (
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
            <ScrollView contentContainerStyle={styles.scrollView}>
              {infotarjetas[0].map((_, i) => (
                <TouchableOpacity key={i} onPress={() => handlePress(i)}>
                  <Text style={styles.text}>{infotarjetas[0][i]}</Text>
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
    fontSize: 19,
    color: "#012148",
    marginTop: 180,
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
