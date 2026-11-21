import axios from "axios";

const apiUsuarios = axios.create({
    baseURL: "http://localhost:8081/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});

const apiProductos = axios.create({
    baseURL: "http://localhost:8082/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});

const apiVentas = axios.create({
    baseURL: "http://localhost:8083/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});

let renovacionPendiente = null;

const esRutaPublica = (config) => {
    return [
        "/auth/login",
        "/auth/registro",
        "/auth/refresh"
    ].includes(config.url);
};

const cerrarSesion = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");

    window.dispatchEvent(new Event("sesion-expirada"));
};

const renovarToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        throw new Error("No existe un token de renovación");
    }

    const respuesta = await axios.post(
        "http://localhost:8081/api/v1/auth/refresh",
        { refreshToken }
    );

    const { accessToken, refreshToken: nuevoRefreshToken } = respuesta.data;

    if (localStorage.getItem("refreshToken") !== refreshToken) {
        throw new Error("La sesión ha cambiado");
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", nuevoRefreshToken);

    return accessToken;
};

const configurarInterceptores = (api) => {

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("accessToken");

            if (token && !esRutaPublica(config)) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (respuesta) => respuesta,

        async (error) => {
            const solicitudOriginal = error.config;

            if (
                !solicitudOriginal ||
                error.response?.status !== 401 ||
                solicitudOriginal._retry ||
                esRutaPublica(solicitudOriginal)
            ) {
                return Promise.reject(error);
            }

            solicitudOriginal._retry = true;

            try {
                if (!renovacionPendiente) {
                    renovacionPendiente = renovarToken()
                        .finally(() => {
                            renovacionPendiente = null;
                        });
                }

                const accessToken = await renovacionPendiente;

                solicitudOriginal.headers.Authorization =
                    `Bearer ${accessToken}`;

                return api(solicitudOriginal);

            } catch (errorRenovacion) {
                cerrarSesion();
                return Promise.reject(errorRenovacion);
            }
        }
    );
};

configurarInterceptores(apiUsuarios);
configurarInterceptores(apiProductos);
configurarInterceptores(apiVentas);

export { apiUsuarios, apiProductos, apiVentas };
