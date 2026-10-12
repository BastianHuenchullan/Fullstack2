import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Carrito() {
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const usuario_actual = JSON.parse(localStorage.getItem('usuario_actual'));
        if (!usuario_actual) {
            alert("Debes iniciar sesión para acceder al carrito.");
            navigate('/login');
        } else {
            cargarCarrito();
        }
    }, [navigate]);

    const cargarCarrito = () => {
        const items = JSON.parse(localStorage.getItem('carrito_items')) || [];
        setCarrito(items);
        
        // Calcular total
        let suma = 0;
        items.forEach(item => {
            let valor_numerico = parseInt(item.precio.replace('$', '').replace('.', '')) || 0;
            suma += valor_numerico;
        });
        setTotal(suma);
    };

    const eliminarProducto = (index) => {
        const itemsActualizados = [...carrito];
        itemsActualizados.splice(index, 1); // Borrar un elemento
        localStorage.setItem('carrito_items', JSON.stringify(itemsActualizados));
        cargarCarrito(); // Recargar info visual
        window.dispatchEvent(new Event("storage"));
    };

    const realizarCompra = () => {
        if (carrito.length === 0) { 
            alert("No tienes productos en el carro para comprar."); 
            return; 
        }
        alert("¡Compra procesada con éxito! Volviendo al inicio...");
        localStorage.removeItem('carrito_items');
        window.location.href = '/';
    };

    return (
        <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="titulo_seccion">Tu Carrito de Compras</h2>
            
            <div className="caja_formularios" style={{ maxWidth: '600px', flexDirection: 'column', gap: '20px', width: '100%' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                    {carrito.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'gray', fontSize: '18px' }}>El carro está vacío.</p>
                    ) : (
                        carrito.map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                                <span style={{ fontWeight: 'bold', color: '#2A3E47', fontSize: '18px', flex: 1 }}>{item.titulo}</span>
                                <span style={{ color: '#2A3E47', fontSize: '18px', marginRight: '15px' }}>{item.precio}</span>
                                <button className="btn_icono_agregar" style={{ width: '25px', height: '25px', fontSize: '20px', lineHeight: 0, paddingBottom: '4px' }} onClick={() => eliminarProducto(index)}>
                                    -
                                </button>
                            </div>
                        ))
                    )}
                </div>
                
                <hr style={{ width: '100%', border: '1px solid #141414', margin: '10px 0' }} />
                
                <div style={{ textAlign: 'right', width: '100%' }}>
                    <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#2A3E47', margin: 0 }}>
                        Total: ${total.toLocaleString('es-CL')} CLP
                    </p>
                </div>
                
                <button className="btn_principal" style={{ marginTop: '15px' }} onClick={realizarCompra}>Comprar</button>
            </div>
        </main>
    );
}

export default Carrito;