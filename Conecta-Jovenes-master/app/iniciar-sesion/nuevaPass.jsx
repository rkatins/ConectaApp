import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';

export default function CrearContrasenaScreen({navigation}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Contenedor style={{paddingTop:Platform.OS==="ios"?0:50,flex: 1 }}>
      <Text style={styles.title}>Crear contraseña</Text>

      <Text style={styles.subtitle}>
        Le pediremos esta contraseña siempre que inicie sesión.
      </Text>

      <Text style={styles.label}>Nueva contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirmar nueva contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={!showPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Checkbox mostrar contraseña */}
      <Pressable
        style={styles.checkboxContainer}
        onPress={() => setShowPassword(!showPassword)}
      >
        <View style={[styles.checkbox, showPassword && styles.checkboxChecked]}>
          {showPassword && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.checkboxLabel}>Mostrar contraseña</Text>
      </Pressable>

      <TouchableOpacity style={styles.button} onPress={()=>
        {navigation.navigate("Login");}
      }>
        <Text style={styles.buttonText}>
          Guardar cambios e iniciar sesión
        </Text>
      </TouchableOpacity>
    </Contenedor>
  );
}


const Contenedor = styled.SafeAreaView`
  padding: 24px;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#999',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#F5A623',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#F5A623',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#F5A623',
    paddingVertical: 14,
    borderRadius: 22,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
