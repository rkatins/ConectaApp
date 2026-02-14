import { Ionicons } from '@expo/vector-icons'; // Importamos Ionicons
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import styled from "styled-components/native";
import AuthContext from "../../contexts/authContext";
import { obtenerCategorias } from "../../services/categoryService";
import { obtenerEntidades } from "../../services/entityService";

export default function CrearEvento1({ navigation }) {
  const { user } = useContext(AuthContext); 
  
  const [nombre, setNombre] = useState("");
  const [desc, setDesc] = useState("");
  const [ubi, setUbi] = useState("");
  const [idCat, setIdCat] = useState(null);
  const [idEnt, setIdEnt] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [resCats, resEnts] = await Promise.all([obtenerCategorias(), obtenerEntidades()]);
        setCategorias(resCats.map(c => ({ label: c.nombre, value: c.id })));
        setEntidades(resEnts.map(e => ({ label: e.nombre, value: e.id })));
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos.");
      } finally { setCargando(false); }
    }
    cargarDatos();
  }, []);

  const manejarSiguiente = () => {
    if (!nombre || !desc || !idCat || !idEnt || ubi.length < 5) {
      Alert.alert("Campos incompletos", "Rellena todo. La ubicación debe tener al menos 5 caracteres.");
      return;
    }
    
    navigation.navigate("CrearEvento2", {
      id_categoria: idCat,
      id_entidad: idEnt,
      id_creador: user?.id || 21,
      nombre: nombre,
      desc: desc,
      ubi: ubi 
    });
  };

  if (cargando) return <Centrado><ActivityIndicator size="large" color="#5099F8" /></Centrado>;

  return (
    <Contenedor>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        
        {/* BOTÓN VOLVER ATRÁS */}
        <View style={{ paddingHorizontal: 25, marginBottom: 10, marginTop: 20 }}>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#1e3a8a" />
          </BackButton>
        </View>

        <Cabecera>
          <Titulo>Crear Evento</Titulo>
          <Subtitulo>Paso 1 de 2: Información general</Subtitulo>
        </Cabecera>
        
        <Seccion>
          <LabelAzul>Información General</LabelAzul>
          <InputRounded 
            placeholder="Nombre del evento" 
            value={nombre} 
            onChangeText={setNombre} 
            placeholderTextColor="#94a3b8"
          />
          <InputRounded 
            placeholder="Descripción del evento..." 
            multiline 
            numberOfLines={4} 
            value={desc} 
            onChangeText={setDesc} 
            placeholderTextColor="#94a3b8"
            style={{ height: 120, textAlignVertical: 'top' }} 
          />
        </Seccion>

        <Seccion>
          <LabelAzul>Ubicación</LabelAzul>
          <InputRounded 
            placeholder="Dirección o lugar del evento" 
            value={ubi} 
            onChangeText={setUbi} 
            placeholderTextColor="#94a3b8"
          />
        </Seccion>

        <Seccion>
          <LabelAzul>Categoría y Entidad</LabelAzul>
          <DropdownStyle 
            data={categorias} 
            labelField="label" 
            valueField="value" 
            placeholder="Selecciona Categoría" 
            value={idCat} 
            onChange={item => setIdCat(item.value)} 
            placeholderStyle={{ color: '#94a3b8' }}
          />
          <DropdownStyle 
            data={entidades} 
            labelField="label" 
            valueField="value" 
            placeholder="Selecciona Entidad" 
            value={idEnt} 
            onChange={item => setIdEnt(item.value)} 
            placeholderStyle={{ color: '#94a3b8' }}
          />
        </Seccion>

        <View style={{ paddingHorizontal: 25, marginBottom: 40 }}>
          <BotonAzul onPress={manejarSiguiente} activeOpacity={0.8}>
            <TextoBoton>Siguiente Paso</TextoBoton>
          </BotonAzul>
        </View>

      </ScrollView>
    </Contenedor>
  );
}

// --- ESTILOS ---

const Contenedor = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

// Estilo para el botón de atrás
const BackButton = styled.TouchableOpacity`
  background-color: #f1f5f9;
  width: 45px;
  height: 45px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;

const Centrado = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #fff;
`;

const Cabecera = styled.View`
  padding-horizontal: 25px;
  margin-bottom: 30px;
`;

const Titulo = styled.Text`
  font-size: 32px;
  font-weight: 900;
  color: #1e3a8a;
`;

const Subtitulo = styled.Text`
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
  margin-top: 5px;
`;

const Seccion = styled.View`
  margin-bottom: 35px;
  padding-horizontal: 25px;
`;

const LabelAzul = styled.Text`
  color: #3b82f6;
  font-weight: 800;
  margin-bottom: 15px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const InputRounded = styled.TextInput`
  background: #f1f5f9;
  padding: 20px;
  border-radius: 18px;
  border-width: 1px;
  border-color: #e2e8f0;
  color: #1e40af;
  margin-bottom: 15px;
  font-size: 16px;
`;

const DropdownStyle = styled(Dropdown)`
  background: #f1f5f9;
  padding: 15px 20px;
  border-radius: 18px;
  border-width: 1px;
  border-color: #e2e8f0;
  margin-bottom: 15px;
`;

const BotonAzul = styled.TouchableOpacity`
  background: #2563eb;
  padding: 22px;
  border-radius: 20px;
  align-items: center;
  margin-top: 10px;
  elevation: 4;
  shadow-color: #2563eb;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
`;

const TextoBoton = styled.Text`
  color: white;
  font-weight: 800;
  font-size: 18px;
`;