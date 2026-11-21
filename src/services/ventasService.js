const API_VENTAS_URL = 'http://localhost:8083/api/v1';

// Busca el JWT sin importar si tu compañero lo guarda suelto o dentro de usuario_actual
const obtenerToken = () => {
    const tokenDirecto = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (tokenDirecto) return tokenDirecto;

    try {
        const usuario = JSON.parse(localStorage.getItem('usuario_actual'));
        return usuario?.token || usuario?.accessToken || null;
    } catch {
        return null;
    }
};

const construirHeaders = () => {
    const headers = {
        'Content-Type': 'application/json'
    };
    const token = obtenerToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const manejarRespuesta = async (response) => {
    if (!response.ok) {
        let mensajeError = `Error ${response.status} al comunicarse con el servicio de ventas.`;
        try {
            const errorData = await response.json();
            mensajeError = errorData.mensaje || errorData.message || errorData.error || mensajeError;
        } catch {
            // Si el backend no devuelve JSON, mantenemos el mensaje por defecto
        }
        throw new Error(mensajeError);
    }
    return response.json();
};

export const crearBoleta = async (datosCompra) => {
    const response = await fetch(`${API_VENTAS_URL}/boletas`, {
        method: 'POST',
        headers: construirHeaders(),
        body: JSON.stringify(datosCompra)
    });
    return manejarRespuesta(response);
};

export const obtenerMisBoletas = async () => {
    const response = await fetch(`${API_VENTAS_URL}/boletas/mis-boletas`, {
        method: 'GET',
        headers: construirHeaders()
    });
    return manejarRespuesta(response);
};

export const listarTodasLasBoletas = async () => {
    const response = await fetch(`${API_VENTAS_URL}/boletas`, {
        method: 'GET',
        headers: construirHeaders()
    });
    return manejarRespuesta(response);
};

export const cambiarEstadoBoleta = async (id, estado) => {
    const response = await fetch(`${API_VENTAS_URL}/boletas/${id}/estado`, {
        method: 'PATCH',
        headers: construirHeaders(),
        body: JSON.stringify({ estado })
    });
    return manejarRespuesta(response);
};

export const obtenerReporteResumen = async () => {
    const response = await fetch(`${API_VENTAS_URL}/reportes/resumen`, {
        method: 'GET',
        headers: construirHeaders()
    });
    return manejarRespuesta(response);
};