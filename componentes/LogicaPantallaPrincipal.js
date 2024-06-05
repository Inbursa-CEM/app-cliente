import React, { useEffect, useState, createContext, useContext } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from '../api';

// Creación del contexto de la aplicación
const LogicaPantallaPrincipal = () => {
    // Hook useEffect para ejecutar código al montar el componente
    useEffect(() => {
        const requestOptions = {
            method: "POST",
            header: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Nuevo",
                body: "post al servidor",
                userId: 2,
                id: 0
            })
        };
        // Petición POST al servidor
        fetch("https://localhost:8080/cliente/cargarCuentas", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Mostrar datos en consola
            })
            .catch((error) => console.log(error));
    }, []); // El array vacío [] indica que este efecto se ejecuta una sola vez al montar el componente

    // Renderizado del componente
    return (
        <View>

        </View>
    )

}; 

export default LogicaPantallaPrincipal;