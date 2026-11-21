import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const { iniciarSesion, autenticado, cargando } = useAuth();

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if (!cargando && autenticado) {
            navigate('/', { replace: true });
        }
    }, [autenticado, cargando, navigate]);

    const manejarOlvido = () => {
        alert('La recuperación de contraseña todavía no está disponible.');
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEnviando(true);

        try {
            await iniciarSesion(correo.trim(), contrasena);

        } catch (error) {
            setError(
                error.response?.data?.mensaje ||
                'No se pudo iniciar sesión. Inténtalo nuevamente.'
            );

        } finally {
            setEnviando(false);
        }
    };

    return (
        <main
            className="main_general"
            style={{
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            <h2 className="titulo_seccion">
                Inicio de sesión
            </h2>

            <div
                className="caja_formularios"
                style={{
                    maxWidth: '500px',
                    flexDirection: 'column',
                    gap: '20px'
                }}
            >
                <form
                    id="login_formulario"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        width: '100%'
                    }}
                    onSubmit={manejarSubmit}
                >
                    {error && (
                        <div
                            role="alert"
                            style={{
                                backgroundColor: '#f8d7da',
                                color: '#842029',
                                padding: '12px',
                                borderRadius: '5px'
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="correo"
                            className="etiqueta_formulario"
                        >
                            Correo electrónico:
                        </label>

                        <input
                            id="correo"
                            type="email"
                            className="input_formulario"
                            required
                            autoComplete="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="contrasena"
                            className="etiqueta_formulario"
                        >
                            Contraseña:
                        </label>

                        <input
                            id="contrasena"
                            type="password"
                            className="input_formulario"
                            required
                            autoComplete="current-password"
                            value={contrasena}
                            onChange={(e) =>
                                setContrasena(e.target.value)
                            }
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            marginTop: '15px'
                        }}
                    >
                        <button
                            type="button"
                            className="enlace_secundario"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                            onClick={manejarOlvido}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>

                        <button
                            type="submit"
                            className="btn_principal"
                            disabled={enviando || cargando}
                        >
                            {enviando
                                ? 'Iniciando sesión...'
                                : 'Iniciar sesión'}
                        </button>
                    </div>

                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '20px'
                        }}
                    >
                        <span style={{ fontSize: '14px' }}>
                            ¿Aún no te has registrado?{' '}
                        </span>

                        <Link
                            to="/registro"
                            className="enlace_secundario"
                        >
                            Regístrate aquí
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default Login;
