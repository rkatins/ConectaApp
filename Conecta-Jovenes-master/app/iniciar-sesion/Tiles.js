import { Image, Pressable, Text, View } from 'react-native';

import { tile_css, tileExtra_css } from '../css/tiles_css';

export function Tile({onPress, icono, titulo, desc}) {
    return (
        <Pressable style={tile_css.contenedor}
            onPress={onPress}
        >
            <View style={tile_css.contenedoIcono}>
                <Image style={tile_css.icono}
                    source={icono}
                />
            </View>
            <View style={tile_css.contendorTexto}>
                <Text style={tile_css.texto_titulo}>{titulo}</Text>
                <Text style={tile_css.texto}>{desc}</Text>
            </View>
        </Pressable>
    )
}

export function TileExtra({onPress, icono, titulo}) {
    return (
        <Pressable style={tileExtra_css.contenedor}
            onPress={onPress}
        >
            <View style={tileExtra_css.contenedoIcono}>
                <Image style={tileExtra_css.icono}
                    source={icono}
                />
            </View>
            <View style={tileExtra_css.contendorTexto}>
                <Text style={tileExtra_css.texto_titulo}>{titulo}</Text>
            </View>
        </Pressable>
    )
}
