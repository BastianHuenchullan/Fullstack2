import { apiVentas } from './api';

const extraerMensajeError = (error) => {
    return (
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        error.message ||
        'Error al comunicarse con el servicio de ventas.'
    );
};

export const crearBoleta = async (datosCompra) => {
    try {
        const respuesta = await apiVentas.post('/boletas', datosCompra);
        return respuesta.data;
    } catch (error) {
        throw new Error(extraerMensajeError(error));
    }
};

export const obtenerMisBoletas = async () => {
    try {
        const respuesta = await apiVentas.get('/boletas/mis-boletas');
        return respuesta.data;
    } catch (error) {
        throw new Error(extraerMensajeError(error));
    }
};

export const listarTodasLasBoletas = async () => {
    try {
        const respuesta = await apiVentas.get('/boletas');
        return respuesta.data;
    } catch (error) {
        throw new Error(extraerMensajeError(error));
    }
};

export const cambiarEstadoBoleta = async (id, estado) => {
    try {
        const respuesta = await apiVentas.patch(`/boletas/${id}/estado`, { estado });
        return respuesta.data;
    } catch (error) {
        throw new Error(extraerMensajeError(error));
    }
};

export const obtenerReporteResumen = async () => {
    try {
        const respuesta = await apiVentas.get('/reportes/resumen');
        return respuesta.data;
    } catch (error) {
        throw new Error(extraerMensajeError(error));
    }
};