import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { getToken } from '../services/tokenService';

export default function ExplorarEventosScreen({ navigation }) {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const getCategoryColor = (item) => {
    if (item.accesible === true || item.es_accesible === 1) return '#5099F8';
    const nombre = item.categoria?.nombre?.toLowerCase() || '';
    if (nombre.includes('deporte')) return '#B3E458';
    if (nombre.includes('cultura')) return '#FFB553';
    if (nombre.includes('social')) return '#FFB553';
    return '#EF4F85';
  };

  const fetchTodosLosEventos = async () => {
    try {
      setLoading(true);
      const activeToken = await getToken();
      const url = `https://hackathon.lausnchez.es/api/v1/eventos`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      const lista = Array.isArray(data) ? data : (data.data || []);
      setEventos(lista);
      setFilteredEventos(lista);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodosLosEventos();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtrados = eventos.filter(event => 
      event.nombre.toLowerCase().includes(text.toLowerCase()) || 
      event.ubicacion.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredEventos(filtrados);
  };

  const renderItem = ({ item }) => {
    const colorCat = getCategoryColor(item);
    const esAccesible = item.accesible === true || item.es_accesible === 1;

    return (
      <TouchableOpacity 
        style={styles.eventItem} 
        // CAMBIO AQUÍ: Ahora pasamos el ID y el OBJETO completo para el detalle
        onPress={() => navigation.navigate('DetalleEvento', { 
            id: item.id, 
            evento: item 
        })}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: colorCat }]}>
            <Text style={styles.categoryText}>
              {item.categoria?.nombre?.toUpperCase() || 'EVENTO'}
            </Text>
          </View>
          {esAccesible && <Ionicons name="accessibility" size={18} color="#5099F8" />}
        </View>

        <Text style={styles.eventTitle}>{item.nombre}</Text>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colorCat} />
          <Text style={styles.eventSub}>{item.ubicacion}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonMini} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explorar Eventos</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Buscar por nombre o lugar..."
            style={styles.searchInput}
            value={search}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.blueContent}>
        {loading ? (
          <ActivityIndicator color="white" size="large" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={filteredEventos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No se encontraron eventos</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#5099F8' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 40, 
    paddingBottom: 15 
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: 'white', marginLeft: 10 },
  backButtonMini: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 8 },
  searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
  searchBox: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    alignItems: 'center',
    elevation: 4
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16, color: '#000' },
  blueContent: { flex: 1, backgroundColor: '#5099F8', paddingHorizontal: 20 },
  listPadding: { paddingBottom: 40 },
  eventItem: { 
    backgroundColor: 'white', 
    padding: 18, 
    borderRadius: 22, 
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  categoryText: { color: 'white', fontSize: 10, fontWeight: '800' },
  eventTitle: { fontWeight: 'bold', color: '#333', fontSize: 17, marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  eventSub: { fontSize: 13, color: '#666', marginLeft: 5 },
  emptyText: { color: 'white', textAlign: 'center', marginTop: 50, fontSize: 16, opacity: 0.8 }
});