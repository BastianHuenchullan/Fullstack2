import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearBoleta } from '../services/ventasService';

function Carrito() {
    const navigate = useNavigate();
    const [carritoAgrupado, setCarritoAgrupado] = useState([]);
    const [total, setTotal] = useState(0);
    const [enviando, setEnviando] = useState(false);

    // Campos del formulario de despacho (CompraRequest)
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correo, setCorreo] = useState('');
    const [calle, setCalle] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [region, setRegion] = useState('Región Metropolitana');
    const [comuna, setComuna] = useState('');
    const [indicaciones, setIndicaciones] = useState('');

    const parsearPrecio = (precio) => {
        if (typeof precio === 'number') return precio;
        if (typeof precio === 'string') {
            return parseInt(precio.replace(/[^0-9]/g, ''), 10) || 0;
        }
        return 0;
    };

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario_actual'));
        if (usuario) {
            setNombre(usuario.nombre || '');
            setApellidos(usuario.apellidos || usuario.apellido || '');
            setCorreo(usuario.correo || '');
        }
        cargarCarrito();
    }, []);

    const cargarCarrito = () => {
        const itemsCrudos = JSON.parse(localStorage.getItem('carrito_items')) || [];
        const mapa = new Map();
        let suma = 0;

        itemsCrudos.forEach((item, idx) => {
            const idProducto = item.id || item.productoId || (idx + 1);
            const nombreProducto = item.nombre || item.titulo || 'Producto';
            const precioUnitario = parsearPrecio(item.enOferta && item.precioOferta ? item.precioOferta : item.precio);

            suma += precioUnitario;

            if (mapa.has(idProducto)) {
                const existente = mapa.get(idProducto);
                existente.cantidad += 1;
            } else {
                mapa.set(idProducto, {
                    productoId: idProducto,
                    nombre: nombreProducto,
                    precioUnitario,
                    cantidad: 1
                });
            }
        });

        setCarritoAgrupado(Array.from(mapa.values()));
        setTotal(suma);
    };

    const modificarCantidad = (productoId, delta) => {
        const itemsCrudos = JSON.parse(localStorage.getItem('carrito_items')) || [];

        if (delta > 0) {
            if (itemsCrudos.length >= 10) {
                alert('Límite máximo de 10 artículos en el carrito.');
                return;
            }
            const ejemplo = itemsCrudos.find(p => (p.id || p.productoId) === productoId);
            if (ejemplo) itemsCrudos.push(ejemplo);
        } else {
            const index = itemsCrudos.findIndex(p => (p.id || p.productoId) === productoId);
            if (index !== -1) itemsCrudos.splice(index, 1);
        }

        localStorage.setItem('carrito_items', JSON.stringify(itemsCrudos));
        cargarCarrito();
        window.dispatchEvent(new Event('storage'));
    };

    const realizarCompra = async (e) => {
        e.preventDefault();

        if (carritoAgrupado.length === 0) {
            alert('No tienes productos en el carro para comprar.');
            return;
        }

        if (!nombre.trim() || !apellidos.trim() || !correo.trim() || !calle.trim() || !region.trim() || !comuna.trim()) {
            alert('Por favor, completa todos los campos obligatorios (*) de despacho.');
            return;
        }

        const payload = {
            nombre: nombre.trim(),
            apellidos: apellidos.trim(),
            correo: correo.trim(),
            calle: calle.trim(),
            departamento: departamento.trim() || null,
            region: region.trim(),
            comuna: comuna.trim(),
            indicaciones: indicaciones.trim() || null,
            items: carritoAgrupado.map(item => ({
                productoId: item.productoId,
                cantidad: item.cantidad
            }))
        };

        try {
            setEnviando(true);
            const boletaCreada = await crearBoleta(payload);

            localStorage.removeItem('carrito_items');
            window.dispatchEvent(new Event('storage'));

            alert(`¡Compra exitosa! Boleta N° ${boletaCreada.id} emitida por $${(boletaCreada.total || total).toLocaleString('es-CL')} CLP.`);

            const usuario = JSON.parse(localStorage.getItem('usuario_actual'));
            if (usuario) {
                navigate('/mis-compras');
            } else {
                navigate('/');
            }
        } catch (error) {
            alert(`No se pudo procesar la compra: ${error.message}`);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="titulo_seccion">Tu Carrito de Compras</h2>

            <div className="caja_formularios" style={{ maxWidth: '750px', flexDirection: 'column', gap: '20px', width: '100%' }}>
                {/* Lista de productos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <h3 style={{ margin: 0, color: '#2A3E47' }}>Resumen de productos</h3>
                    {carritoAgrupado.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'gray', fontSize: '18px' }}>El carro está vacío.</p>
                    ) : (
                        carritoAgrupado.map((item) => (
                            <div key={item.productoId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '10px 0', gap: '10px' }}>
                                <span style={{ fontWeight: 'bold', color: '#2A3E47', fontSize: '17px', flex: 1 }}>
                                    {item.nombre}
                                </span>
                                <span style={{ color: '#2A3E47', fontSize: '16px' }}>
                                    ${(item.precioUnitario * item.cantidad).toLocaleString('es-CL')}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button type="button" className="btn_icono_agregar" style={{ width: '26px', height: '26px', fontSize: '18px', lineHeight: 0 }} onClick={() => modificarCantidad(item.productoId, -1)}>-</button>
                                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                                    <button type="button" className="btn_icono_agregar" style={{ width: '26px', height: '26px', fontSize: '18px', lineHeight: 0 }} onClick={() => modificarCantidad(item.productoId, 1)}>+</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <hr style={{ width: '100%', border: '1px solid #141414', margin: '5px 0' }} />

                <div style={{ textAlign: 'right', width: '100%' }}>
                    <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#2A3E47', margin: 0 }}>
                        Total estimado: ${total.toLocaleString('es-CL')} CLP
                    </p>
                </div>

                {/* Formulario de despacho */}
                {carritoAgrupado.length > 0 && (
                    <form onSubmit={realizarCompra} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <h3 style={{ margin: '10px 0 0 0', color: '#2A3E47' }}>Datos de entrega</h3>

                        <div className="formulario_grid">
                            <div>
                                <label className="etiqueta_formulario">Nombre*</label>
                                <input type="text" className="input_formulario" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            </div>
                            <div>
                                <label className="etiqueta_formulario">Apellidos*</label>
                                <input type="text" className="input_formulario" required value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                            </div>
                            <div>
                                <label className="etiqueta_formulario">Correo electrónico*</label>
                                <input type="email" className="input_formulario" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
                            </div>
                            <div>
                                <label className="etiqueta_formulario">Calle y número*</label>
                                <input type="text" className="input_formulario" placeholder="Ej. Av. Providencia 1234" required value={calle} onChange={(e) => setCalle(e.target.value)} />
                            </div>
                            <div>
                                <label className="etiqueta_formulario">Depto / Casa (opcional)</label>
                                <input type="text" className="input_formulario" placeholder="Ej. Depto 402" value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
                            </div>
                            <div>
                                <label className="etiqueta_formulario">Región*</label>
                                <input type="text" className="input_formulario" required value={region} onChange={(e) => setRegion(e.target.value)} />
                            </div>
                            <div>
                                <label className="etiqueta_formulario">Comuna*</label>
                                <input type="text" className="input_formulario" placeholder="Ej. Santiago" required value={comuna} onChange={(e) => setComuna(e.target.value)} />
                            </div>
                            <div>
                                <label className="etiqueta_formulario">Indicaciones (opcional)</label>
                                <input type="text" className="input_formulario" placeholder="Ej. Dejar en conserjería" value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" className="btn_principal" style={{ marginTop: '10px' }} disabled={enviando}>
                            {enviando ? 'Procesando compra...' : 'Confirmar compra'}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}

export default Carrito;