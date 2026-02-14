import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AuthContext from "./contexts/authContext";

// Imports de autenticación y carga
import ConfigUser from "./clases/configuracion/configuracion";
import EditInfCuenta from "./clases/configuracion/editarInfCuenta";
import EditInfPersonal from "./clases/configuracion/editarInfPersonal";
import InfoCuenta from "./clases/configuracion/infoCuenta";
import LoginScreen from "./clases/index";
import OlvidePass from "./clases/login/ayudaPass";
import RegistroScreen from "./clases/login/registroUser1";
import Registro2Screen from "./clases/login/registroUser2";
import SplashScreen from "./clases/login/splashScreen";
// Imports de funcionalidades (Corregidos según tu árbol de archivos)
import DetalleEvento from "./clases/eventos/DetalleEvento";
import ModEvento from "./clases/eventos/ModEvento"; // Verifica que la 'M' y 'E' coincidan con el archivo
import CrearEvento1 from "./clases/eventos/crearEvento1";
import CrearEvento2 from "./clases/eventos/crearEvento2";
import LeerEventos from "./clases/eventos/leerEventos";
import MisEventos from "./clases/eventos/misEventos";
import homeScreen from "./clases/main/homeScreen"; // 'h' minúscula para coincidir con el archivo
import PerfilScreen from "./clases/perfil/perfil";

import { loadUser } from "./services/authService";

const Stack = createNativeStackNavigator();

export default function Layout() {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        async function runEffect() {
            try {
                const loadedUser = await loadUser();
                setUser(loadedUser);
            } catch (e) {
                console.log("Error al cargar usuario:", e);
            } finally {
                setStatus("inactivo");
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
                        <Stack.Screen name="Home" component={homeScreen} />
                        <Stack.Screen name="Perfil" component={PerfilScreen} />
                        <Stack.Screen name="MisEventos" component={MisEventos} />
                        <Stack.Screen name="LeerEventos" component={LeerEventos} />                            
                        <Stack.Screen name="DetalleEvento" component={DetalleEvento} />
                        <Stack.Screen name="ModEvento" component={ModEvento} />
                        <Stack.Screen name="CrearEvento" component={CrearEvento1} /> 
                        <Stack.Screen name="CrearEvento2" component={CrearEvento2} />
                        <Stack.Screen name="Configuracion" component={ConfigUser}/>
                        <Stack.Screen name="InformacionCuenta" component={InfoCuenta}/>
                        <Stack.Screen name="EditarInformacionCuenta" component={EditInfCuenta}/>
                        <Stack.Screen name="EditarInformacionPersonal" component={EditInfPersonal}/>
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