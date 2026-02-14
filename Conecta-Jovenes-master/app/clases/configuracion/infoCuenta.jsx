import { Ionicons } from '@expo/vector-icons';
import { useContext } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import AuthContext from "../../contexts/authContext";

export default function InfoCuenta({ navigation }) {
  const { user } = useContext(AuthContext);

  return (
    <Contenedor>
      <Header>
        <BackButton onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color="#1e3a8a" /></BackButton>
        <TextoHeader>Mi Información</TextoHeader>
      </Header>
      <ScrollView contentContainerStyle={{ padding: 25 }}>
        <LabelAzul>Datos de Perfil</LabelAzul>
        <Tarjeta>
          <InfoRow><Label>NOMBRE USUARIO</Label><Valor>@{user?.username}</Valor></InfoRow>
          <Separador /><InfoRow><Label>EMAIL</Label><Valor>{user?.email}</Valor></InfoRow>
          <Separador /><InfoRow><Label>NOMBRE</Label><Valor>{user?.nombre} {user?.apellido}</Valor></InfoRow>
          <Separador /><InfoRow><Label>FECHA NACIMIENTO</Label><Valor>{user?.fecha_nacimiento}</Valor></InfoRow>
        </Tarjeta>
      </ScrollView>
    </Contenedor>
  );
}

const Contenedor = styled.SafeAreaView` flex: 1; background: #f8fafc; `;
const Header = styled.View` flex-direction: row; align-items: center; padding: 20px; background: #fff; border-bottom-width: 1px; border-bottom-color: #e2e8f0; `;
const BackButton = styled.TouchableOpacity` background: #f1f5f9; padding: 8px; border-radius: 12px; `;
const TextoHeader = styled.Text` font-size: 18px; font-weight: 700; margin-left: 15px; color: #1e3a8a; `;
const LabelAzul = styled.Text` color: #3b82f6; font-weight: 800; font-size: 12px; margin-bottom: 10px; `;
const Tarjeta = styled.View` background: #fff; border-radius: 20px; padding: 5px 15px; border: 1px solid #e2e8f0; `;
const InfoRow = styled.View` padding: 15px 0; `;
const Label = styled.Text` color: #94a3b8; font-size: 11px; font-weight: 800; `;
const Valor = styled.Text` color: #1e3a8a; font-size: 16px; font-weight: 600; margin-top: 2px; `;
const Separador = styled.View` height: 1px; background: #f1f5f9; `;