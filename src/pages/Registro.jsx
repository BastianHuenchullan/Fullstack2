import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Registro() {
    const navigate = useNavigate();
    const { registrar, autenticado, cargando } = useAuth();

    const [run, setRun] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena1, setContrasena1] = useState('');
    const [contrasena2, setContrasena2] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if (!cargando && autenticado) {
            navigate('/', { replace: true });
        }
    }, [autenticado, cargando, navigate]);

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (contrasena1.length < 8) {
            setError(
                'La contraseña debe tener al menos 8 caracteres.'
            );
            return;
        }

        if (new TextEncoder().encode(contrasena1).length > 72) {
            setError('La contraseña no puede superar los 72 bytes.');
            return;
        }

        if (contrasena1 !== contrasena2) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        const tieneMayuscula = /[A-Z]/.test(contrasena1);
        const tieneNumero = /[0-9]/.test(contrasena1);

        if (!tieneMayuscula || !tieneNumero) {
            setError(
                'La contraseña debe contener una mayúscula y un número.'
            );
            return;
        }

        setEnviando(true);

        try {
            await registrar({
                run: run.trim(),
                nombre: nombre.trim(),
                apellidos: apellido.trim(),
                correo: correo.trim(),
                password: contrasena1
            });

            alert('Usuario registrado correctamente. Ya puedes iniciar sesión.');

            navigate('/login', { replace: true });

        } catch (error) {
            setError(
                error.response?.data?.mensaje ||
                'No se pudo registrar el usuario.'
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
                Registro de usuario
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
                    id="registro_formulario"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        width: '100%'
                    }}
                    onSubmit={manejarSubmit}
                >
                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: '10px'
                        }}
                    >
                        <Link
                            to="/login"
                            className="enlace_secundario"
                            style={{ fontSize: '14px' }}
                        >
                            ¿Ya estás registrado? Inicia sesión
                        </Link>
                    </div>

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
                            htmlFor="run"
                            className="etiqueta_formulario"
                        >
                            RUN:
                        </label>

                        <input
                            id="run"
                            type="text"
                            className="input_formulario"
                            placeholder="12345678-5"
                            maxLength={12}
                            required
                            value={run}
                            onChange={(e) => setRun(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="nombre"
                            className="etiqueta_formulario"
                        >
                            Nombre:
                        </label>

                        <input
                            id="nombre"
                            type="text"
                            className="input_formulario"
                            autoComplete="given-name"
                            required
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="apellido"
                            className="etiqueta_formulario"
                        >
                            Apellidos:
                        </label>

                        <input
                            id="apellido"
                            type="text"
                            className="input_formulario"
                            autoComplete="family-name"
                            required
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                        />
                    </div>

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
                            autoComplete="email"
                            required
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="contrasena1"
                            className="etiqueta_formulario"
                        >
                            Contraseña:
                        </label>

                        <input
                            id="contrasena1"
                            type="password"
                            className="input_formulario"
                            autoComplete="new-password"
                            minLength={8}
                            required
                            value={contrasena1}
                            onChange={(e) =>
                                setContrasena1(e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="contrasena2"
                            className="etiqueta_formulario"
                        >
                            Repetir contraseña:
                        </label>

                        <input
                            id="contrasena2"
                            type="password"
                            className="input_formulario"
                            autoComplete="new-password"
                            minLength={8}
                            required
                            value={contrasena2}
                            onChange={(e) =>
                                setContrasena2(e.target.value)
                            }
                        />
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <label style={{ fontSize: '14px' }}>
                            <input type="checkbox" required />{' '}
                            Acepto las políticas y términos de PetSalud
                        </label>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <button
                            type="submit"
                            className="btn_principal"
                            disabled={enviando || cargando}
                        >
                            {enviando
                                ? 'Registrando usuario...'
                                : 'Registrarse'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default Registro;
