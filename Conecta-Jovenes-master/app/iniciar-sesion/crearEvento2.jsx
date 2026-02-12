import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, ScrollView, Switch, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styled from "styled-components/native";
import { registroEvento } from "../services/eventService";

export default function CrearEvento2({ route, navigation }) {
  const { id_categoria, id_entidad, id_creador, nombre, desc, ubi } = route.params;

  const [esAccesible, setEsAccesible] = useState(false);
  const [numParticipantes, setNumParticipantes] = useState(""); // Nuevo estado
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaFin, setHoraFin] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState("");

  const showPicker = (tipo) => { setCurrentPicker(tipo); setDatePickerVisibility(true); };
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateConfirm = (date) => {
    if (currentPicker === "fechaInicio") setFechaInicio(date);
    if (currentPicker === "fechaFin") setFechaFin(date);
    if (currentPicker === "horaInicio") setHoraInicio(date);
    if (currentPicker === "horaFin") setHoraFin(date);
    hideDatePicker();
  };

  const combinarFechaYHora = (f, h) => {
    if (!f || !h) return null;
    const d = new Date(f);
    const t = new Date(h);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}:00`;
  };

  async function manejarRegistro() {
    const fInicio = combinarFechaYHora(fechaInicio, horaInicio);
    const fFin = combinarFechaYHora(fechaFin, horaFin);

    if (!fInicio || !fFin) {
      Alert.alert("Error", "Por favor selecciona todas las fechas y horas.");
      return;
    }

    // Validación simple para participantes
    if (!numParticipantes || isNaN(numParticipantes)) {
      Alert.alert("Error", "Por favor indica un número de participantes válido.");
      return;
    }

    try {
      const objetoEvento = {
        id_categoria: Number(id_categoria),
        id_entidad: Number(id_entidad),
        id_creador: Number(id_creador),
        nombre,
        fecha_inicio_evento: fInicio,
        fecha_final_evento: fFin,
        descripcion: desc,
        valoracion: 0.00,
        ubicacion: ubi,
        num_participantes: Number(numParticipantes), // Enviamos el número convertido
        foto_evento: "evento1.jpg", 
        es_accesible: esAccesible
      };

      console.log("Enviando a API...", objetoEvento);
      const respuesta = await registroEvento(objetoEvento);
      
      console.log("Respuesta del servidor:", respuesta);

      Alert.alert("¡Éxito!", `Evento creado con ID: ${respuesta.id || respuesta.data?.id || 'OK'}`, [
        { text: "Ir al Inicio", onPress: () => navigation.navigate("Home") }
      ]);

    } catch (e) {
      console.error("Error API:", e.response?.data);
      Alert.alert("Error", e.response?.data?.message || "La ubicación o los datos son inválidos.");
    }
  }

  return (
    <Contenedor>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Titulo>Finalizar Evento</Titulo>
        
        <Seccion>
          <LabelAzul>Fecha y Hora de Inicio</LabelAzul>
          <Fila>
            <BtnHalf onPress={() => showPicker("fechaInicio")}>
              <Text>{fechaInicio ? fechaInicio.toLocaleDateString() : "Fecha"}</Text>
            </BtnHalf>
            <BtnHalf onPress={() => showPicker("horaInicio")}>
              <Text>{horaInicio ? horaInicio.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Hora"}</Text>
            </BtnHalf>
          </Fila>
        </Seccion>

        <Seccion>
          <LabelAzul>Fecha y Hora de Fin</LabelAzul>
          <Fila>
            <BtnHalf onPress={() => showPicker("fechaFin")}>
              <Text>{fechaFin ? fechaFin.toLocaleDateString() : "Fecha"}</Text>
            </BtnHalf>
            <BtnHalf onPress={() => showPicker("horaFin")}>
              <Text>{horaFin ? horaFin.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Hora"}</Text>
            </BtnHalf>
          </Fila>
        </Seccion>

        {/* Nuevo campo de Número de Participantes */}
        <Seccion>
          <LabelAzul>Número de Participantes</LabelAzul>
          <InputRounded 
            placeholder="Ej: 50"
            keyboardType="numeric"
            value={numParticipantes}
            onChangeText={setNumParticipantes}
          />
        </Seccion>

        <CardAccesibilidad>
          <View>
            <Text style={{ fontWeight: '800', color: '#1e3a8a', fontSize: 16 }}>Accesibilidad</Text>
            <Text style={{ color: '#64748b', fontSize: 12 }}>Apto para movilidad reducida</Text>
          </View>
          <Switch 
            value={esAccesible} 
            onValueChange={setEsAccesible}
            trackColor={{ true: "#93c5fd" }}
            thumbColor={esAccesible ? "#2563eb" : "#f4f3f4"}
          />
        </CardAccesibilidad>

        <BotonAzul onPress={manejarRegistro}>
          <TextoBoton>Publicar Evento</TextoBoton>
        </BotonAzul>
      </ScrollView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={currentPicker.includes("hora") ? "time" : "date"}
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
    </Contenedor>
  );
}

// Estilos
const Contenedor = styled.SafeAreaView` flex: 1; padding: 25px; background: #fff; `;
const Titulo = styled.Text` font-size: 30px; font-weight: 800; color: #1e3a8a; margin-bottom: 30px; `;
const Seccion = styled.View` margin-bottom: 25px; `;
const LabelAzul = styled.Text` color: #3b82f6; font-weight: 700; margin-bottom: 10px; `;
const Fila = styled.View` flex-direction: row; justify-content: space-between; `;
const BtnHalf = styled.TouchableOpacity` width: 48%; background: #eff6ff; padding: 18px; border-radius: 20px; border: 1.5px solid #dbeafe; align-items: center; `;
const InputRounded = styled.TextInput` background: #eff6ff; padding: 18px; border-radius: 20px; border: 1.5px solid #dbeafe; color: #1e40af; `;
const CardAccesibilidad = styled.View` flex-direction: row; justify-content: space-between; align-items: center; padding: 20px; background: #f8fafc; border-radius: 25px; border: 1px solid #f1f5f9; margin-top: 10px; `;
const BotonAzul = styled.TouchableOpacity` background: #2563eb; padding: 20px; border-radius: 25px; align-items: center; margin-top: 40px; margin-bottom: 20px; `;
const TextoBoton = styled.Text` color: white; font-weight: 800; font-size: 18px; `;