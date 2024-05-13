import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

const Transacciones = () => {

    const [mesSeleccionado, setMesSeleccionado] = useState("Enero");
    const navigation = useNavigation();

    const meses = [
        "En", "Feb", "Mar", "Abr", "May", "Jun", 
        "Jul", "Ag", "Sep", "Oct", "Nov", "Dec"
    ];

    const transacciones = [
        {fecha: "1 Enero 2024", descripcion: "Aliexpress pago", monto: "Monto:", cantidad: "$1820"},
        {fecha: "3 Enero 2024", descripcion: "Steam firewatch", monto: "Monto:", cantidad: "$230"},
        {fecha: "5 Enero 2024", descripcion: "Spotify premium pago", monto: "Monto:", cantidad: "$129"},
        {fecha: "12 Enero 2024", descripcion: "Pago cuenta de tercero", monto: "Monto:", cantidad: "$1600"},
        {fecha: "18 Enero 2024", descripcion: "Bershka polanco", monto: "Monto", cantidad: "$630"},
        {fecha: "22 Enero 2024", descripcion: "Pago cuenta de tercero", monto: "Monto:", cantidad: "$300"},
        {fecha: "24 Enero 2024", descripcion: "D localriot", monto: "Monto:", cantidad: "$399"},
        {fecha: "26 Enero 2024", descripcion: "Pago cuenta de tercero", monto: "Monto:", cantidad: "$2095"},
        {fecha: "31 Enero 2024", descripcion: "Krispy kreme pago", monto: "Monto:", cantidad: "$200"}
    ];

    return (
        <ImageBackground source={require('../assets/PantallaFondo.png')} style={styles.background} resizeMode="cover">
            <View style={styles.container}>
                <Text style={styles.titulo}>Transacciones</Text>
                <View style={[styles.subContainer, styles.border]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.contenedorMeses}>
                        {meses.map(mes => (
                            <TouchableOpacity key={mes} onPress={() => setMesSeleccionado(mes)}>
                                <Text style={[styles.textoMes, mesSeleccionado === mes && styles.mesSeleccionado]}>{mes}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={[styles.subContainer, styles.border, styles.contenedorTransaccciones]}>
                    <ScrollView>
                        {transacciones.map((transaccion, index) => (
                            <TouchableOpacity key={index} style={[styles.transaccion, index !== transacciones.length -1 && styles.transaccionDivider]}>
                                <View>
                                    <Text style={styles.fechaTransaccion}>{transaccion.fecha}</Text>
                                    <Text style={styles.transaccionDescripcion}>{transaccion.descripcion}</Text>
                                </View>
                                <View style={styles.contenedorMonto}>
                                    <Text style={styles.montoTransaccion}>{transaccion.monto}</Text>
                                    <Text style={styles.cantidad}>{transaccion.cantidad}</Text>
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
        marginTop: 185, 
        marginBottom: 20,
        color: '#012148'
    },
    contenedorMeses: {
        marginBottom: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    textoMes: {
        fontSize: 18,
        marginRight: 10,
        color: '#012148'
    },
    mesSeleccionado: {
        fontWeight: 'bold',
        color: '#012148'
    },
    contenedorTransaccciones: {
        flex: 1,
        width: '90%'
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