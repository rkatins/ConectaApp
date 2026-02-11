import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { esNOmbreOApellidoValido, nombreUsuario } from "./control";

export default function CreateUser1({ navigation }) {
  // --- ESTADOS ---
  const [hoy] = useState(new Date());
  // FECHA_MINIMO: Persona de 18 años (Máxima fecha permitida en el calendario)
  const [FECHA_MINIMO] = useState(new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate()));
  // FECHA_MAXIMO: Persona de 113 años (Mínima fecha permitida en el calendario)
  const [FECHA_MAXIMO] = useState(new Date(hoy.getFullYear() - 113, hoy.getMonth(), hoy.getDate()));
  
  // Inicializamos la fecha en el mínimo permitido (18 años) para evitar conflictos de rango
  const [fecha, setFecha] = useState(FECHA_MINIMO);
  const [mostrar, setMostrar] = useState(false);

  const [nomUsuario, setNombreUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");

  // --- REFS ---
  const refNombre = useRef();
  const refApellido = useRef();

  // --- VALIDACIONES ---
  const nombreValido = esNOmbreOApellidoValido(nombre).length === nombre.length;
  const apellidoValido = esNOmbreOApellidoValido(apellidos).length === apellidos.length;

  const onChange = (event, fechaEscogida) => {
    // En Android, si el usuario cancela, fechaEscogida es undefined
    setMostrar(false);
    if (fechaEscogida) {
      setFecha(fechaEscogida);
    }
  };

  const comprobarCampos = () => {
    if (!nomUsuario.trim() || !nombre.trim() || !apellidos.trim()) {
      Alert.alert("Campos incompletos", "Por favor, rellena todos los campos.");
      return false;
    }
    if (nomUsuario.length < 4) {
      Alert.alert("Nombre de usuario corto", "Mínimo 4 caracteres.");
      return false;
    }
    if (!nombreValido || !apellidoValido) {
      Alert.alert("Nombre/Apellidos inválidos", "Contienen caracteres no permitidos.");
      return false;
    }
    // Validación de mayoría de edad manual por si acaso
    if (fecha > FECHA_MINIMO) {
      Alert.alert("Edad no permitida", "Debes ser mayor de 18 años.");
      return false;
    }
    return true;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView contentContainerStyle={{ paddingTop: 60, paddingHorizontal: 20 }}>
        <StatusBar
          style="auto"
          backgroundColor={Platform.OS === "android" ? "#01bde3" : undefined}
        />

        {/* Nombre de usuario */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 5 }}>Nombre de Usuario</Text>
          <TextInput
            placeholder="Escribe aquí tu nombre de usuario"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => refNombre.current.focus()} // Salta a Nombre
            value={nomUsuario}
            onChangeText={(text) => setNombreUsuario(nombreUsuario(text))}
            style={styles.input}
          />
        </View>

        {/* Nombre */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 5 }}>Nombre</Text>
          <TextInput
            ref={refNombre}
            placeholder="Escribe aquí tu nombre"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => refApellido.current.focus()} // Salta a Apellidos
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
        </View>

        {/* Apellidos */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 5 }}>Apellidos</Text>
          <TextInput
            ref={refApellido}
            placeholder="Escribe aquí tus apellidos"
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={() => setMostrar(true)} // Abre el calendario al terminar
            value={apellidos}
            onChangeText={setApellidos}
            style={styles.input}
          />
        </View>

        {/* Fecha de nacimiento */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18 }}>Fecha de nacimiento</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Pressable 
                onPress={() => setMostrar(true)} 
                style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 10 }}
            >
              <Text style={{ fontSize: 30 }}>🗓️</Text>
            </Pressable>
            <Text style={{ marginLeft: 15, fontSize: 16, color: '#333' }}>
              {fecha.toLocaleDateString('es-ES')}
            </Text>
          </View>

          {mostrar && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={FECHA_MINIMO} // No permite elegir menos de 18 años
              minimumDate={FECHA_MAXIMO} // No permite elegir más de 113 años
              onChange={onChange}
            />
          )}
        </View>

        {/* Botón continuar */}
        <TouchableOpacity
          onPress={() => {
            if (comprobarCampos()) {
              navigation.navigate('CrearCuenta2', {
                NOMUSUARIO: nomUsuario,
                NOMBRE: nombre,
                APELLIDOS: apellidos,
                FECHA: fecha.toISOString(), // Es mejor pasar la fecha como string en la navegación
              });
            }
          }}
          style={styles.boton}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Continuar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  boton: {
    backgroundColor: "#5099F8",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40
  }
};