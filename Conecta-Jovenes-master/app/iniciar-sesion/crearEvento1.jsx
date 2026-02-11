import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import styled from "styled-components/native";
import AuthContext from "../contexts/authContext.jsx";
import { obtenerCategorias } from "../services/categoryService.jsx";
import { obtenerEntidades } from "../services/entityService.jsx";
import { pedirTexto } from "./control.jsx";
export default function CrearEvento1({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [openCategoria, setOpenCategoria] = useState(false);
  const [openEntidad, setOpenEntidad] = useState(false);
  const [itemsCategoria, setItemsCategoria] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [itemsEntidades, setItemsEntidades] = useState([]);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState("");
  const [nombreEvento, setNombreEvento] = useState("");
  const [ubicacionEvento, setUbicacionEvento] = useState("");
  const [descripcionEvento, setDescripcionEvento] = useState("");
  const [errores, setErrores] = useState({});

  useEffect(() => {
    async function cargarCategorias() {
      const newErrors = {};
      try {
        const data = await obtenerCategorias();
        const mapped = data.map((cat) => ({
          label: cat.nombre,
          value: cat.id,
        }));
        setItemsCategoria(mapped);
      } catch (e) {
        newErrors.categoria = "No se pudieron cargar las categorías";
        setErrores(newErrors);
      }
    }
    async function cargarEntidad() {
      const newErrors = {};
      try {
        const data = await obtenerEntidades();
        const mapped = data.map((cat) => ({
          label: cat.nombre,
          value: cat.id,
        }));
        setItemsEntidades(mapped);
      } catch (e) {
        newErrors.entidad = "No se pudieron cargar las entidades";
        setErrores(newErrors);
        console.log(e);
      }
    }
    cargarCategorias();
    cargarEntidad();
  }, []);

  const validarCampos = () => {
    const newErrors = {};
    if (!categoriaSeleccionada) {
      newErrors.categoria = "Debe seleccionar una categoría";
    }
    if (!entidadSeleccionada) {
      newErrors.entidad = "Debe seleccionar una entidad";
    }
    if (!nombreEvento.trim()) {
      newErrors.nombre = "El nombre del evento es obligatorio";
    }
    if (!ubicacionEvento.trim()) {
      newErrors.ubicacion = "La ubicación del evento es obligatorio";
    }
    setErrores(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Contenedor style={{ paddingTop: Platform.OS === "ios" ? 0 : 50, flex: 1 }}>
      <StatusBar style="auto" />
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={{ flex: 1, zIndex: 2, position: "relative" }}>
            <Text
              style={{ fontSize: 30, marginBottom: 10, fontWeight: "bold" }}
            >
              Crear nuevo evento
            </Text>

            {/* Nombre */}
            <Text
              style={{ fontSize: 20, marginVertical: 10, fontWeight: "500" }}
            >
              Nombre del evento
            </Text>
            <TextInput
              placeholder="Escribe el nombre del evento"
              placeholderTextColor="#999999"
              style={[
                {
                  borderWidth: 1,
                  padding: 12,
                  borderRadius: 8,
                  height: 43,
                },
                errores.nombre
                  ? { borderColor: "red" }
                  : { borderColor: "#d1d5dc" },
              ]}
              value={nombreEvento}
              onChangeText={(text) => setNombreEvento(pedirTexto(text))}
            />
            {errores.nombre && (
              <Text style={{ color: "red" }}>{errores.nombre}</Text>
            )}

            {/* Descripción */}
            <Text
              style={{ fontSize: 20, marginVertical: 10, fontWeight: "500" }}
            >
              Descripción
            </Text>
            <TextInput
              placeholder="Escriba una descripción del evento"
              placeholderTextColor="#999999"
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
              style={{
                borderWidth: 1,
                padding: 12,
                borderRadius: 8,
                height: 72,
                borderColor: "#d1d5dc",
              }}
              value={descripcionEvento}
              onChangeText={(text) => setDescripcionEvento(text)}
            />

            {/* Categoría */}
            <Text
              style={{ fontSize: 20, marginVertical: 10, fontWeight: "500" }}
            >
              Categoría
            </Text>
            <DropDownPicker
              open={openCategoria}
              value={categoriaSeleccionada}
              items={itemsCategoria}
              setOpen={setOpenCategoria}
              setValue={setCategoriaSeleccionada}
              setItems={setItemsCategoria}
              placeholder="Seleccione una categoría"
              textStyle={{ fontSize: 18 }}
              style={[
                {
                  height: 50,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                },
                errores.categoria
                  ? { borderColor: "red" }
                  : { borderColor: "#d1d5dc" },
              ]}
              dropDownContainerStyle={{
                borderColor: "#d1d5dc",
              }}
              zIndex={3000}
              zIndexInverse={1000}
              elevation={3000}
            />
            {errores.categoria && (
              <Text style={{ color: "red" }}>{errores.categoria}</Text>
            )}

            {/* Entidad */}
            <Text
              style={{ fontSize: 20, marginVertical: 10, fontWeight: "500" }}
            >
              Entidad
            </Text>
            <DropDownPicker
              open={openEntidad}
              value={entidadSeleccionada}
              items={itemsEntidades}
              setOpen={setOpenEntidad}
              setValue={setEntidadSeleccionada}
              setItems={setItemsEntidades}
              placeholder="Seleccione una Entidad"
              textStyle={{ fontSize: 18 }}
              style={[
                {
                  height: 50,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                },
                errores.entidad
                  ? { borderColor: "red" }
                  : { borderColor: "#d1d5dc" },
              ]}
              dropDownContainerStyle={{
                borderColor: "#d1d5dc",
              }}
              zIndex={2000}
              zIndexInverse={1000}
              elevation={2000}
            />
            {errores.entidad && (
              <Text style={{ color: "red" }}>{errores.entidad}</Text>
            )}

            {/* Ubicación */}
            <Text
              style={{ fontSize: 20, marginVertical: 10, fontWeight: "500" }}
            >
              Ubicación
            </Text>
            <TextInput
              placeholder="Escribe la ubicación del evento"
              placeholderTextColor="#999999"
              style={[
                {
                  borderWidth: 1,
                  padding: 12,
                  borderRadius: 8,
                  height: 43,
                },
                errores.ubicacion
                  ? { borderColor: "red" }
                  : { borderColor: "#d1d5dc" },
              ]}
              value={ubicacionEvento}
              onChangeText={(text) => setUbicacionEvento(pedirTexto(text))}
            />
            {errores.ubicacion && (
              <Text style={{ color: "red" }}>{errores.ubicacion}</Text>
            )}
          </View>

          {/* boton */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 50,
              zIndex: 1,
              position: "relative",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (validarCampos()) {
                  navigation.navigate("CrearEvento2", {
                    id_categoria: categoriaSeleccionada,
                    id_entidad: entidadSeleccionada,
                    id_creador: user?.id,
                    nombre: nombreEvento,
                    desc: descripcionEvento,
                    ubi: ubicacionEvento,
                  });
                }
              }}
              style={{
                backgroundColor: "#5099f8",
                paddingVertical: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Siguiente
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Contenedor>
  );
}
const Contenedor = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffffff;
`;

const styles = StyleSheet.create({
  container: {
    flex: 9,
    padding: 25,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DC",
    borderRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    marginBottom: 10,
  },
});
