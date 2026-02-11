import { StatusBar } from "expo-status-bar";
import { useContext, useRef, useState } from "react";
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from "styled-components/native";
import AuthContext from "../contexts/authContext";
import icono_calendario from '../icons/calendar-plus.webp';
import icono_gear from '../icons/gear.webp';
import icono_buscar from '../icons/search.webp';
import icono_ticket from '../icons/ticket.webp';
import icono_amigos from '../icons/user-list.webp';
import { logout } from "../services/authService";
import { ProfileBanner } from './ProfileBanner';
import { Tile, TileExtra } from './Tiles';

const imagen_perfil_prueba = 'https://vanwinefest.ca/wp-content/uploads/bfi_thumb/profile-default-male-nyg4vc4i3m1d5pote7rfsv4o4c7p5ka5an0pselxcc-nyhjt6b1oifa23xq2ehfxoh9vink6vuxyns1y35vkc.png'

// --- CAMBIO AQUÍ: Añadimos { navigation } en los paréntesis ---
export default function HomeScreen({ navigation }) {
  const [saved, setSaved] = useState([]);
  const { user, setUser } = useContext(AuthContext);
  const cerrandoSesion = useRef(false);

  const mostrarAlerta = () => {
    Alert.alert('¡Funciona!', 'El componente responde');
  };

  async function manejoLogout() {
    if (cerrandoSesion.current) return;
      cerrandoSesion.current = true;
    try {
      await logout();
      setUser(null);
    } catch (e) {
      cerrandoSesion.current = false;
    }
  }
  
  const insets = useSafeAreaInsets(); 

  return (
    <View style={[profileView_css.screen, { paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      
      <ProfileBanner
        nombre={user?.nombre || 'USER'}
        url_avatar={imagen_perfil_prueba}
      />

      <LogoutButton onPress={manejoLogout}>
        <Cerrar>
          <CerrarText>Cerrar sesión</CerrarText>
        </Cerrar>
      </LogoutButton>

      <View style={profileView_css.container_Tiles}>
        <Tile onPress={mostrarAlerta}
          icono={icono_buscar}
          titulo='Eventos'
          desc='Encuentra el evento perfecto para ti'
        />
        <Tile onPress={mostrarAlerta}
          icono={icono_calendario}
          titulo='Crear un evento'
          desc='Dale forma a tu evento'
        />
        
        {/* Ahora navigation ya existe porque lo recibimos arriba */}
        <Tile onPress={() => navigation.navigate('MisEventos')}
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
        <TileExtra onPress={mostrarAlerta}
          icono={icono_gear}
          titulo='Configuración'
        />
      </View>
    </View>
  );
}

// ... (Resto de tus funciones PerfilView y estilos se quedan igual)
export function PerfilView() {
  return (
    <SafeAreaProvider>
      <PerfilContent />
    </SafeAreaProvider>
  )
}
const LogoutButton = styled.TouchableOpacity``;
const Cerrar = styled.View`
  width: 110px;
  height: 48px;
  border-radius: 12px;
  margin-horizontal: 8px;
  background-color: #e8f0f9;
  align-items: center;
  justify-content: center;
`;

const CerrarText = styled.Text`
  font-size: 15px;
  font-weight: 700;
`;
const profileView_css = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F8F9FE', 
        paddingHorizontal: 10, 
        justifyContent: 'flex-start', 
    },
    container_Tiles: {
        width: '100%',
        alignItems: 'stretch', 
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