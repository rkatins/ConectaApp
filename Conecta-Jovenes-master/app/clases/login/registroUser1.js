import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { nombreUsuario } from "./control";

export default function CreateUser1({ navigation }) {
  const [fecha, setFecha] = useState(new Date(new Date().getFullYear() - 18, 0, 1));
  const [mostrar, setMostrar] = useState(false);
  const [nomUsuario, setNombreUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");

  const refNombre = useRef();
  const refApellido = useRef();

  const onChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setMostrar(false);
    if (selectedDate) setFecha(selectedDate);
  };

  const comprobarCampos = () => {
    if (!nomUsuario.trim() || !nombre.trim() || !apellidos.trim()) {
      Alert.alert("Campos incompletos", "Por favor, rellena todos los campos.");
      return false;
    }
    return true;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1, backgroundColor: "#F8F9FE" }}
    >
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#5099F8" />
          </BackButton>
          <View>
            <Titulo>Crear Cuenta</Titulo>
            <PasoText>Paso 1 de 2</PasoText>
          </View>
        </Header>

        <Container>
          <LabelAzul>Identidad</LabelAzul>
          <Tarjeta>
            <InputWrapper>
              <Ionicons name="at-outline" size={20} color="#5099F8" />
              <InputStyled
                placeholder="Nombre de usuario"
                placeholderTextColor="#A5C8F9"
                autoCapitalize="none"
                value={nomUsuario}
                onChangeText={(text) => setNombreUsuario(nombreUsuario(text))}
                returnKeyType="next"
                onSubmitEditing={() => refNombre.current.focus()}
              />
            </InputWrapper>
            <Separador />
            <InputWrapper>
              <Ionicons name="person-outline" size={20} color="#5099F8" />
              <InputStyled
                ref={refNombre}
                placeholder="Nombre"
                placeholderTextColor="#A5C8F9"
                value={nombre}
                onChangeText={setNombre}
                returnKeyType="next"
                onSubmitEditing={() => refApellido.current.focus()}
              />
            </InputWrapper>
            <Separador />
            <InputWrapper>
              <Ionicons name="people-outline" size={20} color="#5099F8" />
              <InputStyled
                ref={refApellido}
                placeholder="Apellidos"
                placeholderTextColor="#A5C8F9"
                value={apellidos}
                onChangeText={setApellidos}
              />
            </InputWrapper>
          </Tarjeta>

          <LabelAzul>Nacimiento</LabelAzul>
          <Tarjeta>
            <TouchableOpacity 
              onPress={() => setMostrar(true)} 
              style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="calendar-outline" size={20} color="#5099F8" />
                <DateText>{fecha.toLocaleDateString('es-ES')}</DateText>
              </View>
              <Ionicons name="chevron-down" size={16} color="#5099F8" />
            </TouchableOpacity>
          </Tarjeta>

          {mostrar && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={onChange}
              // Configuración de color para que las letras se vean azules
              textColor="#1e3a8a" 
              accentColor="#5099F8" 
            />
          )}

          <BotonContinuar onPress={() => { 
            if (comprobarCampos()) {
              navigation.navigate('CrearCuenta2', { 
                NOMUSUARIO: nomUsuario, 
                NOMBRE: nombre, 
                APELLIDOS: apellidos, 
                FECHA: fecha.toISOString() 
              }); 
            }
          }}>
            <TextoBoton>Siguiente paso</TextoBoton>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </BotonContinuar>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- ESTILOS ---

const Header = styled.View` 
  flex-direction: row; 
  align-items: center; 
  padding: 60px 20px 20px; 
  background-color: #fff; 
`;

const BackButton = styled.TouchableOpacity` 
  background-color: #EBF4FF; 
  padding: 10px; 
  border-radius: 12px; 
  margin-right: 15px; 
`;

const Titulo = styled.Text` 
  font-size: 24px; 
  font-weight: 800; 
  color: #1e3a8a; 
`;

const PasoText = styled.Text` 
  color: #5099F8; 
  font-size: 14px; 
  font-weight: 600; 
`;

const Container = styled.View` 
  padding: 20px; 
`;

const LabelAzul = styled.Text` 
  color: #5099F8; 
  font-weight: 800; 
  font-size: 12px; 
  text-transform: uppercase; 
  margin-top: 20px; 
  margin-bottom: 10px; 
  margin-left: 5px; 
`;

const Tarjeta = styled.View` 
  background-color: #fff; 
  border-radius: 20px; 
  padding: 5px 15px; 
  border: 1px solid #D0E3FF; 
`;

const InputWrapper = styled.View` 
  flex-direction: row; 
  align-items: center; 
  padding: 12px 0; 
`;

const InputStyled = styled.TextInput` 
  flex: 1; 
  margin-left: 12px; 
  font-size: 16px; 
  color: #1e3a8a; 
  font-weight: 500; 
`;

const Separador = styled.View` 
  height: 1px; 
  background-color: #EBF4FF; 
`;

const DateText = styled.Text` 
  margin-left: 12px; 
  font-size: 16px; 
  color: #1e3a8a; 
  font-weight: 600; 
`;

const BotonContinuar = styled.TouchableOpacity` 
  background-color: #5099F8; 
  flex-direction: row; 
  padding: 18px; 
  border-radius: 18px; 
  justify-content: center; 
  align-items: center; 
  margin-top: 30px; 
  elevation: 5; 
`;

const TextoBoton = styled.Text` 
  color: #fff; 
  font-size: 18px; 
  font-weight: 800; 
  margin-right: 10px; 
`;