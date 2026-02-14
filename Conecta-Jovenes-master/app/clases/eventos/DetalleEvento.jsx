import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function DetalleEvento({ route, navigation }) {
    // Simulamos los datos que vendrían por 'route.params' o de un estado
    const { evento, userIdActual } = route.params || {};

    // Función auxiliar para formatear fechas
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const d = new Date(fecha);
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    };

    return (
        <View style={styles.container}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {/* Cabecera con Imagen */}
                <ImageBackground 
                    source={{ uri: `https://hackathon.lausnchez.es/storage/${evento?.foto_evento}` }} 
                    style={styles.imageHeader}
                    backgroundColor="#F2F2F2" 
                >
                    <SafeAreaView>
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()} 
                            style={styles.backButton}
                        >
                            <Ionicons name="chevron-back" size={24} color="black" />
                        </TouchableOpacity>
                    </SafeAreaView>
                </ImageBackground>

                {/* Contenido Principal */}
                <View style={styles.contentCard}>
                    {/* FILA DE BADGES */}
                    <View style={styles.badgesRow}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>
                                {evento?.categoria?.nombre || 'Categoría'}
                            </Text>
                        </View>
                        
                        {evento?.es_accesible && (
                            <View style={styles.accessibleBadge}>
                                <Ionicons name="body" size={14} color="#4CAF50" />
                                <Text style={styles.accessibleBadgeText}>Accesible</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.title}>{evento?.nombre}</Text>
                    
                    <View style={styles.row}>
                        <Ionicons name="star" size={18} color="#FFD700" />
                        <Text style={styles.ratingText}>
                            {evento?.valoracion || '5.0'} • {evento?.entidad?.nombre || 'Organizador'}
                        </Text>
                    </View>

                    {/* Sección de Información Rápida */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoItem}>
                            <View style={[styles.iconBox, { backgroundColor: '#E6F4FE' }]}>
                                <Ionicons name="calendar" size={20} color="#5099F8" />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Fecha</Text>
                                <Text style={styles.infoValue}>
                                    {formatearFecha(evento?.fecha_inicio_evento)} - {formatearFecha(evento?.fecha_final_evento)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <View style={[styles.iconBox, { backgroundColor: '#F0F9F0' }]}>
                                <Ionicons name="location" size={20} color="#4CAF50" />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Ubicación</Text>
                                <Text style={styles.infoValue}>{evento?.ubicacion}</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <View style={[styles.iconBox, { backgroundColor: '#FFF9E6' }]}>
                                <Ionicons name="people" size={20} color="#FFA000" />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Participantes</Text>
                                <Text style={styles.infoValue}>{evento?.num_participantes} personas</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Sobre el evento</Text>
                    <Text style={styles.description}>{evento?.descripcion}</Text>
                    
                    {/* Espaciado para que el botón no tape el final del texto */}
                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            {/* Botón Inferior Fijo */}
            {evento?.creador?.id !== userIdActual && (
                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.joinButton}
                        activeOpacity={0.8}
                        onPress={() => console.log('Unirse presionado')}
                    >
                        <Text style={styles.joinButtonText}>Unirse al evento</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: 'white' 
    },
    imageHeader: { 
        width: width, 
        height: 250 
    },
    backButton: { 
        marginLeft: 15, 
        marginTop: 10, 
        backgroundColor: 'white', 
        width: 36, 
        height: 36, 
        borderRadius: 18, 
        justifyContent: 'center', 
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5
    },
    contentCard: { 
        flex: 1, 
        backgroundColor: 'white', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        marginTop: -35, 
        paddingHorizontal: 20,
        paddingTop: 25 
    },
    badgesRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 12 
    },
    categoryBadge: { 
        backgroundColor: '#E6F4FE', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 10, 
        marginRight: 10 
    },
    categoryText: { 
        color: '#5099F8', 
        fontWeight: '700', 
        fontSize: 12,
        textTransform: 'uppercase'
    },
    accessibleBadge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F0F9F0', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 10 
    },
    accessibleBadgeText: { 
        color: '#4CAF50', 
        marginLeft: 5, 
        fontWeight: '700', 
        fontSize: 12 
    },
    title: { 
        fontSize: 26, 
        fontWeight: 'bold', 
        color: '#1A1A1A', 
        marginBottom: 8 
    },
    row: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 25 
    },
    ratingText: { 
        marginLeft: 6, 
        color: '#777', 
        fontSize: 14,
        fontWeight: '500'
    },
    infoSection: { 
        backgroundColor: '#F8F9FA', 
        borderRadius: 20, 
        padding: 18, 
        marginBottom: 25 
    },
    infoItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 15 
    },
    iconBox: { 
        width: 44, 
        height: 44, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 15 
    },
    infoLabel: { 
        fontSize: 12, 
        color: '#8e8e93', 
        marginBottom: 2 
    },
    infoValue: { 
        fontSize: 14, 
        fontWeight: '600', 
        color: '#1c1c1e' 
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#1A1A1A', 
        marginBottom: 10 
    },
    description: { 
        fontSize: 15, 
        lineHeight: 24, 
        color: '#444' 
    },
    footer: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: 20, 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Sutil transparencia
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0'
    },
    joinButton: { 
        backgroundColor: '#5099F8', 
        paddingVertical: 16, 
        borderRadius: 16, 
        alignItems: 'center',
        shadowColor: "#5099F8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6
    },
    joinButtonText: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold' 
    }
});