import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { useContext, useRef } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import styled from "styled-components/native";
import AuthContext from "../../contexts/authContext";
import { logout } from "../../services/authService";
import { getToken } from "../../services/tokenService";

export default function Configuracion({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const procesandoAccion = useRef(false);

  const manejoLogout = async () => {
    if (procesandoAccion.current) return;
    procesandoAccion.current = true;
    try {
      await logout();
      setUser(null);
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
    } finally {
      procesandoAccion.current = false;
    }
  };

  const confirmarBorrarCuenta = () => {
    Alert.alert(
      "Eliminar Cuenta",
      "¿Estás completamente seguro? Esta acción no se puede deshacer y perderás todos tus datos.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: manejarBorrarCuenta 
        }
      ]
    );
  };

  const manejarBorrarCuenta = async () => {
    try {
      const activeToken = await getToken();
      const userId = user?.id || user?.id_usuario;

      const response = await fetch(`https://hackathon.lausnchez.es/api/v1/user/${userId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${activeToken}` 
        }
      });

      if (response.ok) {
        Alert.alert("Cuenta eliminada", "Tu cuenta ha sido borrada correctamente.");
        setUser(null); // Esto redirige al Login automáticamente
      } else {
        throw new Error();
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo eliminar la cuenta en este momento.");
    }
  };

  return (
    <Contenedor>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        <View style={styles.headerNav}>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#1e3a8a" />
          </BackButton>
        </View>

        <Cabecera>
          <Titulo>Ajustes</Titulo>
          <Subtitulo>Gestiona tu cuenta y seguridad</Subtitulo>
        </Cabecera>

        <Seccion>
          <LabelAzul>Ajustes de Perfil</LabelAzul>
          <Card>
            <MenuItem onPress={() => navigation.navigate("InformacionCuenta")}>
              <MenuLeft>
                <IconCircle color="#e0f2fe"><Ionicons name="card-outline" size={20} color="#0ea5e9" /></IconCircle>
                <MenuText>Mi Información</MenuText>
              </MenuLeft>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </MenuItem>
            <Divider />
            <MenuItem onPress={() => navigation.navigate("EditarInformacionPersonal")}>
              <MenuLeft>
                <IconCircle color="#e0e7ff"><Ionicons name="person-outline" size={20} color="#6366f1" /></IconCircle>
                <MenuText>Editar Datos Personales</MenuText>
              </MenuLeft>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </MenuItem>
            <Divider />
            <MenuItem onPress={() => navigation.navigate("EditarInformacionCuenta")}>
              <MenuLeft>
                <IconCircle color="#f0fdf4"><Ionicons name="at-outline" size={20} color="#22c55e" /></IconCircle>
                <MenuText>Editar Usuario y Contacto</MenuText>
              </MenuLeft>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </MenuItem>
          </Card>
        </Seccion>

        <Seccion>
          <LabelAzul>Acciones Críticas</LabelAzul>
          <Card>
            <MenuItem onPress={manejoLogout}>
              <MenuLeft>
                <IconCircle color="#fef2f2"><Ionicons name="log-out-outline" size={20} color="#dc2626" /></IconCircle>
                <MenuText style={{ color: '#dc2626' }}>Cerrar sesión</MenuText>
              </MenuLeft>
            </MenuItem>
            <Divider />
            <MenuItem onPress={confirmarBorrarCuenta}>
              <MenuLeft>
                <IconCircle color="#fff1f2"><Ionicons name="trash-outline" size={20} color="#be123c" /></IconCircle>
                <MenuText style={{ color: '#be123c' }}>Borrar cuenta permanentemente</MenuText>
              </MenuLeft>
            </MenuItem>
          </Card>
        </Seccion>
      </ScrollView>
    </Contenedor>
  );
}

const Contenedor = styled.SafeAreaView` flex: 1; background-color: #fff; `;
const BackButton = styled.TouchableOpacity` background-color: #f1f5f9; width: 45px; height: 45px; border-radius: 15px; justify-content: center; align-items: center; `;
const Cabecera = styled.View` padding: 10px 25px 25px; `;
const Titulo = styled.Text` font-size: 32px; font-weight: 900; color: #1e3a8a; `;
const Subtitulo = styled.Text` font-size: 16px; color: #64748b; `;
const Seccion = styled.View` margin-bottom: 25px; padding-horizontal: 25px; `;
const LabelAzul = styled.Text` color: #3b82f6; font-weight: 800; margin-bottom: 12px; font-size: 13px; text-transform: uppercase; `;
const Card = styled.View` background: #f8fafc; border-radius: 22px; border-width: 1px; border-color: #e2e8f0; overflow: hidden; `;
const MenuItem = styled.TouchableOpacity` flex-direction: row; justify-content: space-between; align-items: center; padding: 16px; `;
const MenuLeft = styled.View` flex-direction: row; align-items: center; `;
const IconCircle = styled.View` width: 40px; height: 40px; border-radius: 12px; background-color: ${props => props.color}; justify-content: center; align-items: center; margin-right: 15px; `;
const MenuText = styled.Text` color: #1e293b; font-size: 16px; font-weight: 600; `;
const Divider = styled.View` height: 1px; background-color: #e2e8f0; margin-horizontal: 16px; `;
const styles = StyleSheet.create({ headerNav: { paddingHorizontal: 25, marginBottom: 10, marginTop: 10 } });