
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Detalle() {

    const { autenticado, cargando, tieneRol } = useAuth();

    const [producto, setProducto] = useState({
        titulo: 'Producto desconocido',
        precio: '$0',
        imagen: '/assets/principal_perro.png',
        descripcion: 'Este producto no tiene descripción.'
    });

    useEffect(() => {
        setProducto({
            titulo:
                localStorage.getItem('detalle_titulo') ||
                'Producto desconocido',

            precio:
                localStorage.getItem('detalle_precio') ||
                '$0',

            imagen:
                localStorage.getItem('detalle_imagen') ||
                '/assets/principal_perro.png',

            descripcion:
                localStorage.getItem('detalle_descripcion') ||
                'Este producto no tiene descripción.'
        });
    }, []);

    const agregarAlCarro = () => {

        if (!autenticado) {
            alert('Por favor, inicia sesión para añadir al carro.');
            return;
        }

        if (!tieneRol('CLIENTE')) {
            return;
        }

        const elementosCarrito =
            JSON.parse(localStorage.getItem('carrito_items')) || [];

        if (elementosCarrito.length < 10) {
            elementosCarrito.push(producto);

            localStorage.setItem(
                'carrito_items',
                JSON.stringify(elementosCarrito)
            );

            alert('¡Producto agregado al carro con éxito!');
            window.location.reload();

        } else {
            alert('Límite máximo de 10 artículos en el carrito.');
        }
    };

    return (
        <main
            className="main_general"
            style={{
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <h2
                className="titulo_seccion"
                style={{ marginBottom: '20px' }}
            >
                {producto.titulo}
            </h2>

            <div
                className="caja_formularios"
                style={{
                    maxWidth: '800px',
                    display: 'flex',
                    gap: '40px',
                    alignItems: 'center'
                }}
            >
                <div style={{ textAlign: 'center', flex: 1 }}>
                    <img
                        src={producto.imagen}
                        alt={producto.titulo}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            objectFit: 'contain'
                        }}
                    />
                </div>

                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    <p className="detalle_precio_texto">
                        Precio: {producto.precio}
                    </p>

                    <p className="detalle_descripcion_texto">
                        {producto.descripcion}
                    </p>

                    {!tieneRol('ADMIN') && (
                        <button
                            className="btn_principal"
                            disabled={cargando}
                            onClick={agregarAlCarro}
                        >
                            Agregar al carro
                        </button>
                    )}

                </div>
            </div>
        </main>
    );
}

export default Detalle;
