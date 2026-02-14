import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { useContext, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Switch, View } from 'react-native';
import styled from "styled-components/native";
import AuthContext from "../../contexts/authContext";
import { loadUser, registro } from '../../services/authService';
import { contraseniaDebil, pedirTelefono } from './control';

export default function RegistroScreen({ route, navigation }) {
  const { setUser } = useContext(AuthContext);
  const { NOMUSUARIO, NOMBRE, APELLIDOS, FECHA } = route.params;

  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [tieneDiscapacidad, setTieneDiscapacidad] = useState(false);
  const [esEmpresa, setEsEmpresa] = useState(false);
  const [esFamiliar, setEsFamiliar] = useState(false);
  const [porcentajeDiscapacidad, setPorcentajeDiscapacidad] = useState(0);
  const [errorPass, setErrorPass] = useState("");
  const [loading, setLoading] = useState(false);

  const manejarPass = (text) => {
    setContrasena(text);
    setErrorPass(contraseniaDebil(text));
  };

  const comprobarCampos = () => {
    if (!telefono || !correo || !contrasena || !confirmarContrasena) {
      Alert.alert("Campos incompletos", "Por favor, completa todos los datos.");
      return false;
    }
    if (contrasena !== confirmarContrasena) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  async function manejoRegistro() {
    if (!comprobarCampos()) return;
    setLoading(true);
    try {
      await registro({
        email: correo, username: NOMUSUARIO, password: contrasena,
        password_confirmation: confirmarContrasena, nombre: NOMBRE,
        apellido: APELLIDOS, telefono, fecha_nacimiento: FECHA,
        es_empresa: esEmpresa, es_familiar: esFamiliar,
        porcentaje_discapacidad: porcentajeDiscapacidad,
      });
      const user = await loadUser();
      setUser(user);
    } catch (e) {
      Alert.alert("Error", "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#5099F8" />
          </BackButton>
          <View>
            <Titulo>Finalizar Registro</Titulo>
            <PasoText>Paso 2 de 2</PasoText>
          </View>
        </Header>

        <Container>
          <LabelAzul>Contacto</LabelAzul>
          <Tarjeta>
            <InputWrapper>
              <Ionicons name="call-outline" size={20} color="#5099F8" />
              <InputStyled
                placeholder="Teléfono"
                placeholderTextColor="#A5C8F9"
                keyboardType="phone-pad"
                value={telefono}
                onChangeText={pedirTelefono(setTelefono)}
                maxLength={9}
              />
            </InputWrapper>
            <Separador />
            <InputWrapper>
              <Ionicons name="mail-outline" size={20} color="#5099F8" />
              <InputStyled
                placeholder="Correo electrónico"
                placeholderTextColor="#A5C8F9"
                keyboardType="email-address"
                autoCapitalize="none"
                value={correo}
                onChangeText={setCorreo}
              />
            </InputWrapper>
          </Tarjeta>

          <LabelAzul>Seguridad</LabelAzul>
          <Tarjeta>
            <InputWrapper>
              <Ionicons name="lock-closed-outline" size={20} color={errorPass ? "#ef4444" : "#5099F8"} />
              <InputStyled
                placeholder="Contraseña"
                placeholderTextColor="#A5C8F9"
                secureTextEntry
                value={contrasena}
                onChangeText={manejarPass}
              />
            </InputWrapper>
            <Separador />
            <InputWrapper>
              <Ionicons name="shield-checkmark-outline" size={20} color="#5099F8" />
              <InputStyled
                placeholder="Confirmar contraseña"
                placeholderTextColor="#A5C8F9"
                secureTextEntry
                value={confirmarContrasena}
                onChangeText={setConfirmarContrasena}
              />
            </InputWrapper>
          </Tarjeta>

          <LabelAzul>Tipo de Perfil</LabelAzul>
          <Tarjeta>
            <SwitchRow>
                <Row>
                    <IconCircle color="#EBF4FF"><Ionicons name="accessibility-outline" size={16} color="#5099F8" /></IconCircle>
                    <SwitchLabel>Tengo discapacidad</SwitchLabel>
                </Row>
                <Switch value={tieneDiscapacidad} onValueChange={setTieneDiscapacidad} trackColor={{ true: "#5099F8" }} />
            </SwitchRow>
            {tieneDiscapacidad && (
                <PercentageInput 
                    placeholder="Porcentaje (0-100)" 
                    placeholderTextColor="#A5C8F9"
                    keyboardType="numeric"
                    onChangeText={(t) => setPorcentajeDiscapacidad(t)}
                />
            )}
            <Separador />
            <SwitchRow>
                <Row>
                    <IconCircle color="#EBF4FF"><Ionicons name="business-outline" size={16} color="#5099F8" /></IconCircle>
                    <SwitchLabel>Es Empresa</SwitchLabel>
                </Row>
                <Switch value={esEmpresa} onValueChange={setEsEmpresa} trackColor={{ true: "#5099F8" }} />
            </SwitchRow>
          </Tarjeta>

          <BotonRegistrar onPress={manejoRegistro} disabled={loading}>
            <TextoBoton>{loading ? "Procesando..." : "Crear mi cuenta"}</TextoBoton>
          </BotonRegistrar>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const Header = styled.View` flex-direction: row; align-items: center; padding: 60px 20px 20px; background-color: #fff; `;
const BackButton = styled.TouchableOpacity` background-color: #EBF4FF; padding: 10px; border-radius: 12px; margin-right: 15px; `;
const Titulo = styled.Text` font-size: 24px; font-weight: 800; color: #1e3a8a; `;
const PasoText = styled.Text` color: #5099F8; font-size: 14px; font-weight: 600; `;
const Container = styled.View` padding: 20px; `;
const LabelAzul = styled.Text` color: #5099F8; font-weight: 800; font-size: 12px; text-transform: uppercase; margin-top: 20px; margin-bottom: 10px; `;
const Tarjeta = styled.View` background-color: #fff; border-radius: 20px; padding: 5px 15px; border: 1px solid #D0E3FF; `;
const InputWrapper = styled.View` flex-direction: row; align-items: center; padding: 12px 0; `;
const InputStyled = styled.TextInput` flex: 1; margin-left: 12px; font-size: 16px; color: #1e3a8a; font-weight: 500; `;
const Separador = styled.View` height: 1px; background-color: #EBF4FF; `;
const SwitchRow = styled.View` flex-direction: row; justify-content: space-between; align-items: center; padding: 10px 0; `;
const Row = styled.View` flex-direction: row; align-items: center; `;
const SwitchLabel = styled.Text` font-size: 15px; color: #1e3a8a; font-weight: 600; margin-left: 10px; `;
const IconCircle = styled.View` width: 30px; height: 30px; border-radius: 15px; background-color: ${props => props.color}; justify-content: center; align-items: center; `;
const BotonRegistrar = styled.TouchableOpacity` background-color: #1e3a8a; padding: 18px; border-radius: 18px; align-items: center; margin-top: 30px; margin-bottom: 50px; `;
const TextoBoton = styled.Text` color: #fff; font-size: 18px; font-weight: 800; `;
const ErrorText = styled.Text` color: #ef4444; font-size: 12px; margin-bottom: 10px; margin-left: 32px; `;
const PercentageInput = styled.TextInput` background-color: #f8fafc; padding: 10px; border-radius: 10px; margin-bottom: 10px; border: 1px solid #D0E3FF; color: #1e3a8a; `;