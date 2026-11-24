import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crearBoleta } from '../services/ventasService';

function Carrito() {
    const navigate = useNavigate();
    const { usuario } = useAuth();

    const [carritoAgrupado, setCarritoAgrupado] = useState([]);
    const [total, setTotal] = useState(0);
    const [enviando, setEnviando] = useState(false);

    const [calle, setCalle] = useState('');
    const [comuna, setComuna] = useState('');

    const cargarCarrito = useCallback(() => {
        const itemsCrudos = JSON.parse(localStorage.getItem('carrito_items')) || [];
        const mapa = new Map();
        let suma = 0;

        itemsCrudos.forEach((item) => {
            const precioUnitario = item.enOferta && item.precioOferta ? item.precioOferta : item.precio;
            suma += precioUnitario;

            if (mapa.has(item.id)) {
                mapa.get(item.id).cantidad += 1;
            } else {
                mapa.set(item.id, {
                    productoId: item.id,
                    nombre: item.nombre,
                    precioUnitario,
                    cantidad: 1
                });
            }
        });

        setCarritoAgrupado(Array.from(mapa.values()));
        setTotal(suma);
    }, []);

    useEffect(() => {
        cargarCarrito();
    }, [cargarCarrito]);

    const modificarCantidad = (productoId, delta) => {
        const itemsCrudos = JSON.parse(localStorage.getItem('carrito_items')) || [];

        if (delta > 0) {
            if (itemsCrudos.length >= 10) {
                alert('Límite máximo de 10 artículos en el carrito.');
                return;
            }
            const producto = itemsCrudos.find(p => p.id === productoId);
            if (producto) itemsCrudos.push(producto);
        } else {
            const index = itemsCrudos.findIndex(p => p.id === productoId);
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

        const payload = {
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            calle: calle.trim(),
            departamento: null,
            region: 'Región Metropolitana',
            comuna: comuna.trim(),
            indicaciones: null,
            items: carritoAgrupado.map(item => ({
                productoId: item.productoId,
                cantidad: item.cantidad
            }))
        };

        try {
            setEnviando(true);
            const boleta = await crearBoleta(payload);

            localStorage.removeItem('carrito_items');
            window.dispatchEvent(new Event('storage'));

            alert(`¡Compra exitosa! Boleta #${boleta.id} por $${boleta.total.toLocaleString('es-CL')} CLP.`);
            navigate('/mis-compras');
        } catch (error) {
            alert(`Error al comprar: ${error.message}`);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="titulo_seccion">Tu Carrito de Compras</h2>

            <div className="caja_formularios" style={{ maxWidth: '650px', flexDirection: 'column', gap: '20px', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    {carritoAgrupado.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'gray', fontSize: '18px' }}>El carro está vacío.</p>
                    ) : (
                        carritoAgrupado.map((item) => (
                            <div key={item.productoId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                                <span style={{ fontWeight: 'bold', color: '#2A3E47', flex: 1 }}>{item.nombre}</span>
                                <span style={{ color: '#2A3E47', marginRight: '15px' }}>
                                    ${(item.precioUnitario * item.cantidad).toLocaleString('es-CL')}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button type="button" className="btn_icono_agregar" style={{ width: '25px', height: '25px', fontSize: '18px', lineHeight: 0 }} onClick={() => modificarCantidad(item.productoId, -1)}>-</button>
                                    <span style={{ fontWeight: 'bold' }}>{item.cantidad}</span>
                                    <button type="button" className="btn_icono_agregar" style={{ width: '25px', height: '25px', fontSize: '18px', lineHeight: 0 }} onClick={() => modificarCantidad(item.productoId, 1)}>+</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <hr style={{ width: '100%', border: '1px solid #141414' }} />

                <div style={{ textAlign: 'right', width: '100%' }}>
                    <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#2A3E47', margin: 0 }}>
                        Total: ${total.toLocaleString('es-CL')} CLP
                    </p>
                </div>

                {carritoAgrupado.length > 0 && (
                    <form onSubmit={realizarCompra} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="formulario_grid">
                            <div>
                                <label className="etiqueta_formulario">Dirección de envío*</label>
                                <input type="text" className="input_formulario" placeholder="Ej. Av. Providencia 1234" required value={calle} onChange={(e) => setCalle(e.target.value)} />
                            </div>
                            <div>
                                <label className="etiqueta_formulario">Comuna*</label>
                                <input type="text" className="input_formulario" placeholder="Ej. Santiago" required value={comuna} onChange={(e) => setComuna(e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" className="btn_principal" disabled={enviando}>
                            {enviando ? 'Procesando...' : 'Comprar'}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}

export default Carrito;