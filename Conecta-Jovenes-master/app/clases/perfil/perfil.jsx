import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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

export default function PerfilScreen({ navigation }) {
  const { user } = useContext(AuthContext); 
  
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getCategoryColor = (item) => {
    if (item.accesible === true || item.es_accesible === 1 || item.accesible === 1) {
      return '#5099F8'; 
    }
    const nombre = item.categoria?.nombre?.toLowerCase() || '';
    if (nombre.includes('deporte')) return '#B3E458';
    if (nombre.includes('cultura')) return '#FFB553'; 
    if (nombre.includes('social'))  return '#FFB553'; 
    return '#EF4F85'; 
  };

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const activeToken = await getToken();
      if (!user?.id || !activeToken) {
        setLoading(false);
        return;
      }
      const url = `https://hackathon.lausnchez.es/api/v1/user/${user.id}/eventosPropios`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}` 
        }
      });
      const data = await response.json();
      if (response.ok) {
        const lista = Array.isArray(data) ? data : (data.data || []);
        setEventos(lista);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [user?.id]);

  if (!user) return <View style={styles.center}><ActivityIndicator size="large" color="#5099F8" /></View>;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchEventos} tintColor="white" />}
      >
        <View style={styles.headerSpacer} />
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            <Image 
                source={{ uri: user.avatar || 'https://vanwinefest.ca/wp-content/uploads/bfi_thumb/profile-default-male-nyg4vc4i3m1d5pote7rfsv4o4c7p5ka5an0pselxcc.png' }} 
                style={styles.avatarImage} 
            />
          </View>

          <Text style={styles.username}>{user.username?.toUpperCase() || 'USUARIO'}</Text>
          <Text style={styles.userEmail}>{user.email || 'Sin correo registrado'}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Ionicons name="trophy-outline" size={22} color="#5099F8" />
              <Text style={styles.buttonText}>Logros</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Ionicons name="bookmark-outline" size={22} color="#5099F8" />
              <Text style={styles.buttonText}>Guardados</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>MIS EVENTOS</Text>
          
          <View style={styles.eventsContainer}>
            {loading ? (
              <ActivityIndicator color="white" size="large" style={{ marginTop: 20 }} />
            ) : eventos.length > 0 ? (
              eventos.map((item) => {
                const colorCat = getCategoryColor(item);
                const esAccesible = item.accesible === true || item.es_accesible === 1;

                return (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.eventItem}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('ModEvento', { evento: item })} // NAVEGACIÓN AQUÍ
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={[styles.categoryBadge, { backgroundColor: colorCat }]}>
                        <Text style={styles.categoryText}>
                          {item.categoria?.nombre?.toUpperCase() || 'EVENTO'}
                        </Text>
                      </View>
                      
                      {esAccesible && (
                        <Ionicons name="accessibility" size={18} color="#5099F8" style={{ marginBottom: 5 }} />
                      )}
                    </View>

                    <Text style={styles.eventTitle}>{item.nombre}</Text>
                    
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={14} color={colorCat} />
                      <Text style={styles.eventSub}>{item.ubicacion}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar-outline" size={40} color="rgba(255,255,255,0.5)" />
                <Text style={styles.noEventsText}>Aún no tienes eventos asignados</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (Los estilos se mantienen iguales que los tuyos)
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerSpacer: { height: 100 },
  card: { 
    backgroundColor: '#5099F8', 
    flex: 1, 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    paddingTop: 80, 
    paddingHorizontal: 25, 
    paddingBottom: 40, 
    alignItems: 'center', 
    minHeight: 700 
  },
  avatarWrapper: { 
    position: 'absolute', 
    top: -75, 
    width: 150, 
    height: 150, 
    borderRadius: 75, 
    borderWidth: 6, 
    borderColor: '#D8E8FE', 
    backgroundColor: '#eee', 
    overflow: 'hidden', 
    zIndex: 10,
    elevation: 10,
  },
  avatarImage: { width: '100%', height: '100%' },
  username: { fontSize: 26, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  userEmail: { fontSize: 20, color: '#000000', marginBottom: 25, opacity: 0.9 },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 30 
  },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    paddingVertical: 14, 
    borderRadius: 20, 
    width: '48%', 
    justifyContent: 'center',
    elevation: 5,
  },
  buttonText: { color: '#5099F8', fontWeight: 'bold', marginLeft: 8, fontSize: 15 },
  divider: { width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 25 },
  sectionTitle: { color: 'white', fontWeight: '800', fontSize: 20, alignSelf: 'flex-start', marginBottom: 20 },
  eventsContainer: { width: '100%' },
  eventItem: { 
    backgroundColor: 'white', 
    padding: 18, 
    borderRadius: 22, 
    marginBottom: 15,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  eventTitle: { fontWeight: 'bold', color: '#333', fontSize: 17, marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  eventSub: { fontSize: 13, color: '#666', marginLeft: 5 },
  emptyContainer: { alignItems: 'center', marginTop: 30 },
  noEventsText: { color: 'white', marginTop: 12, fontSize: 14, opacity: 0.8 },
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    zIndex: 30, 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 10,
    elevation: 4
  }
});