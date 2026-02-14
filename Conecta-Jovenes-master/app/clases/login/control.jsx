
export function pedirCodigo(SETCODE) {
    return (text) => {
        const soloNum=text.replace(/\s/g, '')
        .replace(/[^0-9]/g, '');
        SETCODE(soloNum);
    }
}

export function pedirTelefono(SETCODE) {
    return (text) => {
        const soloNum=text.replace(/\s/g, '')  
        .replace(/[^0-9+]/g, '');
        SETCODE(soloNum);
    }
}

//Borrador
export function pedirTexto() {
    return (text) => {
        const soloTexto=text.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        return soloTexto;
    }
}

export function nombreUsuario(text){
    const soloTexto=text.replace(/[^a-zA-Z0-9_]/g, '');
    return soloTexto;
}

export function esNOmbreOApellidoValido(text) {
    const soloTexto=text.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    return soloTexto;
}

//Borrador
export function contraseniaDebil(text) {
    if (text.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres.";
    } else {
        return "";
    }
}