import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import styled from "styled-components/native";

export default function AyudaContrasena({ navigation }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const esTelefono = (valor) => {
    const telefonoRegex = /^\+?\d{7,15}$/;
    return telefonoRegex.test(valor);
  };

  const esEmail = (valor) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(valor);
  };

  const manejarRecuperacion = () => {
    if (esTelefono(emailOrPhone)) {
      navigation.navigate('VerificacionTel', { TEL: emailOrPhone });
    } else if (esEmail(emailOrPhone)) {
      navigation.navigate('VerificacionEmail', { EMAIL: emailOrPhone });
    } else {
      Alert.alert('Error', 'Introduce un email o teléfono válido');
    }
  };

  return (
    <Contenedor style={{ paddingTop: Platform.OS === "ios" ? 0 : 50 }}>
      <StatusBar style="dark" />

      <Title>Ayuda de contraseña</Title>

      <Descripcion>
        Introduzca la dirección de correo electrónico o el número de teléfono
        móvil asociados con su cuenta de Alcorcón Conecta.
      </Descripcion>

      <InputText
        placeholder="Introduzca su email o teléfono"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Boton onPress={manejarRecuperacion}>
        <BotonTexto>Recuperar contraseña</BotonTexto>
      </Boton>

    </Contenedor>
  );
}

// Estilos corregidos (Sin comillas innecesarias en los valores de color)
const Contenedor = styled.SafeAreaView`
    flex: 1;
    background-color: #fff;
    padding: 24px;
`;

const Title = styled.Text`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 12px;
    color: #000;
`;

const Descripcion = styled.Text`
    font-size: 16px;
    color: #333;
    margin-bottom: 25px;
    line-height: 22px;
`;

const InputText = styled.TextInput`
    height: 50px;
    border-color: #C9D3DB;
    border-radius: 8px;
    border-width: 1px;
    padding: 12px;
    margin-bottom: 20px;
    font-size: 16px;
    background-color: #fff;
`;

const Boton = styled.TouchableOpacity`
    background-color: #f5b70c;
    padding: 15px;
    border-radius: 10px;
    align-items: center;
`;

const BotonTexto = styled.Text`
    color: #000;
    font-weight: bold;
    font-size: 16px;
`;