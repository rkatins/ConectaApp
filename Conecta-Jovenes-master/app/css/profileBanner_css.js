import { StyleSheet } from 'react-native';

export const profileBanner_css = StyleSheet.create({
    contenedor: {
        flexDirection: 'row',   
        justifyContent: 'space-between', 
        alignItems: 'center',        
        width: '100%',              
        // --- CAMBIOS PARA SUBIR EL BANNER ---
        paddingTop: 0,              // Quitamos el espacio de arriba
        paddingBottom: 8,           // Espacio mínimo para la línea azul
        marginTop: -10,             // Forzamos la subida hacia el notch/barra de estado
        // ------------------------------------
        paddingHorizontal: 2,
        borderBottomColor: "#4A90E2", 
        borderBottomWidth: 1,
    },
    contendorTexto: {
        flexDirection: 'column',
    },
    welcome: {
        fontSize: 14,               // Reducido un poco para ganar espacio
        color: '#A0A0A0',
        marginBottom: -4,           // Pegamos más el texto al nombre
    },
    welcomeNombre: {
        fontSize: 24,               // Reducido de 26 a 24
        fontWeight: 'bold',
        color: '#333',
    },
    contenedoAvatar: {
        borderWidth: 2,
        borderColor: '#4A90E2',     
        borderRadius: 35,           // Ajustado al nuevo tamaño
        padding: 2,
    },
    avatar: {
        width: 50,                  // Reducido de 60 a 50 para que el banner sea más delgado
        height: 50,
        borderRadius: 25,          
    }
});