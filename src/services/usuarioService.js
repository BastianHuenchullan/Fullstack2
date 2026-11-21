import { apiUsuarios } from "./api";

const usuarioService = {

    listar: async () => {
        const respuesta = await apiUsuarios.get("/usuarios");

        return respuesta.data;
    },

    obtener: async (id) => {
        const respuesta = await apiUsuarios.get(`/usuarios/${id}`);

        return respuesta.data;
    },

    crear: async (datos) => {
        const respuesta = await apiUsuarios.post("/usuarios", datos);

        return respuesta.data;
    },

    actualizar: async (id, datos) => {
        const respuesta = await apiUsuarios.put(
            `/usuarios/${id}`,
            datos
        );

        return respuesta.data;
    },

    eliminar: async (id) => {
        await apiUsuarios.delete(`/usuarios/${id}`);
    }

};

export default usuarioService;
