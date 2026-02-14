import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getToken } from '../../services/tokenService';

export default function ModEvento({ route, navigation }) {
  const { evento } = route.params || {};
  
  // Estados del formulario
  const [nombre, setNombre] = useState(evento?.nombre || '');
  const [ubicacion, setUbicacion] = useState(evento?.ubicacion || '');
  const [descripcion, setDescripcion] = useState(evento?.descripcion || '');
  const [participantes, setParticipantes] = useState(String(evento?.num_participantes || '0'));
  const [esAccesible, setEsAccesible] = useState(!!evento?.es_accesible);

  // Estados para Fechas y Horas (Iniciamos con los valores del evento)
  const [fechaInicio, setFechaInicio] = useState(evento?.fecha_inicio_evento ? new Date(evento.fecha_inicio_evento) : new Date());
  const [fechaFin, setFechaFin] = useState(evento?.fecha_final_evento ? new Date(evento.fecha_final_evento) : new Date());
  const [horaInicio, setHoraInicio] = useState(evento?.fecha_inicio_evento ? new Date(evento.fecha_inicio_evento) : new Date());
  const [horaFin, setHoraFin] = useState(evento?.fecha_final_evento ? new Date(evento.fecha_final_evento) : new Date());

  // Estados del Picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState("");
  const [loading, setLoading] = useState(false);

  // --- LÓGICA DE PICKERS ---
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
    const d = new Date(f);
    const t = new Date(h);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}:00`;
  };

  // --- FUNCIÓN PARA ACTUALIZAR (PUT) ---
  const handleUpdate = async () => {
    if (!nombre || !ubicacion) {
      Alert.alert("Error", "El nombre y la ubicación son obligatorios.");
      return;
    }

    const fInicioStr = combinarFechaYHora(fechaInicio, horaInicio);
    const fFinStr = combinarFechaYHora(fechaFin, horaFin);

    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch(`https://hackathon.lausnchez.es/api/v1/evento/${evento.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_categoria: evento.id_categoria,
          id_entidad: evento.id_entidad,
          id_creador: evento.id_creador,
          nombre: nombre,
          fecha_inicio_evento: fInicioStr, // Enviamos las fechas modificadas
          fecha_final_evento: fFinStr,
          descripcion: descripcion,
          valoracion: evento.valoracion || 0.00,
          ubicacion: ubicacion,
          num_participantes: parseInt(participantes),
          foto_evento: evento.foto_evento,
          es_accesible: esAccesible
        })
      });

      if (response.ok) {
        Alert.alert("Éxito", "Evento actualizado correctamente", [
          { text: "OK", onPress: () => navigation.navigate('Home') } 
        ]);
      } else {
        throw new Error("Error al actualizar");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el evento.");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCIÓN PARA BORRAR (DELETE) ---
  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`https://hackathon.lausnchez.es/api/v1/evento/${evento.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      if (response.status === 204 || response.ok) {
        Alert.alert("Eliminado", "Evento borrado con éxito.", [{ text: "OK", onPress: () => navigation.navigate('Home') }]);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar.");
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MODIFICAR EVENTO</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        {loading && <ActivityIndicator size="large" color="#5099F8" style={{ marginBottom: 20 }} />}
        
        <Text style={styles.label}>NOMBRE DEL EVENTO</Text>
        <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

        <Text style={styles.label}>FECHA Y HORA INICIO</Text>
        <View style={styles.row}>
            <TouchableOpacity style={styles.halfInput} onPress={() => showPicker("fechaInicio")}>
                <Text>{fechaInicio.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.halfInput} onPress={() => showPicker("horaInicio")}>
                <Text>{horaInicio.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.label}>FECHA Y HORA FIN</Text>
        <View style={styles.row}>
            <TouchableOpacity style={styles.halfInput} onPress={() => showPicker("fechaFin")}>
                <Text>{fechaFin.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.halfInput} onPress={() => showPicker("horaFin")}>
                <Text>{horaFin.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.label}>UBICACIÓN</Text>
        <TextInput style={styles.input} value={ubicacion} onChangeText={setUbicacion} />

        <Text style={styles.label}>DESCRIPCIÓN</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={descripcion} onChangeText={setDescripcion} multiline />

        <Text style={styles.label}>Nº PARTICIPANTES</Text>
        <TextInput style={styles.input} value={participantes} onChangeText={setParticipantes} keyboardType="numeric" />

        <View style={styles.switchRow}>
          <Text style={styles.label}>ES ACCESIBLE</Text>
          <Switch value={esAccesible} onValueChange={setEsAccesible} trackColor={{ false: "#767577", true: "#B3E458" }} />
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={handleUpdate} disabled={loading}>
          <Text style={styles.mainButtonText}>{loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => Alert.alert("Eliminar", "¿Seguro?", [{text:"No"}, {text:"Sí", onPress:handleDelete}])}>
          <Text style={styles.deleteButtonText}>ELIMINAR EVENTO</Text>
        </TouchableOpacity>
        
        <View style={{ height: 50 }} />
      </ScrollView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={currentPicker.includes("hora") ? "time" : "date"}
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#5099F8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', marginTop: 20 },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  form: { flexGrow: 1, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30 },
  label: { color: '#5099F8', fontWeight: 'bold', marginBottom: 10, fontSize: 11, textTransform: 'uppercase' },
  input: { backgroundColor: '#F0F5FA', borderRadius: 15, padding: 15, marginBottom: 20, fontSize: 16, color: '#1e3a8a' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  halfInput: { backgroundColor: '#F0F5FA', borderRadius: 15, padding: 15, width: '48%', alignItems: 'center' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  mainButton: { backgroundColor: '#5099F8', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  mainButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  deleteButton: { padding: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 20, borderWidth: 1, borderColor: '#FF4F85' },
  deleteButtonText: { color: '#FF4F85', fontWeight: 'bold' }
});