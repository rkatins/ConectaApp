import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { useContext, useRef, useState } from 'react';
import {
  ActivityIndicator // Añadido para feedback visual
  ,
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
import AuthContext from "../contexts/authContext"; // Corregido: era AuthContext
import { loadUser, login } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false); // Estado para el botón
  const IniciandoSesion = useRef(false);

  async function manejoLogin() {
    if (IniciandoSesion.current) return;
    IniciandoSesion.current = true;
    setCargando(true);
    setGeneralError("");

    try {
      await login({ email, password });
      const usuario = await loadUser();
      setUser(usuario);
    } catch (e) {
      IniciandoSesion.current = false;
      setCargando(false);
      // Manejo de errores más robusto
      if (e.response?.status === 422 || e.response?.status === 401) {
        setGeneralError(e.response.data.mensaje || "Credenciales incorrectas");
      } else {
        setGeneralError("Error de conexión. Inténtalo de nuevo.");
      }
    }
  }

  return (
    <Contenedor>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://avatars.githubusercontent.com/u/247774434?s=200&v=4' }}
              style={styles.headerImg}
              resizeMode="contain"
            />
            <Text style={styles.title}>
              Alcorcón <Text style={{ color: '#2563eb' }}>Conecta</Text>
            </Text>
            <Text style={styles.subtitle}>
              Accede a planes y eventos de tu alrededor
            </Text>
          </View>

          <View style={styles.form}>
            {generalError !== "" && (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={20} color="#dc2626" />
                <Text style={styles.errorText}>{generalError}</Text>
              </View>
            )}

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(text) => setEmail(text)}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#94a3b8"
                style={styles.inputControl}
                value={email}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  autoCorrect={false}
                  onChangeText={(text) => setPassword(text)}
                  placeholder="********"
                  placeholderTextColor="#94a3b8"
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
                    size={22}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={manejoLogin} disabled={cargando}>
                <View style={[styles.btn, cargando && { backgroundColor: '#93c5fd' }]}>
                  {cargando ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Iniciar Sesión</Text>
                  )}
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
              <Text style={{ color: '#2563eb', fontWeight: '800' }}>Regístrate</Text>
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
  container: { padding: 25, flexGrow: 1 },
  header: { alignItems: 'center', marginVertical: 30 },
  headerImg: { width: 90, height: 90, marginBottom: 15 },
  title: { fontSize: 30, fontWeight: '900', color: '#1e3a8a', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', marginTop: 5 },
  form: { flex: 1, marginTop: 10 },
  input: { marginBottom: 20 },
  inputLabel: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  inputControl: {
    height: 55,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#1e293b'
  },
  passwordContainer: { flexDirection: 'row', alignItems: 'center' },
  eyeIcon: { position: 'absolute', right: 15 },
  formAction: { marginVertical: 20 },
  btn: {
    height: 55,
    borderRadius: 15,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  btnText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  formLink: { fontSize: 15, fontWeight: '600', color: '#2563eb', textAlign: 'center' },
  formFooter: { paddingVertical: 20, fontSize: 15, color: '#64748b', textAlign: 'center' },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fee2e2'
  },
  errorText: { color: '#dc2626', marginLeft: 8, fontWeight: '600' }
});