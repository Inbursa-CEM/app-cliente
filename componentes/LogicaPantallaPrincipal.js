import React, { useEffect, useState, createContext, useContext } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from '../api';


const LogicaPantallaPrincipal = () => {
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

        fetch("https://localhost:8080/cliente/cargarCuentas", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <View>

        </View>
    )

}; 

export default LogicaPantallaPrincipal;