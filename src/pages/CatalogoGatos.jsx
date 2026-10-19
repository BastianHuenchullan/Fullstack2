import React from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductosPorCategoria } from '../data/productosData';

function CatalogoGatos() {
    const gatos = obtenerProductosPorCategoria('gato');

    const agregarAlCarrito = (producto, e) => {
        e.preventDefault();
        e.stopPropagation();

        const usuario_actual = JSON.parse(localStorage.getItem('usuario_actual'));
        if (!usuario_actual) {
            alert("Por favor, inicia sesión para añadir al carrito.");
            return;
        }

        const elementos_carrito = JSON.parse(localStorage.getItem('carrito_items')) || [];
        if (elementos_carrito.length < 10) {
            elementos_carrito.push(producto);
            localStorage.setItem('carrito_items', JSON.stringify(elementos_carrito));
            alert("¡Producto agregado al carro con éxito!");
            window.location.reload(); 
        } else {
            alert("Límite máximo de 10 artículos en el carrito.");
        }
    };

    const verDetalle = (producto) => {
        localStorage.setItem('detalle_titulo', producto.titulo);
        localStorage.setItem('detalle_precio', producto.precio);
        localStorage.setItem('detalle_imagen', `/assets/${producto.imagen}`);
        localStorage.setItem('detalle_descripcion', producto.detalle);
    };

    return (
        <main className="main_productos">
            <h2 className="titulo_seccion">Productos de gatos</h2>

            <div className="productos_grid">
                {gatos.map((producto) => (
                    <Link to="/detalle" key={producto.id} className="producto_tarjeta" onClick={() => verDetalle(producto)} style={{ textDecoration: 'none' }}>
                        <div className="producto_imagen_contenedor">
                            <img src="/assets/productos_radial_vector.png" className="producto_fondo_hover" alt="Fondo" />
                            <img src={`/assets/${producto.imagen}`} className="producto_imagen" alt={producto.titulo} />
                            <div className="botones_producto">
                                <button className="btn_icono_agregar" onClick={(e) => agregarAlCarrito(producto, e)}>+</button>
                            </div>
                        </div>
                        <h3 className="producto_titulo">{producto.titulo}</h3>
                        <p className="producto_precio">{producto.precio}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}

export default CatalogoGatos;
