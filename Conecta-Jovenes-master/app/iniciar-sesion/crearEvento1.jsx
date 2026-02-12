import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import styled from "styled-components/native";
import AuthContext from "../contexts/authContext";
import { obtenerCategorias } from "../services/categoryService";
import { obtenerEntidades } from "../services/entityService";

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

  if (cargando) return <Centrado><ActivityIndicator size="large" color="#2563eb" /></Centrado>;

  return (
    <Contenedor>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Titulo>Crear Evento</Titulo>
        
        <Seccion>
          <LabelAzul>Información General</LabelAzul>
          <InputRounded placeholder="Nombre del evento" value={nombre} onChangeText={setNombre} />
          <InputRounded 
            placeholder="Descripción" 
            multiline 
            numberOfLines={4} 
            value={desc} 
            onChangeText={setDesc} 
            style={{ height: 100, textAlignVertical: 'top' }} 
          />
        </Seccion>

        <Seccion>
          <LabelAzul>ID de Ubicación (API)</LabelAzul>
          <InputRounded placeholder="Ej. 65b8f1a9c2e44f..." value={ubi} onChangeText={setUbi} />
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
          />
          <DropdownStyle 
            data={entidades} 
            labelField="label" 
            valueField="value" 
            placeholder="Selecciona Entidad" 
            value={idEnt} 
            onChange={item => setIdEnt(item.value)} 
          />
        </Seccion>

        <BotonAzul onPress={manejarSiguiente}>
          <TextoBoton>Siguiente Paso</TextoBoton>
        </BotonAzul>
      </ScrollView>
    </Contenedor>
  );
}

const Centrado = styled.View` flex: 1; justify-content: center; align-items: center; background: #fff; `;
const Contenedor = styled.SafeAreaView` flex: 1; padding: 25px; background-color: #fff; `;
const Titulo = styled.Text` font-size: 30px; font-weight: 800; color: #1e3a8a; margin-bottom: 20px; `;
const Seccion = styled.View` margin-bottom: 20px; `;
const LabelAzul = styled.Text` color: #3b82f6; font-weight: 700; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; `;
const InputRounded = styled.TextInput` background: #eff6ff; padding: 18px; border-radius: 20px; border: 1.5px solid #dbeafe; color: #1e40af; margin-bottom: 12px; `;
const DropdownStyle = styled(Dropdown)` background: #eff6ff; padding: 15px; border-radius: 20px; border: 1.5px solid #dbeafe; margin-bottom: 12px; `;
const BotonAzul = styled.TouchableOpacity` background: #2563eb; padding: 20px; border-radius: 25px; align-items: center; margin-vertical: 20px; `;
const TextoBoton = styled.Text` color: white; font-weight: 800; font-size: 18px; `;