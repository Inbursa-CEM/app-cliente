import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Transacciones = () => {

    const [transacciones, setTransacciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mesSeleccionado, setMesSeleccionado] = useState("Enero");
    const navigation = useNavigation();

    const descargarTransacciones = async (numCuenta) => {
        try {
            const info = JSON.stringify({ numCuenta });
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: info,
            };
            const response = await fetch(
                "http://10.48.70.212:8080/transaccion/getTransacciones",
                requestOptions
            );
            const data = await response.json();
            console.log("Datos recibidos:", data); // Verificar datos recibidos
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

    useEffect(() => {
        const fetchTransacciones = async () => {
            const terminacion = await AsyncStorage.getItem("terminacion");
            if (terminacion) {
                descargarTransacciones(terminacion);
            }
        };
        fetchTransacciones();
    }, []);

    useEffect(() => {
        console.log("Transacciones:", transacciones); // Verificar estado de transacciones
    }, [transacciones]);

    const formatearFecha = (fecha) => {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        const fechaNueva = new Date(fecha).toLocaleDateString('es-ES', opciones);
        console.log(fechaNueva);
        return fechaNueva.charAt(0).toUpperCase() + fechaNueva.slice(1);
    };

    const transaccionesFormateadas = Array.isArray(transacciones) ? transacciones.map(t => ({
        fecha: formatearFecha(t.fecha.split('T')[0]),
        descripcion: t.detalle,
        monto: `$${t.monto}`
    })) : [];

    if (cargando) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

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
                            onPress={() => navigation.navigate('DetalleTransaccion', {transaccion: transaccion})}>
                                <View>
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

const styles = StyleSheet.create ({
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
    subContainer: {
        backgroundColor: 'rgba(217, 217, 217, 0.42)',
        borderRadius: 10,
        padding: 18,
        marginBottom: 15,
        width: '90%'
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 195, 
        marginBottom: 20,
        color: '#012148'
    },
    contenedorTransaccciones: {
        flex: 1,
        width: '90%',
        marginTop: 5 
    },
    transaccion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20
    },
    transaccionDivider: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)'
    },
    fechaTransaccion: {
        fontSize:16,
        color: '#012148'
    },
    transaccionDescripcion: {
        fontSize: 14,
        color: '#235894'
    },
    contenedorMonto: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 130
    },
    montoTransaccion: {
        fontSize: 16,
        marginLeft: 60,
        color: '#012148'
    },
    cantidad: {
        fontSize: 19,
        fontStyle: 'italic',
        marginLeft: 60,
        color: '#012148'
    }
});

export default Transacciones;