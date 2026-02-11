import { StyleSheet } from 'react-native';

export const profileBanner_css = StyleSheet.create({
    contenedor: {
        flexDirection: 'row',   
        justifyContent: 'space-between', 
        alignItems: 'center',        
        width: '100%',              
        paddingVertical: 15,
        paddingHorizontal: 2,
        borderBottomColor: "#4A90E2", 
        borderBottomWidth: 1,
    },
    contendorTexto: {
        flexDirection: 'column',
    },
    welcome: {
        fontSize: 16,
        color: '#A0A0A0',            
    },
    welcomeNombre: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
    contenedoAvatar: {
        borderWidth: 2,
        borderColor: '#4A90E2',     
        borderRadius: 40,
        padding: 3,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,          
    }
});