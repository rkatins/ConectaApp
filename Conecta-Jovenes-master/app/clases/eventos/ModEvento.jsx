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
import { getToken } from '../../services/tokenService'; // Asegúrate de que la ruta sea correcta

export default function ModEvento({ route, navigation }) {
  const { evento } = route.params || {};
  
  // Estados del formulario
  const [nombre, setNombre] = useState(evento?.nombre || '');
  const [ubicacion, setUbicacion] = useState(evento?.ubicacion || '');
  const [descripcion, setDescripcion] = useState(evento?.descripcion || '');
  const [participantes, setParticipantes] = useState(String(evento?.num_participantes || '0'));
  const [esAccesible, setEsAccesible] = useState(!!evento?.es_accesible);
  
  // Estado de carga
  const [loading, setLoading] = useState(false);

  // --- FUNCIÓN PARA ACTUALIZAR (PUT) ---
  const handleUpdate = async () => {
    if (!nombre || !ubicacion) {
      Alert.alert("Error", "El nombre y la ubicación son obligatorios.");
      return;
    }

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
          id_categoria: evento.id_categoria, // Mantenemos los IDs originales
          id_entidad: evento.id_entidad,
          id_creador: evento.id_creador,
          nombre: nombre,
          fecha_inicio_evento: evento.fecha_inicio_evento, // Podrías añadir inputs para esto luego
          fecha_final_evento: evento.fecha_final_evento,
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
      console.error(error);
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
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      // El borrado suele devolver 204 (No Content)
      if (response.status === 204 || response.ok) {
        Alert.alert("Eliminado", "El evento ha sido borrado con éxito.", [
          { text: "OK", onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        throw new Error("No se pudo eliminar");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al eliminar el evento.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Eliminar Evento",
      "¿Estás seguro de que quieres borrar este evento? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: handleDelete }
      ]
    );
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
        <TextInput 
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>UBICACIÓN</Text>
        <TextInput 
          style={styles.input}
          value={ubicacion}
          onChangeText={setUbicacion}
        />

        <Text style={styles.label}>DESCRIPCIÓN</Text>
        <TextInput 
          style={[styles.input, { height: 80 }]}
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />

        <Text style={styles.label}>Nº PARTICIPANTES</Text>
        <TextInput 
          style={styles.input}
          value={participantes}
          onChangeText={setParticipantes}
          keyboardType="numeric"
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>ES ACCESIBLE</Text>
          <Switch 
            value={esAccesible}
            onValueChange={setEsAccesible}
            trackColor={{ false: "#767577", true: "#B3E458" }}
          />
        </View>

        <TouchableOpacity 
          style={[styles.mainButton, loading && { opacity: 0.7 }]} 
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.mainButtonText}>
            {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={confirmDelete}
          disabled={loading}
        >
          <Ionicons name="trash-outline" size={20} color="#FF4F85" />
          <Text style={styles.deleteButtonText}>ELIMINAR EVENTO</Text>
        </TouchableOpacity>
        
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#5099F8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', marginTop: 20 },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  form: { flexGrow: 1, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30 },
  label: { color: '#5099F8', fontWeight: 'bold', marginBottom: 10, fontSize: 12 },
  input: { backgroundColor: '#F0F5FA', borderRadius: 15, padding: 15, marginBottom: 20, fontSize: 16 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  mainButton: { backgroundColor: '#5099F8', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  mainButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  deleteButton: { flexDirection: 'row', backgroundColor: '#FFF0F4', padding: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 20, borderWidth: 1, borderColor: '#FF4F85' },
  deleteButtonText: { color: '#FF4F85', fontWeight: 'bold', fontSize: 14, marginLeft: 10 }
});