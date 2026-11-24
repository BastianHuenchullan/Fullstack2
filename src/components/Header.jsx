import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario, autenticado, cargando, cerrarSesion, tieneRol } = useAuth();
    const [cantidadCarrito, setCantidadCarrito] = useState(0);

    const nombresRoles = {
        ADMIN: 'Admin',
        VENDEDOR: 'Vendedor',
        CLIENTE: 'Cliente'
    };

    useEffect(() => {
        const actualizarCarrito = () => {
            const items = JSON.parse(localStorage.getItem('carrito_items')) || [];
            setCantidadCarrito(items.length);
        };

        actualizarCarrito();
        window.addEventListener('storage', actualizarCarrito);
        return () => window.removeEventListener('storage', actualizarCarrito);
    }, [location.pathname]);

    const manejarCerrarSesion = () => {
        cerrarSesion();
        localStorage.removeItem('carrito_items');
        setCantidadCarrito(0);
        navigate('/', { replace: true });
    };

    const irCarrito = () => {
        if (!autenticado) {
            alert('Por favor, inicia sesión para ver el carrito.');
            navigate('/login');
        } else {
            navigate('/carrito');
        }
    };

    return (
        <header className="header_principal">
            <div className="header_izq" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {tieneRol('ADMIN') && (
                    <>
                        <button className="btn_carrito" onClick={() => navigate('/admin/usuarios')}>
                            Administrar usuarios
                        </button>
                        <button className="btn_carrito" onClick={() => navigate('/admin/productos')}>
                            Administrar productos
                        </button>
                    </>
                )}

                {!tieneRol('ADMIN', 'VENDEDOR') && (
                    <button className="btn_carrito" onClick={irCarrito} disabled={cargando}>
                        Ver carrito (<span>{cantidadCarrito}</span>)
                    </button>
                )}
            </div>

            <div className="header_centro">
                <Link to="/">
                    <img src="/assets/petsalud_logo.png" alt="PetSalud Logo" className="header_logo" />
                </Link>
            </div>

            <div className="header_der">
                <div className="enlaces_sesion">
                    {cargando ? (
                        <span>Cargando...</span>
                    ) : autenticado ? (
                        <>
                            <span>
                                ¡Hola, {usuario.nombre.split(' ')[0]}! ({nombresRoles[usuario.rol] || usuario.rol})
                            </span>

                            {tieneRol('CLIENTE') && (
                                <>
                                    <span className="separador_sesion">|</span>
                                    <Link to="/mis-compras">Mis compras</Link>
                                </>
                            )}

                            {tieneRol('ADMIN', 'VENDEDOR') && (
                                <>
                                    <span className="separador_sesion">|</span>
                                    <Link to="/admin/ventas">Información ventas</Link>
                                </>
                            )}

                            <span className="separador_sesion">|</span>

                            <button
                                type="button"
                                onClick={manejarCerrarSesion}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'inherit',
                                    font: 'inherit',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                Cerrar sesión
                            </button>
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