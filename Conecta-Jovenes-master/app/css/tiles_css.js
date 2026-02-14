import { StyleSheet } from 'react-native';

export const tile_css = StyleSheet.create({
    contenedor: {
        width: '100%',             
        flexDirection: 'row',
        backgroundColor: '#5099F8',
        borderRadius: 25,          
        // --- AQUÍ ESTÁ EL TRUCO PARA QUE SEAN MÁS GORDOS ---
        paddingVertical: 40,       // Aumentamos mucho la altura interna
        paddingHorizontal: 15,     // Bajamos el espacio lateral para que el texto ocupe más
        // --------------------------------------------------
        alignItems: 'center',
        marginVertical: 5,         // Espacio entre botones
        elevation: 4,              // Sombra en Android
        shadowColor: '#000',       // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    contendorTexto: {
        flex: 1,
        marginLeft: 20,            
    },
    icono: {
        width: 55,                 // Icono más grande para que el botón no se vea vacío
        height: 55,
        tintColor: '#FFFFFF',
    },
    texto_titulo: {
        fontSize: 24,              // Letra más grande
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    texto: {
        fontSize: 15,
        color: '#FFFFFF',
        opacity: 0.9,
        marginTop: 4,
    }
});

export const tileExtra_css = StyleSheet.create({
    contenedor: {
        width: '48%',              // Para que los de abajo sigan siendo finos y quepan dos
        aspectRatio: 1.2,          
        backgroundColor: '#5099F8',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    icono: {
        width: 35,
        height: 35,
        tintColor: '#FFFFFF',
    },
    texto_titulo: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 5,
    }
});