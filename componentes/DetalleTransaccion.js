// Autores: Ares Ortiz Botello A01747848, Andrés Iván Rodríguez Méndez A01754650
// Objetivo: Mostrar la informacion detallada de una transacción seleccionada por el cliente

// Uso del hook 'useRoute' para obtener los parámetros pasados a esta pantalla
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Linking, ActivityIndicator } from "react-native";

const DetalleTransaccion = () => {
    const route = useRoute();
    const {transaccion} = route.params;
    const {idCliente} = route.params;
    // Función asíncrona para levantar un reporte
    const levantarReporte = async () => {
        try {
            const info = JSON.stringify({ idCliente, idTransaccion: transaccion.idTransaccion });
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: info,
            };
            // Envío de la petición POST al servidor
            const response = await fetch(
                "http://10.48.104.45:8080/reporte/postReporte",
                requestOptions
            );
        } catch (error) {
            // Manejo de errores en caso de que la petición falle
            console.error("Error al levantar reporte:", error);
        }
    }
    // Función para realizar una llamada telefónica y levantar un reporte
    const llamar = () => {
        const folio = '123456'; { /* cambiar cuando recibamos info */}
        const num = 'tel:8006490590';
        Linking.openURL(num)
            .catch(err => console.error('An error occurred', err));
        console.log('idCliente en llamar:', idCliente);
        console.log('idTransaccion en llamar:', transaccion.idTransaccion);
        levantarReporte();
    };

    // Retorno de la vista del componente
    return (
        // Imagen de fondo de la pantalla
        <ImageBackground source={require('../assets/PantallaFondo.png')} style={styles.background} resizeMode="cover">
            <View style={styles.container}>
                <Text style={styles.titulo}>Detalles del Movimiento</Text>
                <View style={styles.containerDatos}>
                    <Text style={styles.dia}>Monto:</Text>
                    <Text style={styles.monto}>{transaccion.monto}</Text>
                    <Text style={styles.fecha}>{transaccion.fecha}</Text>
                </View>

                <View style={styles.containerDetalle}>
                    <Text style={styles.subtitulo}>Cuenta</Text>
                    <Text style={styles.detalle}>{transaccion.numCuenta}</Text>
                    <Text style={styles.subtitulo}>Nombre</Text>
                    <Text style={styles.detalle}>{transaccion.nombre}</Text>
                    <Text style={styles.subtitulo}>Tipo de movimiento</Text>
                    <Text style={styles.detalle}>Cargo</Text>
                    <Text style={styles.subtitulo}>Descripcion</Text>
                    <Text style={styles.detalle}>{transaccion.descripcion}</Text>
                    <Text style={styles.subtitulo}>Folio</Text>
                    <Text style={styles.detalle}>{transaccion.idTransaccion}</Text>
                    <Text style={styles.subtitulo}>Estatus</Text>
                    <Text style={styles.detalle}>{transaccion.estatus}</Text>
                </View>

                <TouchableOpacity style={styles.boton} onPress={llamar}>
                    <Text style={styles.textoBoton}>No reconozco este movimiento</Text>
                </TouchableOpacity>

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
    // Estilo para el contenedor de datos principales 
    containerDatos: {
        backgroundColor: 'rgba(217, 217, 217, 0.42)',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        width: '90%',
        alignItems: 'center'
    },
    // Estilo para el titulo
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 200, 
        marginBottom: 10,
        color: '#012148'  
    },
    // Estilo para el texto de "monto"
    dia: {
        fontSize: 20,
        color: '#012148'
    },
    // Estilo para el monto
    monto: {
        fontSize: 30,
        color: '#012148',
        fontWeight: 'bold'
    },
    // Estilo para la fecha
    fecha: {
        fontSize: 17,
        color: '#012148'
    },
    // Estilo para el contenedor de los detalles
    containerDetalle: {
        backgroundColor: 'rgba(217, 217, 217, 0.42)',
        borderRadius: 10,
        padding: 18,
        marginBottom: 15,
        width: '90%', 
    },
    // Estilo para los subtítulos
    subtitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#012148',
        marginBottom: 5
    },
    // Estilo para los detalles
    detalle: {
        fontSize: 17,
        fontStyle: 'italic',
        color: '#012148',
        marginBottom: 5
    },
    // Estilo para el botón
    boton: {
        backgroundColor: 'rgba(35, 88, 148, 0.86)',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        marginBottom: 30,
    },
    // Estilo para el texto del botón
    textoBoton: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    }
});

export default DetalleTransaccion;