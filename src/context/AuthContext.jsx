import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

const limpiarSesion = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
};

export const AuthProvider = ({ children }) => {

    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {

        let activo = true;

        const recuperarSesion = async () => {

            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (!accessToken && !refreshToken) {
                limpiarSesion();
                setCargando(false);
                return;
            }

            try {
                const perfil = await authService.obtenerPerfil();

                if (activo) {
                    setUsuario(perfil);

                    localStorage.setItem(
                        "usuario",
                        JSON.stringify(perfil)
                    );
                }

            } catch (error) {

                if (activo) {
                    limpiarSesion();
                    setUsuario(null);
                }

            } finally {

                if (activo) {
                    setCargando(false);
                }
            }
        };

        const manejarSesionExpirada = () => {
            limpiarSesion();
            setUsuario(null);
            setCargando(false);
        };

        window.addEventListener(
            "sesion-expirada",
            manejarSesionExpirada
        );

        recuperarSesion();

        return () => {
            activo = false;

            window.removeEventListener(
                "sesion-expirada",
                manejarSesionExpirada
            );
        };

    }, []);

    const iniciarSesion = async (correo, password) => {

        const respuesta = await authService.iniciarSesion(
            correo,
            password
        );

        localStorage.setItem(
            "accessToken",
            respuesta.accessToken
        );

        localStorage.setItem(
            "refreshToken",
            respuesta.refreshToken
        );

        localStorage.setItem(
            "usuario",
            JSON.stringify(respuesta.usuario)
        );

        setUsuario(respuesta.usuario);

        return respuesta.usuario;
    };

    const registrar = async (datos) => {
        return await authService.registrar(datos);
    };

    const cerrarSesion = () => {
        limpiarSesion();
        setUsuario(null);
    };

    const tieneRol = (...roles) => {
        return usuario !== null && roles.includes(usuario.rol);
    };

    const valor = {
        usuario,
        cargando,
        autenticado: usuario !== null,
        iniciarSesion,
        registrar,
        cerrarSesion,
        tieneRol
    };

    return (
        <AuthContext.Provider value={valor}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    const contexto = useContext(AuthContext);

    if (!contexto) {
        throw new Error(
            "useAuth debe utilizarse dentro de AuthProvider"
        );
    }

    return contexto;
};
