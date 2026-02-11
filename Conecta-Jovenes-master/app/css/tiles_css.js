import { StyleSheet } from 'react-native';

export const tile_css = StyleSheet.create({
    contenedor: {
        width: '100%',             
        flexDirection: 'row',
        backgroundColor: '#5099F8',
        borderRadius: 20,          
        paddingVertical: 32,       // <--- Mantenemos esto alto para que resalten
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    contendorTexto: {
        flex: 1,
        marginLeft: 15,
    },
    icono: {
        width: 40,
        height: 40,
        tintColor: '#FFFFFF',
    },
    texto_titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    texto: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
    }
});

export const tileExtra_css = StyleSheet.create({
    contenedor: {
        flex: 0.45,                // <--- Bajamos de 1 a 0.45 para que sean más estrechos
        aspectRatio: 1.1,          // <--- Un poco más bajos que anchos para que no ocupen tanto vertical
        backgroundColor: '#5099F8',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    icono: {
        width: 35,                 // Icono un poco más pequeño
        height: 35,
        tintColor: '#FFFFFF',
    },
    texto_titulo: {
        fontSize: 15,              // Texto más pequeño para que quepa bien
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 5,
    }
});