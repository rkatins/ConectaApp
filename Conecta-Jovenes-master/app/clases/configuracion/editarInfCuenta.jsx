import { useContext, useState } from "react";
import { ActivityIndicator, Alert, ScrollView } from "react-native";
import styled from "styled-components/native";
import AuthContext from "../../contexts/authContext";
import { getToken } from "../../services/tokenService"; // Importante

export default function EditInfoCuenta({ navigation }) {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        telefono: user?.telefono || "",
    });

    const manejarGuardar = async () => {
        setLoading(true);
        try {
            const activeToken = await getToken();
            const userId = user?.id || user?.id_usuario;

            if (!activeToken) {
                Alert.alert("Error", "No se detectó una sesión activa.");
                return;
            }

            const response = await fetch(`https://hackathon.lausnchez.es/api/v1/user/${userId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeToken}` 
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setUser({ ...user, ...formData });
                Alert.alert("Éxito", "Cuenta actualizada correctamente.");
                navigation.goBack();
            } else { 
                throw new Error(); 
            }
        } catch (e) { 
            Alert.alert("Error", "No se pudieron actualizar los datos de contacto."); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <Contenedor>
            <ScrollView contentContainerStyle={{ padding: 25 }}>
                <Titulo>Editar Cuenta</Titulo>
                
                <Label>Nombre de Usuario</Label>
                <Input 
                    value={formData.username} 
                    onChangeText={(t) => setFormData({...formData, username: t})} 
                    autoCapitalize="none" 
                />
                
                <Label>Email</Label>
                <Input 
                    value={formData.email} 
                    onChangeText={(t) => setFormData({...formData, email: t})} 
                    keyboardType="email-address" 
                    autoCapitalize="none" 
                />
                
                <Label>Teléfono</Label>
                <Input 
                    value={formData.telefono} 
                    onChangeText={(t) => setFormData({...formData, telefono: t})} 
                    keyboardType="phone-pad" 
                />

                <Boton onPress={manejarGuardar} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <TextoBoton>Actualizar Contacto</TextoBoton>}
                </Boton>
            </ScrollView>
        </Contenedor>
    );
}

const Contenedor = styled.SafeAreaView` flex: 1; background: #fff; `;
const Titulo = styled.Text` font-size: 26px; font-weight: 800; color: #1e3a8a; margin-bottom: 25px; `;
const Label = styled.Text` font-weight: 700; color: #1e3a8a; margin-bottom: 8px; `;
const Input = styled.TextInput` background: #f1f5f9; padding: 15px; border-radius: 12px; margin-bottom: 20px; color: #1e3a8a; `;
const Boton = styled.TouchableOpacity` background: #1e3a8a; padding: 18px; border-radius: 15px; align-items: center; margin-top: 10px; `;
const TextoBoton = styled.Text` color: #fff; font-weight: bold; font-size: 16px; `;