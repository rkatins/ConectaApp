import { useEffect, useState } from "react";
import styled from "styled-components/native";
import { pedirCodigo } from './control';

//Pantalla con los componentes para introducir el código de verficación.
const VERIFICAREMAIL = ({route, navigation}) => {
    const [NUMERO, SETNUM] = useState(10);//NUMERO los segundos del contador - SETNUM establece el valor del contador. 
    const [INICIO, SETINICIO] = useState(false);
    const [showB, setShowB] = useState(true);
    const { EMAIL } = route.params;
    const [CODE, SETCODE] = useState('');

    useEffect(()=>{
        if(INICIO && NUMERO>0){
            const intervalo = setInterval(() => {
                SETNUM(prevNumero => prevNumero - 1 );
            }, 1000);
            return () => clearInterval(intervalo);
        }
        }, [INICIO, NUMERO]);

        const INICIARCONT = () => {
            SETINICIO(true);
            setShowB(false);
            if (NUMERO == 0) {
                REINICIARCONT();
            }
        };

        const REINICIARCONT = () => { //Reinicia el contador.
            SETNUM(10);
            SETINICIO(false);
            setShowB(true);
        }
        
    return(
        <CONTAINER>
            <TITULO>Introducir el código de verificación</TITULO>
            <TEXTO>Por tu seguridad, te hemos enviado el código a tu correo electrónico {EMAIL}</TEXTO>
            <SUBTITULOCONTRA>Código de seguridad:</SUBTITULOCONTRA>
            <INPUTTEXTO keyboardType="numeric" value={CODE} maxLength={6} onChangeText={pedirCodigo(SETCODE)}/>
            <BUTTONTEXT onPress={INICIARCONT}>Volver a enviar código</BUTTONTEXT>
            {INICIO && NUMERO > 0 ? (
            <STARTBUTTON>
                <SUBTITULO>Espera <CONTADOR>{NUMERO}</CONTADOR> segundos antes de solicitar otro código.</SUBTITULO>
            </STARTBUTTON>) : null}
            <BOTON onPress={()=>{if(CODE.length === 6 && CODE.match(/^[0-9]+$/)){navigation.navigate("NuevaPass")}else{alert('Por favor, introduce un código válido de 6 dígitos.')}}}>
                <BUTTONTEXTO>Enviar codigo</BUTTONTEXTO> 
            </BOTON>
            
        </CONTAINER>
    );
};

export default VERIFICAREMAIL;

//Los estilos de la pantalla.
//Contenedor principal.
const CONTAINER = styled.View`
    flex:1;
    justify-content:center;
    align-items:center;
`

//Texto.
const TEXTO = styled.Text`
    font-size:15px;
    justify-content:center;
    align-items:center;
    text-align:center;
    margin:20px;
    margin-bottom:50px;
`

//Botón de reenvío del código.
const STARTBUTTON = styled.TouchableOpacity`

`

//Texto del botón.
const BUTTONTEXT = styled.Text`
    color:#13B2DE;
    margin-top:20px;
`

//Título.
const TITULO = styled.Text`
    font-size:20px;
    font-weight:bold;
    margin-bottom:50px;
`

//Texto para el reenvío del código.
const SUBTITULO = styled.Text`
    font-size:15px;
    margin-bottom:20px;
    margin-top:20px;
`

//Botón de enviar código.
const BOTON = styled.TouchableOpacity`
    background-color:#F5CB55;
    padding:1px 1px;
    border-radius:10px;
    margin-top:20px;
`

//Introducir el código.
const INPUTTEXTO = styled.TextInput`
    keyboard-type:numeric;
    height:40px;
    border-color:gray;
    border-width:1px;
    width:300px;
    text-align:center;
`

//Texto para el código de seguridad.
const SUBTITULOCONTRA = styled.Text`
    font-size:15px;
    margin-bottom:20px;
    margin-top:20px;
    margin-left:62px;
    align-self:flex-start;
`

//Texto del botón de enviar código.
const BUTTONTEXTO = styled.Text`
    padding:20px 20px;
`

//Contador.
const CONTADOR = styled.Text`
    font-size:15px;
    margin-bottom:20px;
    margin-top:20px;
`