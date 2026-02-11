import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { useContext, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styled from 'styled-components/native';
import AuthCotext from "../contexts/authContext";
import { loadUser, login } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const { setUser } = useContext(AuthCotext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const IniciandoSesion = useRef(false);

  async function manejoLogin() {
    if (IniciandoSesion.current) return;
    IniciandoSesion.current = true;
    setGeneralError("");

    try {
      await login({ email, password });
      const usuario = await loadUser();
      setUser(usuario);
    } catch (e) {
      IniciandoSesion.current = false;
      if (e.response?.status === 422 || e.response?.status === 401) {
        setGeneralError(e.response.data.mensaje);
      } else {
        setGeneralError("Error inesperado");
      }
    }
  }

  return (
    <Contenedor style={{ paddingTop: Platform.OS === "ios" ? 0 : 50 }}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://avatars.githubusercontent.com/u/247774434?s=200&v=4' }}
              style={styles.headerImg}
              resizeMode="contain"
            />
            <Text style={styles.title}>
              <Text style={{ color: '#5099F8' }}>Alcorcón Conecta</Text>
            </Text>
            <Text style={styles.subtitle}>
              Accede a planes y eventos de tu alrededor
            </Text>
          </View>

          <View style={styles.form}>
            {/* Email */}
            <View style={styles.input}>
              {generalError !== "" && (
                <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>
                  {generalError}
                </Text>
              )}
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(text) => setEmail(text)}
                placeholder="john@example.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={email}
              />
            </View>

            {/* Password con Ojo */}
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  autoCorrect={false}
                  onChangeText={(text) => setPassword(text)}
                  placeholder="********"
                  placeholderTextColor="#6b7280"
                  // Añadimos padding derecho para que el texto no se tape con el ojo
                  style={[styles.inputControl, { flex: 1, paddingRight: 50 }]}
                  secureTextEntry={!verPassword}
                  value={password}
                />
                <TouchableOpacity
                  onPress={() => setVerPassword(!verPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons
                    name={verPassword ? "eye" : "eye-off"}
                    size={24}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={manejoLogin}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Iniciar Sesión</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("OlvidePass")}>
              <Text style={styles.formLink}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("CrearCuenta")}>
            <Text style={styles.formFooter}>
              ¿No tienes cuenta?{' '}
              <Text style={{ textDecorationLine: 'underline' }}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Contenedor>
  );
}

const Contenedor = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 25 
  },
  title: { 
    fontSize: 31, 
    fontWeight: '700', 
    color: '#1D2A32', 
    marginBottom: 6,
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 15, 
    fontWeight: '500', 
    color: '#929292',
    textAlign: 'center' 
  },
  header: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 36 
  },
  headerImg: { 
    width: 80, 
    height: 80, 
    alignSelf: 'center', 
    marginBottom: 20 
  },
  form: { 
    flex: 1 
  },
  formAction: { 
    marginTop: 20, 
    marginBottom: 16 
  },
  formLink: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#662E9B', 
    textAlign: 'center' 
  },
  formFooter: { 
    paddingVertical: 24, 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#222', 
    textAlign: 'center' 
  },
  input: { 
    marginBottom: 16 
  },
  inputLabel: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#222', 
    marginBottom: 8 
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // IMPORTANTE: relativo para que el ojo se posicione respecto a este cuadro
    position: 'relative' 
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#5099F8'
  },
  btnText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#fff' 
  },
});