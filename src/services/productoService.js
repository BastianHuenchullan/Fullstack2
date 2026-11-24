import { apiProductos } from './api';

const productoService = {
    listar: async (params = {}) => {
        const respuesta = await apiProductos.get('/productos', { params });
        return respuesta.data;
    },

    obtener: async (id) => {
        const respuesta = await apiProductos.get(`/productos/${id}`);
        return respuesta.data;
    },

    crear: async (datos) => {
        const respuesta = await apiProductos.post('/productos', datos);
        return respuesta.data;
    },

    actualizar: async (id, datos) => {
        const respuesta = await apiProductos.put(`/productos/${id}`, datos);
        return respuesta.data;
    },

    eliminar: async (id) => {
        await apiProductos.delete(`/productos/${id}`);
    },

    listarCategorias: async () => {
        const respuesta = await apiProductos.get('/categorias');
        return respuesta.data;
    }
};

export default productoService;