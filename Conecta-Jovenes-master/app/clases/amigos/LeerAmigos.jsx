import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthContext from '../../contexts/authContext';
import { getToken } from '../../services/tokenService';

export default function LeerAmigos({ navigation }) {
  const { user } = useContext(AuthContext)
  const [amigos, setAmigos] = useState([])
  const [filteredAmigos, setFilteredAmigos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Usando `SafeAreaView` ya no se necesita
  // const insets = useSafeAreaInsets()

  const fetchTodosLosUsuarios = async () => {
    try {
      setLoading(true);
      const activeToken = await getToken();
      const response = await fetch('https://hackathon.lausnchez.es/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      const lista = Array.isArray(data) ? data : (data.data || []);
      const usuariosAjenos = lista.filter(usuario => usuario.id !== user?.id);
      setAmigos(usuariosAjenos);
      setFilteredAmigos(usuariosAjenos);
    } catch (error) {
      console.log("Error al cargar usuarios: " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodosLosUsuarios();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtrados = amigos.filter(usuario =>
      usuario.nombre.toLowerCase().includes(text.toLowerCase()) ||
      usuario.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredAmigos(filtrados);
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable 
        style={({pressed}) => [
          styles.userItem,
          {opacity: pressed ? 0.7 : 1}
        ]}
        onPress={() => {
          navigation.navigate('DetalleAmigo', { idUsuario: item.id }); 
        }}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={40} color="#5099F8" />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.nombre}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.header}>
        <Pressable 
          style={({pressed}) => [
            styles.backButtonMini,
            {opacity: pressed ? 0.7 : 1}
          ]} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Explorar Amigos</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Buscar por nombre o email..."
            style={styles.searchInput}
            value={search}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.blueContent}>
        {loading ? (
          <ActivityIndicator color="white" size="large" style={{marginTop: 50}} />
        ) : (
          <FlatList
            data={filteredAmigos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No se encontraron usuarios</Text>
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
  userItem: { 
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
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center',  // quitamos justifyContent: 'space-between'
    marginBottom: 8 
  },
  userName: { fontWeight: 'bold', color: '#333', fontSize: 17, marginBottom: 2 },
  userEmail: { fontSize: 13, color: '#666', marginLeft: 5 },
  userInfo: { marginLeft: 12, flex: 1 },
  emptyText: { color: 'white', textAlign: 'center', marginTop: 50, fontSize: 16, opacity: 0.8 }
});