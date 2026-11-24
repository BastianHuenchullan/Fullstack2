import React, { useState, useEffect, useCallback } from 'react';
import productoService from '../../services/productoService';

const formularioInicial = {
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '10',
    imagenUrl: '/assets/producto_1.png',
    categoriaId: ''
};

function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [idEdicion, setIdEdicion] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const cargarDatos = useCallback(async () => {
        setCargando(true);
        try {
            const [listaProductos, listaCategorias] = await Promise.all([
                productoService.listar(),
                productoService.listarCategorias()
            ]);
            setProductos(listaProductos);
            setCategorias(listaCategorias);
            if (listaCategorias.length > 0) {
                setFormulario((prev) => ({ ...prev, categoriaId: prev.categoriaId || String(listaCategorias[0].id) }));
            }
        } catch (err) {
            setError('Error al cargar productos.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    };

    const limpiarFormulario = () => {
        setFormulario({
            ...formularioInicial,
            categoriaId: categorias.length > 0 ? String(categorias[0].id) : ''
        });
        setIdEdicion(null);
    };

    const editarProducto = (item) => {
        setError('');
        setMensaje('');
        setIdEdicion(item.id);
        setFormulario({
            codigo: item.codigo,
            nombre: item.nombre,
            descripcion: item.descripcion || '',
            precio: String(item.precio),
            stock: String(item.stock),
            imagenUrl: item.imagenUrl || '/assets/producto_1.png',
            categoriaId: String(item.categoriaId)
        });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        const payload = {
            codigo: formulario.codigo.trim(),
            nombre: formulario.nombre.trim(),
            descripcion: formulario.descripcion.trim(),
            precio: parseInt(formulario.precio, 10),
            precioOferta: null,
            enOferta: false,
            stock: parseInt(formulario.stock, 10),
            stockCritico: 5,
            imagenUrl: formulario.imagenUrl.trim(),
            categoriaId: Number(formulario.categoriaId)
        };

        try {
            if (idEdicion === null) {
                await productoService.crear(payload);
                setMensaje('Producto creado.');
            } else {
                await productoService.actualizar(idEdicion, payload);
                setMensaje('Producto actualizado.');
            }
            limpiarFormulario();
            cargarDatos();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo guardar el producto.');
        }
    };

    const eliminarProducto = async (item) => {
        if (!window.confirm(`¿Eliminar ${item.nombre}?`)) return;

        try {
            await productoService.eliminar(item.id);
            if (idEdicion === item.id) limpiarFormulario();
            setMensaje('Producto eliminado.');
            cargarDatos();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo eliminar el producto.');
        }
    };

    return (
        <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h2 className="titulo_seccion">Administración de productos</h2>

            {error && <div className="admin_error">{error}</div>}
            {mensaje && <div className="admin_exito">{mensaje}</div>}

            <div className="admin_contenedor">
                <section className="admin_panel">
                    <h3>{idEdicion === null ? 'Nuevo producto' : 'Editar producto'}</h3>

                    <form className="admin_formulario" onSubmit={manejarSubmit}>
                        <label>Código</label>
                        <input name="codigo" className="input_formulario" placeholder="PROD-005" required value={formulario.codigo} onChange={manejarCambio} />

                        <label>Nombre</label>
                        <input name="nombre" className="input_formulario" required value={formulario.nombre} onChange={manejarCambio} />

                        <label>Categoría</label>
                        <select name="categoriaId" className="input_formulario" required value={formulario.categoriaId} onChange={manejarCambio}>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>

                        <label>Precio (CLP)</label>
                        <input name="precio" type="number" min="1" className="input_formulario" required value={formulario.precio} onChange={manejarCambio} />

                        <label>Stock</label>
                        <input name="stock" type="number" min="0" className="input_formulario" required value={formulario.stock} onChange={manejarCambio} />

                        <label>Imagen</label>
                        <input name="imagenUrl" className="input_formulario" value={formulario.imagenUrl} onChange={manejarCambio} />

                        <label>Descripción</label>
                        <input name="descripcion" className="input_formulario" value={formulario.descripcion} onChange={manejarCambio} />

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
                    <h3>Productos registrados</h3>

                    {cargando ? (
                        <p>Cargando...</p>
                    ) : (
                        <div className="admin_tabla_contenedor">
                            <table className="admin_tabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.codigo}</td>
                                            <td>{item.nombre}</td>
                                            <td>{item.categoriaNombre}</td>
                                            <td>${(item.precio || 0).toLocaleString('es-CL')}</td>
                                            <td>{item.stock}</td>
                                            <td style={{ display: 'flex', gap: '6px' }}>
                                                <button type="button" className="admin_btn_editar" onClick={() => editarProducto(item)}>Editar</button>
                                                <button type="button" className="admin_btn_eliminar" onClick={() => eliminarProducto(item)}>Eliminar</button>
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

export default AdminProductos;