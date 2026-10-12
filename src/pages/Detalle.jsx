import React, { useState, useEffect } from 'react';

function Detalle() {
    const [producto, setProducto] = useState({
        titulo: 'Producto desconocido',
        precio: '$0',
        imagen: '/assets/principal_perro.png',
        descripcion: 'Este producto no tiene descripción.'
    });

    useEffect(() => {
        setProducto({
            titulo: localStorage.getItem('detalle_titulo') || 'Producto Desconocido',
            precio: localStorage.getItem('detalle_precio') || '$0',
            imagen: localStorage.getItem('detalle_imagen') || '/assets/principal_perro.png',
            descripcion: localStorage.getItem('detalle_descripcion') || 'Este producto no tiene descripción.'
        });
    }, []);

    const agregarAlCarro = () => {
        const usuario_actual = JSON.parse(localStorage.getItem('usuario_actual'));
        if (!usuario_actual) {
            alert("Por favor, inicia sesión para añadir al carro.");
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

    return (
        <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="titulo_seccion" style={{ marginBottom: '20px' }}>{producto.titulo}</h2>
            
            <div className="caja_formularios" style={{ maxWidth: '800px', display: 'flex', gap: '40px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                    <img src={producto.imagen} alt="Producto" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p className="detalle_precio_texto">Precio: {producto.precio}</p>
                    <p className="detalle_descripcion_texto">{producto.descripcion}</p>
                    
                    <button className="btn_principal" onClick={agregarAlCarro}>Agregar al carro</button>
                </div>
            </div>
        </main>
    );
}

export default Detalle;