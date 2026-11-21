import { apiUsuarios } from "./api";

const authService = {

    iniciarSesion: async (correo, password) => {
        const respuesta = await apiUsuarios.post("/auth/login", {
            correo,
            password
        });

        return respuesta.data;
    },

    registrar: async (datos) => {
        const respuesta = await apiUsuarios.post(
            "/auth/registro",
            datos
        );

        return respuesta.data;
    },

    obtenerPerfil: async () => {
        const respuesta = await apiUsuarios.get("/auth/me");

        return respuesta.data;
    },

    renovarToken: async (refreshToken) => {
        const respuesta = await apiUsuarios.post("/auth/refresh", {
            refreshToken
        });

        return respuesta.data;
    }

};

export default authService;
