// Autores: Ares Ortiz Botello A01747848, Andrés Iván Rodríguez Méndez A01754650
// Objetivo: Mostrar las transacciones realizadas por el cliente

import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Definición del componente funcional 'Transacciones'
const Transacciones = () => {

    const [transacciones, setTransacciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigation = useNavigation();
    const [idCliente, setIdCliente] = useState(null);

    // Función asíncrona para descargar las transacciones del cliente
    const descargarTransacciones = async (numCuenta) => {
        try {
            const info = JSON.stringify({ numCuenta });
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: info,
            };
            // Envío de la petición POST al servidor
            const response = await fetch(
                "http://10.48.104.45:8080/transaccion/getTransacciones",
                requestOptions
            );
            const data = await response.json();
            console.log("Datos recibidos:", data);
            if (Array.isArray(data)) {
                setTransacciones(data);
            } else {
                setTransacciones([]);
            }
        } catch (error) {
            console.error("Error al obtener las transacciones:", error);
            setTransacciones([]);
        } finally {
            setCargando(false);
        }
    };

    // Hook useEffect para ejecutar código al montar el componente
    useEffect(() => {
        const fetchTransacciones = async () => {
            const terminacion = await AsyncStorage.getItem("terminacion");
            const idCliente = await AsyncStorage.getItem('idCliente');
            setIdCliente(idCliente);
            if (terminacion) {
                descargarTransacciones(terminacion);
            }

        };
        fetchTransacciones();
    }, []);

    useEffect(() => {
        console.log("Transacciones:", transacciones);
    }, [transacciones]);

    // Función para formatear la fecha de las transacciones
    const formatearFecha = (fecha) => {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        const fechaNueva = new Date(fecha).toLocaleDateString('es-ES', opciones);
        return fechaNueva.charAt(0).toUpperCase() + fechaNueva.slice(1);
    };

    // Formateo de las transacciones para mostrarlas en la pantalla
    const transaccionesFormateadas = Array.isArray(transacciones) ? transacciones.map(t => ({
        fecha: formatearFecha(t.fecha.split('T')[0]),
        descripcion: t.detalle,
        monto: `$${t.monto}`,
        idTransaccion: t.idTransaccion,
        estatus: t.estatus,
        numCuenta: t.numCuenta,
        nombre: t.nombre,   
    })) : [];

    if (cargando) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }
    // Renderizado del componente
    return (
        <ImageBackground source={require('../assets/PantallaFondo.png')} style={styles.background} resizeMode="cover">
            <View style={styles.container}>
                <Text style={styles.titulo}>Transacciones</Text>
                <View style={[styles.subContainer, styles.border, styles.contenedorTransaccciones]}>
                    <ScrollView>
                        {transaccionesFormateadas.map((transaccion, index) => (
                            <TouchableOpacity 
                            key={index} 
                            style={[styles.transaccion, index !== transaccionesFormateadas.length -1 && styles.transaccionDivider]}
                            onPress={() => navigation.navigate('DetalleTransaccion', {transaccion: transaccion, idCliente: idCliente})}>
                                <View style={styles.transaccionInfo}>
                                    <Text style={styles.fechaTransaccion}>{transaccion.fecha}</Text>
                                    <Text style={styles.transaccionDescripcion}>{transaccion.descripcion}</Text>
                                </View>
                                <View style={styles.contenedorMonto}>
                                    <Text style={styles.montoTransaccion}>Monto:</Text>
                                    <Text style={styles.cantidad}>{transaccion.monto}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </ImageBackground>
    );
};

// Definición de estilos para los componentes usando StyleSheet.create
const styles = StyleSheet.create ({
    // Estilo para la imagen de fondo
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    // Estilo para el contenedor principal
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center' 
    },
    // Estilo para el subcontenedor
    subContainer: {
        backgroundColor: 'rgba(217, 217, 217, 0.42)',
        borderRadius: 10,
        padding: 18,
        marginBottom: 15,
        width: '90%'
    },
    // Estilo para el título
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 195, 
        marginBottom: 20,
        color: '#012148'
    },
    // Estilo para el contenedor de transacciones
    contenedorTransaccciones: {
        flex: 1,
        width: '90%',
        marginTop: 5 
    },
    // Estilo para cada transacción
    transaccion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 18
    },
    // Estilo para la información de la transacción
    transaccionInfo: {
        flex: 1,
        paddingRight: 10
    },
    // Estilo para el divisor de las transacciones
    transaccionDivider: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)'
    },
    // Estilo para la fecha de la transacción
    fechaTransaccion: {
        fontSize:16,
        color: '#012148'
    },
    // Estilo para la descripción de la transacción
    transaccionDescripcion: {
        fontSize: 14,
        color: '#235894'
    },
    // Estilo para el contenedor del monto
    contenedorMonto: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: 130
    },
    // Estilo para el texto de "Monto"
    montoTransaccion: {
        fontSize: 16,
        textAlign: 'right',
        color: '#012148'
    },
    // Estilo para el monto
    cantidad: {
        fontSize: 19,
        fontStyle: 'italic',
        textAlign: 'right',
        color: '#012148',
        marginLeft: 5
    }
});

export default Transacciones;