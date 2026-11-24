import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import productoService from '../services/productoService';

function CatalogoGatos() {
    const [gatos, setGatos] = useState([]);
    const [cargandoProductos, setCargandoProductos] = useState(true);
    const { autenticado, cargando, tieneRol } = useAuth();

    useEffect(() => {
        productoService.listar({ categoria: 'Gatos' })
            .then(setGatos)
            .catch((err) => console.error(err))
            .finally(() => setCargandoProductos(false));
    }, []);

    const agregarAlCarrito = (producto, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!autenticado) {
            alert('Por favor, inicia sesión para añadir al carrito.');
            return;
        }
        if (!tieneRol('CLIENTE')) return;

        const elementosCarrito = JSON.parse(localStorage.getItem('carrito_items')) || [];
        if (elementosCarrito.length < 10) {
            elementosCarrito.push(producto);
            localStorage.setItem('carrito_items', JSON.stringify(elementosCarrito));
            window.dispatchEvent(new Event('storage'));
            alert('¡Producto agregado al carro con éxito!');
        } else {
            alert('Límite máximo de 10 artículos en el carrito.');
        }
    };

    const verDetalle = (producto) => {
        localStorage.setItem('detalle_producto', JSON.stringify(producto));
    };

    return (
        <main className="main_productos">
            <h2 className="titulo_seccion">Productos de gatos</h2>

            {cargandoProductos ? (
                <p style={{ textAlign: 'center' }}>Cargando catálogo...</p>
            ) : (
                <div className="productos_grid">
                    {gatos.map((producto) => {
                        const precioFinal = producto.enOferta && producto.precioOferta
                            ? producto.precioOferta
                            : producto.precio;

                        return (
                            <Link
                                to="/detalle"
                                key={producto.id}
                                className="producto_tarjeta"
                                onClick={() => verDetalle(producto)}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="producto_imagen_contenedor">
                                    <img src="/assets/productos_radial_vector.png" className="producto_fondo_hover" alt="Fondo" />
                                    <img src={producto.imagenUrl || '/assets/producto_6.png'} className="producto_imagen" alt={producto.nombre} />

                                    {!tieneRol('ADMIN') && producto.stock > 0 && (
                                        <div className="botones_producto">
                                            <button className="btn_icono_agregar" disabled={cargando} onClick={(e) => agregarAlCarrito(producto, e)}>
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <h3 className="producto_titulo">{producto.nombre}</h3>
                                <p className="producto_precio">${(precioFinal || 0).toLocaleString('es-CL')}</p>
                                <p style={{ fontSize: '13px', color: producto.stock > 0 ? '#555' : 'crimson', margin: 0 }}>
                                    {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            )}
        </main>
    );
}

export default CatalogoGatos;