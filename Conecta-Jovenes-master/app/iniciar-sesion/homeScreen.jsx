import { StatusBar } from "expo-status-bar";
import { useContext, useRef } from "react";
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from "styled-components/native";

// CORRECCIÓN DE RUTAS: Usamos "../" para subir un nivel y encontrar las carpetas
import AuthContext from "../contexts/authContext";
import { logout } from "../services/authService";

// Iconos
import icono_calendario from '../icons/calendar-plus.webp';
import icono_gear from '../icons/gear.webp';
import icono_buscar from '../icons/search.webp';
import icono_ticket from '../icons/ticket.webp';
import icono_amigos from '../icons/user-list.webp';

import { ProfileBanner } from './ProfileBanner';
import { Tile, TileExtra } from './Tiles';

const imagen_perfil_prueba = 'https://vanwinefest.ca/wp-content/uploads/bfi_thumb/profile-default-male-nyg4vc4i3m1d5pote7rfsv4o4c7p5ka5an0pselxcc-nyhjt6b1oifa23xq2ehfxoh9vink6vuxyns1y35vkc.png';

export default function HomeScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const cerrandoSesion = useRef(false);
  const insets = useSafeAreaInsets(); 

  const mostrarAlerta = () => {
    Alert.alert('Próximamente', 'Esta función estará disponible muy pronto.');
  };

  async function manejoLogout() {
    if (cerrandoSesion.current) return;
    cerrandoSesion.current = true;
    try {
      await logout();
      setUser(null);
    } catch (e) {
      console.error("Error al cerrar sesión", e);
      cerrandoSesion.current = false;
    }
  }

  return (
    <View style={[profileView_css.screen, { paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      
      <ProfileBanner
        nombre={user?.nombre || user?.username || 'USUARIO'}
        url_avatar={user?.avatar || imagen_perfil_prueba}
      />

      <LogoutButton onPress={manejoLogout}>
        <Cerrar>
          <CerrarText>Cerrar sesión</CerrarText>
        </Cerrar>
      </LogoutButton>

      <View style={profileView_css.container_Tiles}>
        {/* BOTÓN EVENTOS: Ahora navega a la nueva pantalla */}
        <Tile 
          onPress={() => navigation.navigate('LeerEventos')}
          icono={icono_buscar}
          titulo='Eventos'
          desc='Encuentra el evento perfecto para ti'
        />
        
        <Tile onPress={mostrarAlerta}
          icono={icono_calendario}
          titulo='Crear un evento'
          desc='Dale forma a tu evento'
        />
        
        <Tile 
          onPress={() => navigation.navigate('MisEventos')}
          icono={icono_ticket}
          titulo='Mis eventos'
          desc='Tus eventos, a una pulsación'
        />
      </View>

      <View style={profileView_css.container_TilesExtra}>
        <TileExtra onPress={mostrarAlerta}
          icono={icono_amigos}
          titulo='Tus amigos'
        />
        <TileExtra 
          onPress={() => navigation.navigate('Perfil')}
          icono={icono_gear}
          titulo='Mi Perfil'
        />
      </View>
    </View>
  );
}

// --- ESTILOS ---

const LogoutButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-top: 10px;
  margin-left: 10px;
`;

const Cerrar = styled.View`
  width: 120px;
  height: 40px;
  border-radius: 12px;
  background-color: #f0f0f0;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  borderColor: #ddd;
`;

const CerrarText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ff4f85;
`;

const profileView_css = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F8F9FE', 
        paddingHorizontal: 15, 
    },
    container_Tiles: {
        width: '100%',
        marginTop: 20,
        gap: 15, 
    },
    container_TilesExtra: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between', 
        marginTop: 25,
        paddingBottom: 40,
    }
});