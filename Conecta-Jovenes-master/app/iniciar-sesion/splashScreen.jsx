import { Platform } from "react-native";
import styled from "styled-components/native";



export default function LoadingScreen() {
    return (
        <Container style={{ paddingTop: Platform.OS === "ios" ? 0 : 50 }}>
            <Texto>Cargando...</Texto>
        </Container>
    );
}

const Container = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #333;
`;



const Texto = styled.Text`
    font-size: 18px;
    color: #333;
`;