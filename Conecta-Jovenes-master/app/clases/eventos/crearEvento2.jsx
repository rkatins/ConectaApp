import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, ScrollView, Switch, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styled from "styled-components/native";
import { registroEvento } from "../../services/eventService";

export default function CrearEvento2({ route, navigation }) {
  // Verificamos que los parámetros lleguen correctamente
  const { id_categoria, id_entidad, id_creador, nombre, desc, ubi } = route.params || {};

  const [esAccesible, setEsAccesible] = useState(false);
  const [numParticipantes, setNumParticipantes] = useState("");
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
        num_participantes: Number(numParticipantes),
        foto_evento: "evento1.jpg", 
        es_accesible: esAccesible
      };

      await registroEvento(objetoEvento);
      
      Alert.alert("¡Éxito!", "Evento publicado correctamente", [
        { text: "Ir al Inicio", onPress: () => navigation.navigate("Home") }
      ]);

    } catch (e) {
      Alert.alert("Error", "No se pudo publicar el evento.");
    }
  }

  return (
    <Contenedor>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        
        {/* BOTÓN VOLVER ATRÁS */}
        <View style={{ paddingHorizontal: 25, marginBottom: 10, marginTop: 20 }}>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#1e3a8a" />
          </BackButton>
        </View>

        <Cabecera>
          <Titulo>Finalizar Evento</Titulo>
          <Subtitulo>Paso 2 de 2: Fecha y detalles</Subtitulo>
        </Cabecera>
        
        <Seccion>
          <LabelAzul>Fecha y Hora de Inicio</LabelAzul>
          <Fila>
            <BtnHalf onPress={() => showPicker("fechaInicio")} activeOpacity={0.7}>
              <TextoBtn>{fechaInicio ? fechaInicio.toLocaleDateString() : "Fecha"}</TextoBtn>
            </BtnHalf>
            <BtnHalf onPress={() => showPicker("horaInicio")} activeOpacity={0.7}>
              <TextoBtn>{horaInicio ? horaInicio.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Hora"}</TextoBtn>
            </BtnHalf>
          </Fila>
        </Seccion>

        <Seccion>
          <LabelAzul>Fecha y Hora de Fin</LabelAzul>
          <Fila>
            <BtnHalf onPress={() => showPicker("fechaFin")} activeOpacity={0.7}>
              <TextoBtn>{fechaFin ? fechaFin.toLocaleDateString() : "Fecha"}</TextoBtn>
            </BtnHalf>
            <BtnHalf onPress={() => showPicker("horaFin")} activeOpacity={0.7}>
              <TextoBtn>{horaFin ? horaFin.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Hora"}</TextoBtn>
            </BtnHalf>
          </Fila>
        </Seccion>

        <Seccion>
          <LabelAzul>Capacidad del Evento</LabelAzul>
          <InputRounded 
            placeholder="Número de participantes (ej: 50)"
            keyboardType="numeric"
            value={numParticipantes}
            onChangeText={setNumParticipantes}
            placeholderTextColor="#94a3b8"
          />
        </Seccion>

        <Seccion>
          <CardAccesibilidad>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', color: '#1e3a8a', fontSize: 16 }}>Accesibilidad</Text>
              <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>Apto para movilidad reducida</Text>
            </View>
            <Switch 
              value={esAccesible} 
              onValueChange={setEsAccesible}
              trackColor={{ true: "#93c5fd", false: "#e2e8f0" }}
              thumbColor={esAccesible ? "#2563eb" : "#f4f3f4"}
            />
          </CardAccesibilidad>
        </Seccion>

        <View style={{ paddingHorizontal: 25, marginBottom: 40 }}>
          <BotonAzul onPress={manejarRegistro} activeOpacity={0.8}>
            <TextoBoton>Publicar Evento</TextoBoton>
          </BotonAzul>
        </View>

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

// --- ESTILOS ---

const Contenedor = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const BackButton = styled.TouchableOpacity`
  background-color: #f1f5f9;
  width: 45px;
  height: 45px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;

const Cabecera = styled.View`
  padding-horizontal: 25px;
  margin-bottom: 35px;
`;

const Titulo = styled.Text`
  font-size: 32px;
  font-weight: 900;
  color: #1e3a8a;
`;

const Subtitulo = styled.Text`
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
  margin-top: 5px;
`;

const Seccion = styled.View`
  margin-bottom: 30px;
  padding-horizontal: 25px;
`;

const LabelAzul = styled.Text`
  color: #3b82f6;
  font-weight: 800;
  margin-bottom: 15px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Fila = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const BtnHalf = styled.TouchableOpacity`
  width: 48%;
  background: #f1f5f9;
  padding: 20px 10px;
  border-radius: 18px;
  border-width: 1px;
  border-color: #e2e8f0;
  align-items: center;
  justify-content: center;
`;

const TextoBtn = styled.Text`
  color: #1e40af;
  font-size: 14px;
  font-weight: 600;
`;

const InputRounded = styled.TextInput`
  background: #f1f5f9;
  padding: 20px;
  border-radius: 18px;
  border-width: 1px;
  border-color: #e2e8f0;
  color: #1e40af;
  font-size: 16px;
`;

const CardAccesibilidad = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 22px;
  background: #f8fafc;
  border-radius: 20px;
  border-width: 1px;
  border-color: #e2e8f0;
`;

const BotonAzul = styled.TouchableOpacity`
  background: #2563eb;
  padding: 22px;
  border-radius: 20px;
  align-items: center;
  margin-top: 10px;
  elevation: 4;
  shadow-color: #2563eb;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
`;

const TextoBoton = styled.Text`
  color: white;
  font-weight: 800;
  font-size: 18px;
`;