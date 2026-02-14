import { useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { profileBanner_css } from "../../css/profileBanner_css";

export function ProfileBanner({ nombre, url_avatar }) {
    const navigation = useNavigation(); 

    return (
        <View style={profileBanner_css.contenedor}>
            <View style={profileBanner_css.contendorTexto}>
                <Text style={profileBanner_css.welcome}>Bienvenido,</Text>
                <Text style={profileBanner_css.welcomeNombre}>{nombre}</Text>
            </View>

            <TouchableOpacity 
                style={profileBanner_css.contenedoAvatar}
                onPress={() => navigation.navigate('Perfil')}
                activeOpacity={0.7} 
            >
                <Image 
                    style={profileBanner_css.avatar}
                    source={{ uri: url_avatar }}
                />
            </TouchableOpacity>
        </View>
    );
}