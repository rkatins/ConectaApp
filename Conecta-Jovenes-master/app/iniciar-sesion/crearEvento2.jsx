import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styled from "styled-components/native";
import { registroEvento } from "../services/eventService";
export default function CrearEvento2({ route, navigation }) {
  const { id_categoria, id_entidad, id_creador, nombre, desc, ubi } =
    route.params;

  const [esAccesible, setEsAccesible] = useState(false);

  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaFin, setHoraFin] = useState(null);

  const [fechaInicioSeleccionada, setFechaInicioSeleccionada] = useState("dd/mm/aaaa");
  const [fechaFinSeleccionada, setFechaFinSeleccionada] = useState("dd/mm/aaaa");
  const [horaInicioSeleccionada, setHoraInicioSeleccionada] = useState("hh:mm");
  const [horaFinSeleccionada, setHoraFinSeleccionada] = useState("hh:mm");

  const [currentPicker, setCurrentPicker] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [errores, setErrores] = useState({});

  const cambioSwitch = () => setEsAccesible((previousState) => !previousState);
  const showPicker = (tipo) => {
    setCurrentPicker(tipo);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    const fecha = new Date(date);

    switch (currentPicker) {
      case "fechaInicio":
        setFechaInicio(fecha);
        setFechaInicioSeleccionada(formatFechaDDMMYYYY(fecha));
        break;
      case "fechaFin":
        setFechaFin(fecha);
        setFechaFinSeleccionada(formatFechaDDMMYYYY(fecha));
        break;
      case "horaInicio":
        setHoraInicio(fecha);
        setHoraInicioSeleccionada(
          fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
        break;
      case "horaFin":
        setHoraFin(fecha);
        setHoraFinSeleccionada(
          fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
        break;
    }

    hideDatePicker();
  };

  function formatFechaDDMMYYYY(fecha) {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  function combinarFechaYHora(fecha, hora) {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
    return nuevaFecha.toLocaleString("sv-SE").replace("T", " ");
  }

  function comprobarCampos() {
    let nuevosErrores = {};
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (!fechaInicio) {
      nuevosErrores.fechaInicio = "Seleccione la fecha de inicio";
    } else if (fechaInicio < hoy) {
      nuevosErrores.fechaInicio = "No puede ser anterior a hoy";
    }
    if (!horaInicio) {
      nuevosErrores.horaInicio = "Seleccione la hora de inicio";
    }
    if (!fechaFin) {
      nuevosErrores.fechaFin = "Seleccione la fecha de finalización";
    }
    if (!horaFin) {
      nuevosErrores.horaFin = "Seleccione la hora de finalización";
    }
    if (fechaInicio && fechaFin) {
      if (fechaFin < fechaInicio) {
        nuevosErrores.fechaFin = "No puede ser anterior a la fecha de inicio";
      }
      if (
        fechaFin.getTime() === fechaInicio.getTime() &&
        horaInicio &&
        horaFin
      ) {
        const inicioCompleto = new Date(fechaInicio);
        inicioCompleto.setHours(horaInicio.getHours(), horaInicio.getMinutes());

        const finCompleto = new Date(fechaFin);
        finCompleto.setHours(horaFin.getHours(), horaFin.getMinutes());

        if (finCompleto <= inicioCompleto) {
          nuevosErrores.horaFin = "La hora final debe ser mayor que la inicial";
        }
      }
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function RegistroEvento() {
    const fechaInicioFinal = combinarFechaYHora(fechaInicio, horaInicio);
    const fechaFinFinal = combinarFechaYHora(fechaFin, horaFin);
    try {
      await registroEvento({
        id_categoria: id_categoria,
        id_entidad: id_entidad,
        id_creador: id_creador,
        nombre: nombre,
        fecha_inicio_evento: fechaInicioFinal,
        fecha_final_evento: fechaFinFinal,
        descripcion: desc,
        valoracion: 0.0,
        ubicacion: ubi,
        num_participantes: 0,
        es_accesible: esAccesible,
      });
      Alert.alert("Evento creado", "El evento se ha creado correctamente", [
        {
          text: "Aceptar",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (e) {
      if (e.response?.status === 422) {
        const data = e.response.data;
        if (data.errors?.fecha_final_evento) {
          Alert.alert(
            "Error",
            "La fecha fin no debe ser menor o igual a la de inicio"
          );
          return;
        }
      } else {
        Alert.alert("Error", e.response.data.mensaje);
      }
      //setGeneralError(e.response.data.mensaje);
    }
  }

  return (
    <Contenedor style={{ paddingTop: Platform.OS === "ios" ? 0 : 50, flex: 1 }}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 30, marginBottom: 10, fontWeight: "bold" }}>
            Crear nuevo evento
          </Text>

          {/* Fecha Inicio */}
          <Text
            style={{
              fontSize: 20,
              marginVertical: 10,
              fontWeight: "500",
              borderColor: errores.horaInicio ? "red" : "#858585",
            }}
          >
            Fecha de Inicio
          </Text>
          <TouchableOpacity
            style={styles.inputStyle}
            onPress={() => showPicker("fechaInicio")}
          >
            <Text style={{ color: fechaInicio ? "#000000" : "#a1a1a1" }}>
              {fechaInicio
                ? formatFechaDDMMYYYY(fechaInicio)
                : "Seleccione fecha inicio"}
            </Text>
          </TouchableOpacity>
          {errores.fechaInicio && (
            <Text style={{ color: "red" }}>{errores.fechaInicio}</Text>
          )}

          {/* Hora Inicio */}
          <Text
            style={{
              fontSize: 20,
              marginVertical: 10,
              fontWeight: "500",
              borderColor: errores.fechaInicio ? "red" : "#858585",
            }}
          >
            Hora de inicio
          </Text>
          <TouchableOpacity
            style={styles.inputStyle}
            onPress={() => showPicker("horaInicio")}
          >
            <Text style={{ color: horaInicio ? "#000000" : "#a1a1a1" }}>
              {horaInicio ? horaInicioSeleccionada : "Seleccione hora inicio"}
            </Text>
          </TouchableOpacity>
          {errores.horaInicio && (
            <Text style={{ color: "red" }}>{errores.horaInicio}</Text>
          )}

          {/* Fecha finalizacion */}
          <Text
            style={{
              fontSize: 20,
              marginVertical: 10,
              fontWeight: "500",
              borderColor: errores.fechaFin ? "red" : "#858585",
            }}
          >
            Fecha de finalización
          </Text>

          <TouchableOpacity
            style={styles.inputStyle}
            onPress={() => showPicker("fechaFin")}
          >
            <Text style={{ color: fechaFin ? "#000000" : "#a1a1a1" }}>
              {fechaFin
                ? formatFechaDDMMYYYY(fechaFin)
                : "Seleccione fecha fin"}
            </Text>
          </TouchableOpacity>
          {errores.fechaFin && (
            <Text style={{ color: "red" }}>{errores.fechaFin}</Text>
          )}

          {/* Hora finalizacion */}
          <Text
            style={{
              fontSize: 20,
              marginVertical: 10,
              fontWeight: "500",
              borderColor: errores.horaFin ? "red" : "#858585",
            }}
          >
            Hora de finalización
          </Text>

          <TouchableOpacity
            style={styles.inputStyle}
            onPress={() => showPicker("horaFin")}
          >
            <Text style={{ color: horaFin ? "#000000" : "#a1a1a1" }}>
              {horaFin ? horaFinSeleccionada : "Seleccione hora fin"}
            </Text>
          </TouchableOpacity>
          {errores.horaFin && (
            <Text style={{ color: "red" }}>{errores.horaFin}</Text>
          )}

          {/* Switch */}

          <View style={styles.switchWrapper}>
            <View style={{ flex: 6 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "500", marginBottom: 5 }}
              >
                Evento accesible
              </Text>
              <Text style={{ textAlign: "justify", fontSize: 15 }}>
                Indica si el evento es apto para personas con movilidad reducida
              </Text>
            </View>
            <View
              style={{
                flex: 4,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 60,
                }}
              >
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={esAccesible ? "#007bff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={cambioSwitch}
                  value={esAccesible}
                  style={{
                    transform: [
                      { scaleX: Platform.OS === "ios" ? 1.2 : 1.5 },
                      { scaleY: Platform.OS === "ios" ? 1.2 : 1.5 },
                    ],
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* boton */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 50,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (comprobarCampos()) {
                RegistroEvento();
              }
            }}
            style={{
              backgroundColor: "#5099f8",
              paddingVertical: 15,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              Crear evento
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={currentPicker.includes("hora") ? "time" : "date"}
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        date={
          currentPicker === "fechaInicio"
            ? fechaInicio || new Date()
            : currentPicker === "fechaFin"
            ? fechaFin || new Date()
            : currentPicker === "horaInicio"
            ? horaInicio || new Date()
            : currentPicker === "horaFin"
            ? horaFin || new Date()
            : new Date()
        }
        minimumDate={
          currentPicker === "fechaInicio"
            ? new Date()
            : fechaInicio || new Date()
        }
      />
    </Contenedor>
  );
}

const Contenedor = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffffff;
`;

const styles = StyleSheet.create({
  container: {
    flex: 9,
    padding: 25,
  },
  switchWrapper: {
    marginTop:15,
    borderWidth: 1,
    borderColor: "#D1D5DC",
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 10,
    paddingLeft: 10,
    backgroundColor: "#f9fafb",
  },
  inputStyle: {
    height: 43,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#858585",
    borderRadius: 10,
    paddingLeft: 14,
    paddingRight: 20,
    justifyContent: "center",
    backgroundColor: "#fefefe",
  },
});
