import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AuthContext from '../../contexts/authContext';
import { getToken } from '../../services/tokenService';

export default function MisEventosScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Función para determinar el color (Prioriza azul si es accesible)
  const getCategoryColor = (item) => {
    // Verificamos si es accesible (asumiendo que el campo es 'accesible' o 'es_accesible')
    if (item.accesible === true || item.es_accesible === 1 || item.accesible === 1) {
      return '#5099F8'; // Azul
    }

    const nombre = item.categoria?.nombre?.toLowerCase() || '';
    if (nombre.includes('deporte')) return '#B3E458'; // Verde
    if (nombre.includes('cultura') || nombre.includes('social')) return '#FFB553'; // Naranja
    return '#EF4F85'; // Rosa/Rojo por defecto
  };

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const activeToken = await getToken();

      if (!user?.id || !activeToken) {
        setLoading(false);
        return;
      }

      const url = `https://hackathon.lausnchez.es/api/v1/user/${user.id}/eventos`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setEventos(Array.isArray(data) ? data : (data.data || []));
      }
    } catch (error) {
      console.error("Error cargando eventos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchEventos} tintColor="white" />}
      >
        {/* Encabezado */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Inscripciones</Text>
        </View>

        <View style={styles.card}>
          {/* Estadísticas */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{eventos.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {eventos.filter(e => e.fecha && new Date(e.fecha) > new Date()).length}
              </Text>
              <Text style={styles.statLabel}>Próximos</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>LISTADO DE EVENTOS</Text>

          <View style={styles.eventsContainer}>
            {loading ? (
              <ActivityIndicator color="white" size="large" style={{ marginTop: 40 }} />
            ) : eventos.length > 0 ? (
              eventos.map((item) => {
                const colorDinamico = getCategoryColor(item);
                const esAccesible = item.accesible === true || item.es_accesible === 1;

                return (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.eventItem}
                    onPress={() => navigation.navigate('DetalleEvento', { id: item.id })}
                  >
                    <View style={styles.eventContent}>
                      {/* Icono con fondo suave */}
                      <View style={[styles.iconCircle, { backgroundColor: `${colorDinamico}20` }]}>
                        <Ionicons 
                          name={esAccesible ? "accessibility" : "calendar"} 
                          size={22} 
                          color={colorDinamico} 
                        />
                      </View>

                      <View style={styles.textContainer}>
                        {/* Etiqueta de Categoría */}
                        <View style={[styles.miniBadge, { backgroundColor: colorDinamico }]}>
                          <Text style={styles.miniBadgeText}>
                            {item.categoria?.nombre?.toUpperCase() || 'EVENTO'}
                          </Text>
                        </View>

                        <Text style={styles.eventTitle}>{item.nombre}</Text>
                        
                        <View style={styles.infoRow}>
                          <Ionicons name="location-outline" size={14} color="#666" />
                          <Text style={styles.eventSub} numberOfLines={1}>{item.ubicacion}</Text>
                        </View>
                      </View>

                      <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={60} color="rgba(255,255,255,0.3)" />
                <Text style={styles.noEventsText}>No tienes eventos registrados</Text>
                <TouchableOpacity 
                  style={styles.exploreButton}
                  onPress={() => navigation.navigate('Home')}
                >
                  <Text style={styles.exploreButtonText}>Explorar Eventos</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1 },
  topHeader: { height: 120, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40 },
  backButton: { backgroundColor: '#eee', borderRadius: 12, padding: 10, marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  card: { backgroundColor: '#5099F8', flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 30, paddingHorizontal: 25, paddingBottom: 40, minHeight: 700 },
  statsContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 20, marginBottom: 30, alignItems: 'center', justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statNumber: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: 'white', fontSize: 12, opacity: 0.8 },
  statDivider: { width: 1, height: '70%', backgroundColor: 'rgba(255,255,255,0.3)' },
  sectionTitle: { color: 'white', fontWeight: 'bold', fontSize: 18, marginBottom: 20 },
  eventsContainer: { width: '100%' },
  eventItem: { backgroundColor: 'white', borderRadius: 20, padding: 15, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
  eventContent: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 45, height: 45, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1 },
  miniBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 4 },
  miniBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  eventTitle: { fontWeight: 'bold', color: '#333', fontSize: 16, marginBottom: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  eventSub: { fontSize: 13, color: '#666', marginLeft: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  noEventsText: { color: 'white', marginTop: 15, fontSize: 16, opacity: 0.8 },
  exploreButton: { marginTop: 20, backgroundColor: '#fff', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  exploreButtonText: { color: '#5099F8', fontWeight: 'bold' }
});