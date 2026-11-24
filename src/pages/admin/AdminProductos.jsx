import React, { useState, useEffect, useCallback } from 'react';
import productoService from '../../services/productoService';

const formularioInicial = {
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    precioOferta: '',
    enOferta: false,
    stock: '10',
    stockCritico: '5',
    imagenUrl: '/assets/producto_1.png',
    categoriaId: ''
};

function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [idEdicion, setIdEdicion] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
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
                setFormulario(prev => prev.categoriaId ? prev : { ...prev, categoriaId: String(listaCategorias[0].id) });
            }
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudieron cargar los productos.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        setFormulario(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const limpiarFormulario = () => {
        setFormulario({
            ...formularioInicial,
            categoriaId: categorias.length > 0 ? String(categorias[0].id) : ''
        });
        setIdEdicion(null);
    };

    const editarProducto = (prod) => {
        setError('');
        setMensaje('');
        setIdEdicion(prod.id);
        setFormulario({
            codigo: prod.codigo,
            nombre: prod.nombre,
            descripcion: prod.descripcion || '',
            precio: String(prod.precio),
            precioOferta: prod.precioOferta ? String(prod.precioOferta) : '',
            enOferta: Boolean(prod.enOferta),
            stock: String(prod.stock),
            stockCritico: String(prod.stockCritico),
            imagenUrl: prod.imagenUrl || '/assets/producto_1.png',
            categoriaId: String(prod.categoriaId)
        });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');
        setGuardando(true);

        const payload = {
            codigo: formulario.codigo.trim(),
            nombre: formulario.nombre.trim(),
            descripcion: formulario.descripcion.trim(),
            precio: parseInt(formulario.precio, 10),
            precioOferta: formulario.enOferta && formulario.precioOferta ? parseInt(formulario.precioOferta, 10) : null,
            enOferta: formulario.enOferta,
            stock: parseInt(formulario.stock, 10),
            stockCritico: parseInt(formulario.stockCritico, 10),
            imagenUrl: formulario.imagenUrl.trim(),
            categoriaId: Number(formulario.categoriaId)
        };

        try {
            if (idEdicion === null) {
                await productoService.crear(payload);
                setMensaje('Producto creado correctamente.');
            } else {
                await productoService.actualizar(idEdicion, payload);
                setMensaje('Producto actualizado correctamente.');
            }
            limpiarFormulario();
            await cargarDatos();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo guardar el producto.');
        } finally {
            setGuardando(false);
        }
    };

    const eliminarProducto = async (prod) => {
        if (!window.confirm(`¿Deseas eliminar el producto "${prod.nombre}"?`)) return;
        setError('');
        setMensaje('');
        setGuardando(true);
        try {
            await productoService.eliminar(prod.id);
            if (idEdicion === prod.id) limpiarFormulario();
            setMensaje('Producto eliminado correctamente.');
            await cargarDatos();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo eliminar el producto.');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center', gap: '25px' }}>
            <h2 className="titulo_seccion">Administración de productos</h2>

            {error && <div className="admin_error" role="alert">{error}</div>}
            {mensaje && <div className="admin_exito" role="status">{mensaje}</div>}

            <div className="admin_contenedor">
                <section className="admin_panel">
                    <h3>{idEdicion === null ? 'Crear producto' : 'Editar producto'}</h3>

                    <form className="admin_formulario" onSubmit={manejarSubmit}>
                        <label htmlFor="prod_codigo">Código</label>
                        <input id="prod_codigo" name="codigo" className="input_formulario" placeholder="PROD-005" maxLength={30} required value={formulario.codigo} onChange={manejarCambio} />

                        <label htmlFor="prod_nombre">Nombre</label>
                        <input id="prod_nombre" name="nombre" className="input_formulario" maxLength={120} required value={formulario.nombre} onChange={manejarCambio} />

                        <label htmlFor="prod_categoria">Categoría</label>
                        <select id="prod_categoria" name="categoriaId" className="input_formulario" required value={formulario.categoriaId} onChange={manejarCambio}>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>

                        <label htmlFor="prod_precio">Precio normal (CLP)</label>
                        <input id="prod_precio" name="precio" type="number" min="1" className="input_formulario" required value={formulario.precio} onChange={manejarCambio} />

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" name="enOferta" checked={formulario.enOferta} onChange={manejarCambio} />
                            En oferta
                        </label>

                        {formulario.enOferta && (
                            <>
                                <label htmlFor="prod_oferta">Precio oferta (CLP)</label>
                                <input id="prod_oferta" name="precioOferta" type="number" min="1" className="input_formulario" required value={formulario.precioOferta} onChange={manejarCambio} />
                            </>
                        )}

                        <label htmlFor="prod_stock">Stock actual</label>
                        <input id="prod_stock" name="stock" type="number" min="0" className="input_formulario" required value={formulario.stock} onChange={manejarCambio} />

                        <label htmlFor="prod_critico">Stock crítico</label>
                        <input id="prod_critico" name="stockCritico" type="number" min="0" className="input_formulario" required value={formulario.stockCritico} onChange={manejarCambio} />

                        <label htmlFor="prod_img">Ruta de imagen</label>
                        <input id="prod_img" name="imagenUrl" className="input_formulario" value={formulario.imagenUrl} onChange={manejarCambio} />

                        <label htmlFor="prod_desc">Descripción</label>
                        <input id="prod_desc" name="descripcion" className="input_formulario" maxLength={500} value={formulario.descripcion} onChange={manejarCambio} />

                        <button type="submit" className="btn_principal" disabled={guardando}>
                            {guardando ? 'Guardando...' : idEdicion === null ? 'Crear producto' : 'Guardar cambios'}
                        </button>

                        {idEdicion !== null && (
                            <button type="button" className="admin_btn_cancelar" disabled={guardando} onClick={limpiarFormulario}>
                                Cancelar edición
                            </button>
                        )}
                    </form>
                </section>

                <section className="admin_panel">
                    <h3>Inventario de productos</h3>
                    <p>Total registrados: {productos.length}</p>

                    {cargando ? (
                        <p>Cargando productos...</p>
                    ) : (
                        <div className="admin_tabla_contenedor">
                            <table className="admin_tabla">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.codigo}</td>
                                            <td>{item.nombre}</td>
                                            <td>{item.categoriaNombre}</td>
                                            <td>
                                                ${(item.enOferta && item.precioOferta ? item.precioOferta : item.precio).toLocaleString('es-CL')}
                                            </td>
                                            <td style={{ color: item.stock <= item.stockCritico ? 'crimson' : 'inherit', fontWeight: item.stock <= item.stockCritico ? 'bold' : 'normal' }}>
                                                {item.stock}
                                            </td>
                                            <td>
                                                <div className="admin_acciones">
                                                    <button type="button" className="admin_btn_editar" disabled={guardando} onClick={() => editarProducto(item)}>
                                                        Editar
                                                    </button>
                                                    <button type="button" className="admin_btn_eliminar" disabled={guardando} onClick={() => eliminarProducto(item)}>
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

export default AdminProductos;