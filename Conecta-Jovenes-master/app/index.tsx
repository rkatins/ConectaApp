import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AuthContext from "./contexts/authContext";

// --- IMPORTANTE: Verifica que los nombres de archivos coincidan con estos ---
// --- IMPORTANTE: Nombres corregidos a minúsculas para coincidir con tus archivos ---
import OlvidePass from "./iniciar-sesion/ayudaPass";
import CrearEvento1 from "./iniciar-sesion/crearEvento1";
import CrearEvento2 from "./iniciar-sesion/crearEvento2";
import DetalleEvento from "./iniciar-sesion/DetalleEvento";
import HomeScreen from "./iniciar-sesion/homeScreen";
// ... resto de imports;
import LoginScreen from "./iniciar-sesion/index";
import LeerEventos from "./iniciar-sesion/leerEventos";
import MisEventos from "./iniciar-sesion/misEventos";
import PerfilScreen from "./iniciar-sesion/perfil";
import RegistroScreen from "./iniciar-sesion/registroUser1";
import Registro2Screen from "./iniciar-sesion/registroUser2";
import SplashScreen from "./iniciar-sesion/splashScreen";
import { loadUser } from "./services/authService";

const Stack = createNativeStackNavigator();

export default function Layout() {
    const [user, setUser] = useState(null); // Cambiado a null por defecto
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        async function runEffect() {
            try {
                const loadedUser = await loadUser();
                setUser(loadedUser);
            } catch (e) {
                console.log("Error de usuario al cargar:", e);
            } finally {
                setStatus("inactivo"); // Usamos finally para asegurar que deje de cargar
            }
        }
        runEffect();
    }, []);

    if (status === "loading") return <SplashScreen />;

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Group>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Perfil" component={PerfilScreen} />
                        <Stack.Screen name="MisEventos" component={MisEventos} />
                        <Stack.Screen name="LeerEventos" component={LeerEventos} />                            
                        <Stack.Screen name="DetalleEvento" component={DetalleEvento} />
                        {/* Asegúrate de usar CrearEvento1 aquí si así se llama el componente exportado */}
                        <Stack.Screen name="CrearEvento" component={CrearEvento1} /> 
                        <Stack.Screen name="CrearEvento2" component={CrearEvento2} />
                    </Stack.Group>
                ) : (
                    <Stack.Group>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="CrearCuenta" component={RegistroScreen} />
                        <Stack.Screen name="CrearCuenta2" component={Registro2Screen} />
                        <Stack.Screen name="OlvidePass" component={OlvidePass} />
                    </Stack.Group>
                )}
            </Stack.Navigator>
        </AuthContext.Provider>
    );
}