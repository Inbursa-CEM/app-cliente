import React from "react";
import { StyleSheet, View, ImageBackground, Text, Image } from "react-native";

const PantallaPrincipal = () => {
    return (
        <ImageBackground source={require('../assets/PantallaFondo.png')} style={styles.background} resizeMode="cover">
          <View style={styles.container}>
            <Text style={styles.usuario}>Andrés Iván Rodríguez Méndez</Text>
            <View style={styles.contenedorPrincipal}>
              <View style={styles.subContainer}>
                <Text style={[styles.titulo, styles.bold, styles.center]}>Mis tarjetas</Text>
                <Image source={require('../assets/tarjeta.png')} style={styles.image}></Image>
              </View>

              <View style={styles.subContainer}>
                <Text style={[styles.titulo, styles.bold, {color: '#012148'}]}>Cuentas bancarias</Text>
                <View style={styles.transaccion}>
                    <View>
                        <Text style={styles.textMediano}>Terminación</Text>
                        <Text style={styles.textCantidadCuenta}>*12345</Text>
                    </View>
                    <View style={styles.right}>
                        <Text style={styles.textMediano}>Saldo disponible</Text>
                        <Text style={styles.textCantidadCuenta}>$30,000</Text>
                    </View>
                </View>
                <View style={styles.transaccion}>
                    <View>
                        <Text style={styles.textMediano}>Terminación</Text>
                        <Text style={styles.textCantidadCuenta}>*67890</Text>
                    </View>
                    <View style={styles.right}>
                        <Text style={styles.textMediano}>Saldo disponible</Text>
                        <Text style={styles.textCantidadCuenta}>$10,000</Text>
                    </View>
                </View>
              </View>

              <View style={styles.subContainer}>
                <Text style={[styles.titulo, styles.bold, {color:'#012148'}]}>Transacciones recientes</Text>
                <View style={styles.transaccion}>
                    <View>
                        <Text style={styles.text}>18 Mayo 2024</Text>
                        <Text style={styles.textDescripcion}>Pull bear polanco</Text>
                    </View>
                    <Text style={[styles.textTransaccion, styles.right]}>$3000</Text>
                </View>
                <View style={styles.transaccion}>
                    <View>
                        <Text style={styles.text}>12 Mayo 2024</Text>
                        <Text style={styles.textDescripcion}>Pago cuenta de tercero</Text>
                    </View>
                    <Text style={[styles.textTransaccion, styles.right]}>$1000</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      );
};

const styles = StyleSheet.create({
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
      contenedorPrincipal: {
        width: '90%',
        marginTop: 22
      },
      subContainer: {
        backgroundColor: 'rgba(217, 217, 217, 0.42)',
        borderRadius: 10,
        padding: 18,
        marginBottom: 15
      },
      usuario: {
        fontSize: 18,
        color: '#012148',
        marginTop: 185,
        fontWeight: 'bold'
      },
      center: {
        textAlign: 'center',
        color: '#012148'
      },
      titulo: {
        fontSize: 20
      },
      text: {
        fontSize: 17,
        marginTop: 6
      },
      textMediano: {
        fontSize: 17,
        color: '#235894',
        marginTop: 6
      },
      textCantidadCuenta: {
        fontSize: 16,
        fontStyle: 'italic'
      },
      textDescripcion: {
        fontSize: 14,
        color: '#235894',

      },
      textTransaccion: {
        fontSize: 20,
        fontStyle: 'italic'
      },
      bold: {
        fontWeight: 'bold'
      },
      right: {
        textAlign: 'right'
      },
      image: {
        width: 203,
        height: 135,
        alignSelf: 'center',
        marginTop: 10
      },
      transaccion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
});

export default PantallaPrincipal;
