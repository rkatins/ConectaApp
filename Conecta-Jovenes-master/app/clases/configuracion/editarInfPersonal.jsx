import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from "expo-status-bar";
import { useContext, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import AuthContext from "../../contexts/authContext";
// IMPORTANTE: Importamos el servicio del token igual que en tus otras pantallas
import { getToken } from "../../services/tokenService";

export default function EditInfoPersonal({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    fecha_nacimiento: user?.fecha_nacimiento ? new Date(user.fecha_nacimiento) : new Date(),
  });

  const guardarCambios = async () => {
    setLoading(true);
    
    try {
      // Obtenemos el token de forma segura desde el servicio
      const activeToken = await getToken();
      const userId = user?.id || user?.id_usuario; // Aseguramos el ID correcto

      if (!activeToken || !userId) {
        Alert.alert("Error", "No se pudo validar la sesión actual.");
        setLoading(false);
        return;
      }

      if (!formData.nombre.trim() || !formData.apellido.trim()) {
        Alert.alert("Campos vacíos", "Por favor, completa tu nombre y apellidos.");
        setLoading(false);
        return;
      }

      const d = formData.fecha_nacimiento;
      const fechaStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

      const response = await fetch(`https://hackathon.lausnchez.es/api/v1/user/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${activeToken}` // Usamos el token recuperado
        },
        body: JSON.stringify({ 
          nombre: formData.nombre,
          apellido: formData.apellido,
          fecha_nacimiento: fechaStr 
        })
      });

      if (response.ok) {
        // Actualizamos el contexto global
        setUser({ ...user, ...formData, fecha_nacimiento: fechaStr });
        Alert.alert("¡Éxito!", "Tu información personal ha sido actualizada.");
        navigation.goBack();
      } else { 
        const errorData = await response.json();
        console.log("Error API:", errorData);
        throw new Error(); 
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally { 
      setLoading(false); 
    }
  };

  const onChangeFecha = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setFormData({ ...formData, fecha_nacimiento: selectedDate });
  };

  return (
    <Contenedor>
      <StatusBar style="dark" />
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#1e3a8a" />
        </BackButton>
        <TextoHeader>Información Personal</TextoHeader>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 25 }}>
        <Seccion>
          <LabelAzul>Datos de Identidad</LabelAzul>
          <Tarjeta>
            <InputGroup>
              <LabelInput>NOMBRE</LabelInput>
              <InputStyled
                value={formData.nombre}
                onChangeText={(t) => setFormData({ ...formData, nombre: t })}
                placeholder="Tu nombre"
              />
            </InputGroup>
            <Separador />
            <InputGroup>
              <LabelInput>APELLIDOS</LabelInput>
              <InputStyled
                value={formData.apellido}
                onChangeText={(t) => setFormData({ ...formData, apellido: t })}
                placeholder="Tus apellidos"
              />
            </InputGroup>
            <Separador />
            <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.7}>
              <InputGroup style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <LabelInput>FECHA DE NACIMIENTO</LabelInput>
                  <ValorText>{formData.fecha_nacimiento.toLocaleDateString('es-ES')}</ValorText>
                </View>
                <Ionicons name="calendar-outline" size={22} color="#5099F8" />
              </InputGroup>
            </TouchableOpacity>
          </Tarjeta>
        </Seccion>

        {showPicker && (
          <DateTimePicker
            value={formData.fecha_nacimiento}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={onChangeFecha}
          />
        )}

        <BotonGuardar onPress={guardarCambios} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <TextoBoton>Guardar Cambios</TextoBoton>
              <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            </>
          )}
        </BotonGuardar>
      </ScrollView>
    </Contenedor>
  );
}

// --- ESTILOS (Mantenemos tus estilos originales) ---
const Contenedor = styled.SafeAreaView` flex: 1; background-color: #f8fafc; `;
const Header = styled.View` flex-direction: row; align-items: center; padding: 20px; background: #fff; border-bottom-width: 1px; border-bottom-color: #e2e8f0; `;
const BackButton = styled.TouchableOpacity` background: #f1f5f9; padding: 8px; border-radius: 12px; `;
const TextoHeader = styled.Text` font-size: 18px; font-weight: 700; margin-left: 15px; color: #1e3a8a; `;
const Seccion = styled.View` margin-bottom: 30px; `;
const LabelAzul = styled.Text` color: #5099F8; font-weight: 800; font-size: 12px; text-transform: uppercase; margin-bottom: 12px; margin-left: 5px; `;
const Tarjeta = styled.View` background: #fff; border-radius: 20px; padding: 5px 15px; border-width: 1px; border-color: #e2e8f0; `;
const InputGroup = styled.View` padding: 15px 0; `;
const LabelInput = styled.Text` color: #94a3b8; font-size: 10px; font-weight: 800; margin-bottom: 4px; `;
const InputStyled = styled.TextInput` color: #1e3a8a; font-size: 16px; font-weight: 600; padding: 0; `;
const ValorText = styled.Text` color: #1e3a8a; font-size: 16px; font-weight: 600; `;
const Separador = styled.View` height: 1px; background-color: #f1f5f9; `;
const BotonGuardar = styled.TouchableOpacity` background-color: #5099F8; flex-direction: row; padding: 18px; border-radius: 18px; justify-content: center; align-items: center; margin-top: 10px; `;
const TextoBoton = styled.Text` color: #fff; font-size: 16px; font-weight: 800; margin-right: 10px; `;