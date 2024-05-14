import React from "react";
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Linking } from "react-native";

const DetalleTransaccion = () => {

    const llamar = () => {
        const folio = '123456'; { /* cambiar cuando recibamos info */}
        const num = 'tel:+525587596904';
        Linking.openURL(num)
            .catch(err => console.error('An error occurred', err));
    };

    return (
        <ImageBackground source={require('../assets/PantallaFondo.png')} style={styles.background} resizeMode="cover">
            <View style={styles.container}>
                <Text style={styles.titulo}>Detalles del Movimiento</Text>
                <View style={styles.containerDatos}>
                    <Text style={styles.dia}>Miércoles</Text>
                    <Text style={styles.monto}>$399</Text>
                    <Text style={styles.fecha}>24 de Enero 2024</Text>
                </View>

                <View style={styles.containerDetalle}>
                    <Text style={styles.subtitulo}>Cuenta</Text>
                    <Text style={styles.detalle}>0000 2222 4444 5555</Text>
                    <Text style={styles.subtitulo}>Tipo de movimiento</Text>
                    <Text style={styles.detalle}>Cargo</Text>
                    <Text style={styles.subtitulo}>Descripcion</Text>
                    <Text style={styles.detalle}>Compra riot games</Text>
                    <Text style={styles.subtitulo}>Hora</Text>
                    <Text style={styles.detalle}>15:28 pm</Text>
                    <Text style={styles.subtitulo}>Folio</Text>
                    <Text style={styles.detalle}>123456</Text>
                    <Text style={styles.subtitulo}>Estatus</Text>
                    <Text style={styles.detalle}>Normal</Text>
                </View>

                <TouchableOpacity style={styles.boton} onPress={llamar}>
                    <Text style={styles.textoBoton}>No reconozco este movimiento</Text>
                </TouchableOpacity>

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
    containerDatos: {
        backgroundColor: 'rgba(217, 217, 217, 0.42)',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        width: '90%',
        alignItems: 'center'
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 200, 
        marginBottom: 10,
        color: '#012148'  
    },
    dia: {
        fontSize: 20,
        color: '#012148'
    },
    monto: {
        fontSize: 30,
        color: '#012148',
        fontWeight: 'bold'
    },
    fecha: {
        fontSize: 17,
        color: '#012148'
    },
    containerDetalle: {
        backgroundColor: 'rgba(217, 217, 217, 0.42)',
        borderRadius: 10,
        padding: 18,
        marginBottom: 15,
        width: '90%', 
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#012148',
        marginBottom: 5
    },
    detalle: {
        fontSize: 17,
        fontStyle: 'italic',
        color: '#012148',
        marginBottom: 5
    },
    boton: {
        backgroundColor: 'rgba(35, 88, 148, 0.86)',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        marginBottom: 30,
    },
    textoBoton: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    }
});

export default DetalleTransaccion;
