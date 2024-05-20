import React, {useState, useEffect} from "react";
import { View, Text, ActivityIndicator } from "react-native";

const Logica = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://192.168.0.20:8080/usuario/infoActualAgentes?supervisor=1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => console.error('Error al obtener datos:', error));
  }, []);

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <Text>{JSON.stringify(data)}</Text>
          {/* Aquí puedes renderizar los datos recibidos */}
        </View>
      )}
    </View>

)};
export default Logica;
