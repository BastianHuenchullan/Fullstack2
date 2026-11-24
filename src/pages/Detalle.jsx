import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Detalle() {
    const { autenticado, cargando, tieneRol } = useAuth();
    const [producto, setProducto] = useState(null);

    useEffect(() => {
        try {
            const guardado = JSON.parse(localStorage.getItem('detalle_producto'));
            if (guardado) setProducto(guardado);
        } catch {
            setProducto(null);
        }
    }, []);

    const agregarAlCarro = () => {
        if (!autenticado) {
            alert('Por favor, inicia sesión para añadir al carro.');
            return;
        }

        if (!tieneRol('CLIENTE') || !producto) {
            return;
        }

        if (producto.stock <= 0) {
            alert('Este producto no tiene stock disponible.');
            return;
        }

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

    if (!producto) {
        return (
            <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center' }}>
                <p>No se seleccionó ningún producto.</p>
            </main>
        );
    }

    const precioFinal = producto.enOferta && producto.precioOferta
        ? producto.precioOferta
        : producto.precio;

    return (
        <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="titulo_seccion" style={{ marginBottom: '20px' }}>
                {producto.nombre}
            </h2>

            <div className="caja_formularios" style={{ maxWidth: '800px', display: 'flex', gap: '40px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                    <img
                        src={producto.imagenUrl || '/assets/principal_perro.png'}
                        alt={producto.nombre}
                        style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                    />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p className="detalle_precio_texto">
                        Precio: ${(precioFinal || 0).toLocaleString('es-CL')} CLP
                    </p>
                    <p className="detalle_descripcion_texto">
                        {producto.descripcion || 'Sin descripción.'}
                    </p>
                    <p style={{ fontSize: '15px', color: '#555' }}>
                        Stock disponible: <strong>{producto.stock}</strong> unidades
                    </p>

                    {!tieneRol('ADMIN', 'VENDEDOR') && (
                        <button
                            className="btn_principal"
                            disabled={cargando || producto.stock <= 0}
                            onClick={agregarAlCarro}
                        >
                            {producto.stock > 0 ? 'Agregar al carro' : 'Sin stock'}
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Detalle;