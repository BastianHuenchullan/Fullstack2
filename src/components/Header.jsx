import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [cantidadCarrito, setCantidadCarrito] = useState(0);

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario_actual'));
        if (usuario) {
            setUsuarioActual(usuario);
        }

        const elementos_carrito = JSON.parse(localStorage.getItem('carrito_items')) || [];
        setCantidadCarrito(elementos_carrito.length);
    }, []);

    const cerrarSesion = (e) => {
        e.preventDefault();
        localStorage.removeItem('usuario_actual');
        localStorage.removeItem('carrito_items');
        window.location.href = '/'; 
    };

    const irCarrito = () => {
        if (!usuarioActual) {
            alert("Por favor, inicia sesión para ver el carrito.");
        } else {
            navigate('/carrito');
        }
    };

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
                            <a href="#">
                                ¡Hola, {usuarioActual.nombre.split(' ')[0]} 
                                {usuarioActual.correo.endsWith('@petsalud.cl') ? ' (Admin)' : ''}!
                            </a>
                            <span className="separador_sesion">|</span>
                            <a href="#" onClick={cerrarSesion}>Cerrar sesión</a>
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