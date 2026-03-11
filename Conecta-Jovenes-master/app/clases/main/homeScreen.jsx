import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AuthContext from "../../contexts/authContext";

import icono_calendario from '../icons/calendar-plus.webp';
import icono_gear from '../icons/gear.webp';
import icono_buscar from '../icons/search.webp';
import icono_ticket from '../icons/ticket.webp';
import icono_amigos from '../icons/user-list.webp';

import { ProfileBanner } from '../login/ProfileBanner';
import { Tile, TileExtra } from '../login/Tiles';

const imagen_perfil_prueba = 'https://vanwinefest.ca/wp-content/uploads/bfi_thumb/profile-default-male-nyg4vc4i3m1d5pote7rfsv4o4c7p5ka5an0pselxcc-nyhjt6b1oifa23xq2ehfxoh9vink6vuxyns1y35vkc.png';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets(); 

  const mostrarAlerta = () => {
    Alert.alert('Próximamente', 'Esta función estará disponible muy pronto.');
  };

  return (
    <View style={[profileView_css.screen, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      {/* Contenedor con Scroll para que no se corte en pantallas pequeñas */}
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={{ marginTop: 10 }}> 
          <ProfileBanner
            nombre={user?.nombre || user?.username || 'USUARIO'}
            url_avatar={user?.avatar || imagen_perfil_prueba}
          />
        </View>

        <View style={profileView_css.container_Tiles}>
          <Tile 
            onPress={() => navigation.navigate('LeerEventos')}
            icono={icono_buscar}
            titulo='Eventos'
            desc='Encuentra el evento perfecto para ti'
          />
          
          <Tile 
              onPress={() => {
                  navigation.navigate("CrearEvento"); 
              }}
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
          <TileExtra onPress={() => navigation.navigate('LeerAmigos')}
            icono={icono_amigos}
            titulo='Tus amigos'
          />
          <TileExtra onPress={()=> {
              navigation.navigate("Configuracion");
            }}
            icono={icono_gear}
            titulo='Configuración'
          />
        </View>

      </ScrollView>
    </View>
  );
}

const profileView_css = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F8F9FE', 
        paddingHorizontal: 15, 
    },
    container_Tiles: {
        width: '100%',
        marginTop: 10, // Subido un poco más
        gap: 15, 
    },
    container_TilesExtra: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between', 
        marginTop: 20,
        paddingBottom: 40,
    }
});