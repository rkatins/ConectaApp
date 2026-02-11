import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AuthContext from "./contexts/authContext";
import OlvidePass from "./iniciar-sesion/ayudaPass";
import DetalleEvento from "./iniciar-sesion/DetalleEvento";
import HomeScreen from "./iniciar-sesion/homeScreen";
import LoginScreen from "./iniciar-sesion/index";
import LeerEventos from "./iniciar-sesion/leerEventos";
import MisEventos from "./iniciar-sesion/misEventos";
import NuevaPass from "./iniciar-sesion/nuevaPass";
import PerfilScreen from "./iniciar-sesion/perfil";
import RegistroScreen from "./iniciar-sesion/registroUser1";
import Registro2Screen from "./iniciar-sesion/registroUser2";
import SplashScreen from "./iniciar-sesion/splashScreen";
import VerificacionEmail from "./iniciar-sesion/verificacionEmail";
import VerificacionTelefono from "./iniciar-sesion/verificacionTelefono";
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
            {/* 2. HE QUITADO EL NavigationContainer DE AQUÍ */}
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Group>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Perfil" component={PerfilScreen} />
                        <Stack.Screen name="MisEventos" component={MisEventos} />
                        <Stack.Screen name="LeerEventos" component={LeerEventos} />                            
                        <Stack.Screen name="DetalleEvento" component={DetalleEvento} />
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
        </AuthContext.Provider>
    );
}