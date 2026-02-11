import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

// REVISA AQUÍ: Si el archivo real empieza con Mayúscula, cámbialo (ej: ./clases/AyudaPass)
import OlvidePass from "./iniciar-sesion/ayudaPass";
import HomeScreen from "./iniciar-sesion/homeScreen";
import LoginScreen from "./iniciar-sesion/index"; // ¿Seguro que el login es 'index'?
import MisEventos from "./iniciar-sesion/misEventos";
import NuevaPass from "./iniciar-sesion/nuevaPass";
import PerfilScreen from "./iniciar-sesion/perfil";
import RegistroScreen from "./iniciar-sesion/registroUser1";
import Registro2Screen from "./iniciar-sesion/registroUser2";
import SplashScreen from "./iniciar-sesion/splashScreen";
import VerificacionEmail from "./iniciar-sesion/verificacionEmail";
import VerificacionTelefono from "./iniciar-sesion/verificacionTelefono";

import AuthContext from "./contexts/authContext";
import { loadUser } from "./services/authService";

const Stack = createNativeStackNavigator();

export default function Layout() {
    const [user, setUser] = useState();
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        async function runEffect() {
            try {
                const user = await loadUser();
                setUser(user);
            } catch (e) {
                console.log("No se pudo cargar el usuario", e);
            }
            setStatus("inactivo");
        }
        runEffect();
    }, []);

    if (status === "loading") {
        return <SplashScreen />;
    }

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            <NavigationIndependentTree>
                <NavigationContainer> 
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        {user ? (
                            <Stack.Group>
                                <Stack.Screen name="Home" component={HomeScreen} />
                                <Stack.Screen name="Perfil" component={PerfilScreen} />
                                <Stack.Screen name="MisEventos" component={MisEventos} />
                            </Stack.Group>
                        ) : (
                            <Stack.Group>
                                <Stack.Screen name="Login" component={LoginScreen} />
                                <Stack.Screen name="CrearCuenta" component={RegistroScreen} />
                                <Stack.Screen name="CrearCuenta2" component={Registro2Screen} />
                                <Stack.Screen name="OlvidePass" component={OlvidePass} />
                                <Stack.Screen name="VerificacionEmail" component={VerificacionEmail} />
                                <Stack.Screen name="VerificacionTel" component={VerificacionTelefono} />
                                <Stack.Screen name="NuevaPass" component={NuevaPass} />
                            </Stack.Group>
                        )}
                    </Stack.Navigator>
                </NavigationContainer>
            </NavigationIndependentTree>
        </AuthContext.Provider>
    );
}