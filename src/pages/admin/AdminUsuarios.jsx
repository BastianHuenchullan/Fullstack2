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
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const cargarUsuarios = useCallback(async () => {
        setCargando(true);
        try {
            const datos = await usuarioService.listar();
            setUsuarios(datos);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al cargar usuarios.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarUsuarios();
    }, [cargarUsuarios]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    };

    const limpiarFormulario = () => {
        setFormulario(formularioInicial);
        setIdEdicion(null);
    };

    const editarUsuario = (item) => {
        setError('');
        setMensaje('');
        setIdEdicion(item.id);
        setFormulario({
            run: item.run,
            nombre: item.nombre,
            apellidos: item.apellidos,
            correo: item.correo,
            password: '',
            rol: item.rol
        });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

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
                setMensaje('Usuario creado.');
            } else {
                await usuarioService.actualizar(idEdicion, datos);
                setMensaje('Usuario actualizado.');
            }
            limpiarFormulario();
            cargarUsuarios();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo guardar el usuario.');
        }
    };

    const eliminarUsuario = async (item) => {
        if (item.id === usuario.id) {
            setError('No puedes eliminar tu propia cuenta.');
            return;
        }
        if (!window.confirm(`¿Eliminar a ${item.nombre}?`)) return;

        try {
            await usuarioService.eliminar(item.id);
            if (idEdicion === item.id) limpiarFormulario();
            setMensaje('Usuario eliminado.');
            cargarUsuarios();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo eliminar el usuario.');
        }
    };

    return (
        <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h2 className="titulo_seccion">Administración de usuarios</h2>

            {error && <div className="admin_error">{error}</div>}
            {mensaje && <div className="admin_exito">{mensaje}</div>}

            <div className="admin_contenedor">
                <section className="admin_panel">
                    <h3>{idEdicion === null ? 'Nuevo usuario' : 'Editar usuario'}</h3>

                    <form className="admin_formulario" onSubmit={manejarSubmit}>
                        <label>RUN</label>
                        <input name="run" className="input_formulario" maxLength={12} required value={formulario.run} onChange={manejarCambio} />

                        <label>Nombre</label>
                        <input name="nombre" className="input_formulario" required value={formulario.nombre} onChange={manejarCambio} />

                        <label>Apellidos</label>
                        <input name="apellidos" className="input_formulario" required value={formulario.apellidos} onChange={manejarCambio} />

                        <label>Correo</label>
                        <input name="correo" type="email" className="input_formulario" readOnly={idEdicion === usuario.id} required value={formulario.correo} onChange={manejarCambio} />

                        <label>Contraseña</label>
                        <input name="password" type="password" className="input_formulario" minLength={8} required={idEdicion === null} placeholder={idEdicion ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'} value={formulario.password} onChange={manejarCambio} />

                        <label>Rol</label>
                        <select name="rol" className="input_formulario" disabled={idEdicion === usuario.id} value={formulario.rol} onChange={manejarCambio}>
                            <option value="CLIENTE">Cliente</option>
                            <option value="ADMIN">Administrador</option>
                        </select>

                        <button type="submit" className="btn_principal">
                            {idEdicion === null ? 'Crear' : 'Guardar'}
                        </button>

                        {idEdicion !== null && (
                            <button type="button" className="admin_btn_cancelar" onClick={limpiarFormulario}>
                                Cancelar
                            </button>
                        )}
                    </form>
                </section>

                <section className="admin_panel">
                    <h3>Usuarios registrados</h3>

                    {cargando ? (
                        <p>Cargando...</p>
                    ) : (
                        <div className="admin_tabla_contenedor">
                            <table className="admin_tabla">
                                <thead>
                                    <tr>
                                        <th>RUN</th>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.run}</td>
                                            <td>{item.nombre} {item.apellidos}</td>
                                            <td>{item.correo}</td>
                                            <td>{item.rol}</td>
                                            <td style={{ display: 'flex', gap: '6px' }}>
                                                <button type="button" className="admin_btn_editar" onClick={() => editarUsuario(item)}>Editar</button>
                                                <button type="button" className="admin_btn_eliminar" disabled={item.id === usuario.id} onClick={() => eliminarUsuario(item)}>Eliminar</button>
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