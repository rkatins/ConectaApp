
import { useContext, useState } from 'react';
import { Alert, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AuthCotext from "../contexts/authContext";
import { loadUser, registro } from '../services/authService';
import { contraseniaDebil, pedirTelefono } from './control';

export default function RegistroScreen({route,navigation}) {
  const {setUser} = useContext(AuthCotext);
  const [generalError, setGeneralError] = useState("");
  const { NOMUSUARIO } = route.params;
  const { NOMBRE } = route.params;
  const { APELLIDOS } = route.params;
  const { FECHA } = route.params;
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [tieneDiscapacidad, setTieneDiscapacidad] = useState(false);
  const [esEmpresa, setEsEmpresa] = useState(false);
  const [esFamiliar, setEsFamiliar] = useState(false);
  const [porcentajeDiscapacidad, setPorcentajeDiscapacidad] = useState(0);
  const [error, setError] = useState("");

    const contraseniaCorta = (text) => {
        setContrasena(text);
        setError(contraseniaDebil(text));
    };


  async function manejoRegistro() {
    try{
      await registro(
        {
          email:correo,
          username:NOMUSUARIO,
          password:contrasena,
          password_confirmation:confirmarContrasena,
          nombre:NOMBRE,
          apellido:APELLIDOS,
          telefono,
          fecha_nacimiento:FECHA,
          es_empresa:esEmpresa,
          es_familiar:esFamiliar,
          porcentaje_discapacidad:porcentajeDiscapacidad,
        },  
      );
  
      // Si el login es correcto, se carga el usuario
      const user = await loadUser();
      setUser(user);
    } catch(e){
      if (e.response?.status === 422) {
        const data = e.response.data;
        if (data.errores?.username) {
          Alert.alert(
            "Error",
            "Ese nombre de usuario ya existe"
          );
          return;
        }else if (data.errores?.email) {
          Alert.alert(
            "Error",
            "Ya hay una cuenta asociada a este correo"
          );
          return;
        }
      } else {
        Alert.alert(
          "Error",
          "Error de conexión con el servidor"
        );
      }
        //setGeneralError(e.response.data.mensaje);
      }
    }   

  const comprobarCampos = () => {
    if (!telefono.trim() || !correo.trim() || !contrasena.trim() || !confirmarContrasena.trim()) {
      Alert.alert("Campos incompletos", "Por favor, rellena todos los campos.");
      return false;
    }

    if (contrasena !== confirmarContrasena) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return false;
    }

    if (tieneDiscapacidad && porcentajeDiscapacidad <= 0) {
      Alert.alert("Error", "Indica el porcentaje de discapacidad.");
      return false;
    }
    return true;
  };
  const toggleDiscapacidad = (value) => {
    setTieneDiscapacidad(value);

    if (!value) {
      // Si se desactiva, reseteamos el porcentaje
      setPorcentajeDiscapacidad(0);
    }
  };

  return (
    <View style={{ paddingTop: 60, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>2/2</Text>

      <TextInput
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={pedirTelefono(setTelefono)}
        maxLength={9}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 15
        }}
      />

      <TextInput
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 15
        }}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={contraseniaCorta}
        style={{
            borderWidth: 1,
            borderColor: error ? "red" : "#ccc",
            padding: 12,
            borderRadius: 8,
            marginBottom: 5
        }}
    />

    {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>
            {error}
        </Text>
    ) : null}
    

      <TextInput
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmarContrasena}
        onChangeText={setConfirmarContrasena}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 15
        }}
      />

      {/* Switch accesible */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Switch
          value={tieneDiscapacidad}
          onValueChange={toggleDiscapacidad}
          thumbColor={tieneDiscapacidad ? "#D8E8FE" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#5099F8" }}
        />
        <Text style={{ marginLeft: 10 }}>Tengo alguna discapacidad</Text>
      </View>
      {tieneDiscapacidad && (
        <TextInput
          placeholder="Porcentaje de discapacidad"
          keyboardType="numeric"
          value={String(porcentajeDiscapacidad)}
          onChangeText={(text) =>
            setPorcentajeDiscapacidad(
              Math.min(100, Math.max(0, Number(text) || 0))
            )
          }
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 12,
            borderRadius: 8,
            marginBottom: 15
          }}
        />
      )}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Switch
          value={esEmpresa}
          onValueChange={setEsEmpresa}
          thumbColor={esEmpresa ? "#D8E8FE" : "#f4f3f4"}
          trackColor={{ false: "#000000", true: "#5099F8" }}
        />
        <Text style={{ marginLeft: 10 }}>¿Es Empresa?</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Switch
          value={esFamiliar}
          onValueChange={setEsFamiliar}
          thumbColor={esFamiliar ? "#D8E8FE" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#5099F8" }}
        />
        <Text style={{ marginLeft: 10 }}>¿Es Familiar?</Text>
      </View>

      <TouchableOpacity
        onPress={() => {
            if (comprobarCampos()) {
              manejoRegistro();
            }
        }}
        style={{
          backgroundColor: "#5099F8",
          paddingVertical: 15,
          borderRadius: 10,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          Registrarse
        </Text>
      </TouchableOpacity>
    </View>
  );
}
