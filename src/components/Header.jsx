import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [cantidadCarrito, setCantidadCarrito] = useState(0);

    const actualizarContadorCarrito = () => {
        const elementos_carrito = JSON.parse(localStorage.getItem('carrito_items')) || [];
        setCantidadCarrito(elementos_carrito.length);
    };

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario_actual'));
        if (usuario) {
            setUsuarioActual(usuario);
        }

        actualizarContadorCarrito();
        window.addEventListener('storage', actualizarContadorCarrito);
        return () => window.removeEventListener('storage', actualizarContadorCarrito);
    }, []);

    const cerrarSesion = (e) => {
        e.preventDefault();
        localStorage.removeItem('usuario_actual');
        localStorage.removeItem('carrito_items');
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        window.location.href = '/';
    };

    const irCarrito = () => {
        if (!usuarioActual) {
            alert("Por favor, inicia sesión para ver el carrito.");
        } else {
            navigate('/carrito');
        }
    };

    const esAdmin = usuarioActual?.rol === 'ADMIN' || usuarioActual?.correo?.endsWith('@petsalud.cl');

    return (
        <header className="header_principal">
            <div className="header_izq">
                <button className="btn_carrito" onClick={irCarrito}>
                    Ver carrito (<span>{cantidadCarrito}</span>)
                </button>
            </div>
            <div className="header_centro">
                <Link to="/">
                    <img src="/assets/petsalud_logo.png" alt="PetSalud Logo" className="header_logo" />
                </Link>
            </div>
            <div className="header_der">
                <div className="enlaces_sesion">
                    {usuarioActual ? (
                        <>
                            <span>
                                ¡Hola, {usuarioActual.nombre.split(' ')[0]}
                                {esAdmin ? ' (Admin)' : ''}!
                            </span>
                            <span className="separador_sesion">|</span>
                            <Link to="/mis-compras">Mis compras</Link>
                            {esAdmin && (
                                <>
                                    <span className="separador_sesion">|</span>
                                    <Link to="/admin/ventas">Ventas</Link>
                                </>
                            )}
                            <span className="separador_sesion">|</span>
                            <a href="#logout" onClick={cerrarSesion}>Cerrar sesión</a>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Iniciar sesión</Link>
                            <span className="separador_sesion">|</span>
                            <Link to="/registro">Registrarse</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;