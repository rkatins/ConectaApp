import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { getToken } from "../../services/tokenService";

// `npx expo install react-native-safe-area-context` o `npm install react-native-safe-area-context` si no se esta trabajando con expo
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function DetalleAmigo({ navigation, idUsuario }) {
	const insets = useSafeAreaInsets()

	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const cargarUsuario = async () => {
			setLoading(true)
			try {
				const ENDPOINT = 'https://hackathon.lausnchez.es/api/v1/user/' + idUsuario
				const activeToken = await getToken()

				const response = await fetch(ENDPOINT, {
					headers: {
						'Authorization': 'Bearer ' + activeToken,
						'Accept': 'application/json'
					}
				})

				if (response.ok) {
					const data = await response.json()
					setData(data);
				}
			} catch (error) {
				console.error("Error al obtener usuario:", error)
			} finally {
        setLoading(false)
      }
		}

		if (idUsuario) cargarUsuario()

  }, []);
	
	if (loading) return <ActivityIndicator style={{ marginTop: insets.top + 50 }} size="large" color="#5099F8" />
	if (!data) return <Text style={{paddingTop: insets.top}}>Usuario no encontrado</Text>

	return (
		<View style={[{ paddingTop: insets.top }, { paddingTop: insets.top }]}>
			<Pressable
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [
          styles.backButton,
          { opacity: pressed ? 0.5 : 1, padding: 10 }
        ]}
      >
			<Ionicons name="chevron-back" size={30} color="black" />
			</Pressable>

			<View style={styles.card}>
				{/* <Image
					source={{ uri: data.avatar || 'https://vanwinefest.ca/wp-content/uploads/bfi_thumb/profile-default-male-nyg4vc4i3m1d5pote7rfsv4o4c7p5ka5an0pselxcc.png' }}
					style={styles.avatarImage}
				/> */}
				<Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          {data.nombre} {data.apellido}
        </Text>
        <Text>{data.email}</Text>
			</View>
		</View>
	)
}

export default function ExplorarAmigosView({ navigation, route }) {
	const { idUsuario } = route.params || {}

	return (
		<SafeAreaView>
			<DetalleAmigo navigation={navigation} idUsuario={idUsuario} />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
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
		elevation: 5,
	},
	avatarImage: {
		width: '100%',
		height: '100%',
	},
	card: {
		backgroundColor: '#5099F8',
		flex: 1,
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
		paddingTop: 80,
		paddingHorizontal: 25,
		paddingBottom: 40,
		alignItems: 'center',
		minHeight: 700
	},
});