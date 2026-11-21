import React, { useState, useEffect, useCallback } from 'react';
import usuarioService from '../../services/usuarioService';
import { useAuth } from '../../context/AuthContext';

const formularioInicial = {
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    rol: 'CLIENTE'
};

function AdminUsuarios() {

    const { usuario } = useAuth();

    const [usuarios, setUsuarios] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [idEdicion, setIdEdicion] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const cargarUsuarios = useCallback(async () => {
        setCargando(true);

        try {
            const datos = await usuarioService.listar();
            setUsuarios(datos);

        } catch (error) {
            setError(
                error.response?.data?.mensaje ||
                'No se pudieron cargar los usuarios.'
            );

        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarUsuarios();
    }, [cargarUsuarios]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario(anterior => ({
            ...anterior,
            [name]: value
        }));
    };

    const limpiarFormulario = () => {
        setFormulario(formularioInicial);
        setIdEdicion(null);
    };

    const editarUsuario = async (id) => {
        setError('');
        setMensaje('');

        try {
            const seleccionado = await usuarioService.obtener(id);

            setIdEdicion(seleccionado.id);

            setFormulario({
                run: seleccionado.run,
                nombre: seleccionado.nombre,
                apellidos: seleccionado.apellidos,
                correo: seleccionado.correo,
                password: '',
                rol: seleccionado.rol
            });

        } catch (error) {
            setError(
                error.response?.data?.mensaje ||
                'No se pudo obtener el usuario.'
            );
        }
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setMensaje('');

        if (idEdicion === null || formulario.password !== '') {
            if (formulario.password.length < 8) {
                setError(
                    'La contraseña debe tener al menos 8 caracteres.'
                );
                return;
            }

            if (
                new TextEncoder()
                    .encode(formulario.password).length > 72
            ) {
                setError(
                    'La contraseña no puede superar los 72 bytes.'
                );
                return;
            }
        }

        setGuardando(true);

        const datos = {
            run: formulario.run.trim(),
            nombre: formulario.nombre.trim(),
            apellidos: formulario.apellidos.trim(),
            correo: formulario.correo.trim(),
            password: formulario.password,
            rol: formulario.rol
        };

        try {
            if (idEdicion === null) {
                await usuarioService.crear(datos);
                setMensaje('Usuario creado correctamente.');

            } else {
                await usuarioService.actualizar(idEdicion, datos);
                setMensaje('Usuario actualizado correctamente.');
            }

            limpiarFormulario();
            await cargarUsuarios();

        } catch (error) {
            setError(
                error.response?.data?.mensaje ||
                'No se pudo guardar el usuario.'
            );

        } finally {
            setGuardando(false);
        }
    };

    const eliminarUsuario = async (seleccionado) => {
        setError('');
        setMensaje('');

        if (seleccionado.id === usuario.id) {
            setError('No puedes eliminar tu propia cuenta.');
            return;
        }

        const confirmar = window.confirm(
            `¿Deseas eliminar a ${seleccionado.nombre}?`
        );

        if (!confirmar) {
            return;
        }

        setGuardando(true);

        try {
            await usuarioService.eliminar(seleccionado.id);

            if (idEdicion === seleccionado.id) {
                limpiarFormulario();
            }

            setMensaje('Usuario eliminado correctamente.');

            await cargarUsuarios();

        } catch (error) {
            setError(
                error.response?.data?.mensaje ||
                'No se pudo eliminar el usuario.'
            );

        } finally {
            setGuardando(false);
        }
    };

    return (
        <main
            className="main_general"
            style={{
                flexDirection: 'column',
                alignItems: 'center',
                gap: '25px'
            }}
        >
            <h2 className="titulo_seccion">
                Administración de usuarios
            </h2>

            {error && (
                <div className="admin_error" role="alert">
                    {error}
                </div>
            )}

            {mensaje && (
                <div className="admin_exito" role="status">
                    {mensaje}
                </div>
            )}

            <div className="admin_contenedor">

                <section className="admin_panel">

                    <h3>
                        {idEdicion === null
                            ? 'Crear usuario'
                            : 'Editar usuario'}
                    </h3>

                    <form
                        className="admin_formulario"
                        onSubmit={manejarSubmit}
                    >
                        <label htmlFor="admin_run">
                            RUN
                        </label>

                        <input
                            id="admin_run"
                            name="run"
                            className="input_formulario"
                            maxLength={12}
                            required
                            value={formulario.run}
                            onChange={manejarCambio}
                        />

                        <label htmlFor="admin_nombre">
                            Nombre
                        </label>

                        <input
                            id="admin_nombre"
                            name="nombre"
                            className="input_formulario"
                            maxLength={100}
                            required
                            value={formulario.nombre}
                            onChange={manejarCambio}
                        />

                        <label htmlFor="admin_apellidos">
                            Apellidos
                        </label>

                        <input
                            id="admin_apellidos"
                            name="apellidos"
                            className="input_formulario"
                            maxLength={100}
                            required
                            value={formulario.apellidos}
                            onChange={manejarCambio}
                        />

                        <label htmlFor="admin_correo">
                            Correo electrónico
                        </label>

                        <input
                            id="admin_correo"
                            name="correo"
                            type="email"
                            className="input_formulario"
                            maxLength={255}
                            readOnly={idEdicion === usuario.id}
                            required
                            value={formulario.correo}
                            onChange={manejarCambio}
                        />

                        <label htmlFor="admin_password">
                            Contraseña
                        </label>

                        <input
                            id="admin_password"
                            name="password"
                            type="password"
                            className="input_formulario"
                            autoComplete="new-password"
                            minLength={8}
                            required={idEdicion === null}
                            placeholder={
                                idEdicion !== null
                                    ? 'Dejar vacía para conservar'
                                    : 'Mínimo 8 caracteres'
                            }
                            value={formulario.password}
                            onChange={manejarCambio}
                        />

                        <label htmlFor="admin_rol">
                            Rol
                        </label>

                        <select
                            id="admin_rol"
                            name="rol"
                            className="input_formulario"
                            disabled={idEdicion === usuario.id}
                            value={formulario.rol}
                            onChange={manejarCambio}
                        >
                            <option value="CLIENTE">
                                Cliente
                            </option>

                            <option value="ADMIN">
                                Administrador
                            </option>
                        </select>

                        <button
                            type="submit"
                            className="btn_principal"
                            disabled={guardando}
                        >
                            {guardando
                                ? 'Guardando...'
                                : idEdicion === null
                                    ? 'Crear usuario'
                                    : 'Guardar cambios'}
                        </button>

                        {idEdicion !== null && (
                            <button
                                type="button"
                                className="admin_btn_cancelar"
                                disabled={guardando}
                                onClick={limpiarFormulario}
                            >
                                Cancelar edición
                            </button>
                        )}

                    </form>

                </section>

                <section className="admin_panel">

                    <h3>Usuarios registrados</h3>

                    <p>
                        Total de usuarios: {usuarios.length}
                    </p>

                    {cargando ? (
                        <p>Cargando usuarios...</p>

                    ) : usuarios.length === 0 ? (
                        <p>No hay usuarios registrados.</p>

                    ) : (
                        <div className="admin_tabla_contenedor">
                            <table className="admin_tabla">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>RUN</th>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {usuarios.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>

                                            <td>{item.run}</td>

                                            <td>
                                                {item.nombre}
                                                {' '}
                                                {item.apellidos}
                                            </td>

                                            <td>{item.correo}</td>

                                            <td>{item.rol}</td>

                                            <td>
                                                <div className="admin_acciones">

                                                    <button
                                                        type="button"
                                                        className="admin_btn_editar"
                                                        disabled={guardando}
                                                        onClick={() =>
                                                            editarUsuario(item.id)
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin_btn_eliminar"
                                                        disabled={
                                                            guardando ||
                                                            item.id === usuario.id
                                                        }
                                                        onClick={() =>
                                                            eliminarUsuario(item)
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </section>

            </div>
        </main>
    );
}

export default AdminUsuarios;
