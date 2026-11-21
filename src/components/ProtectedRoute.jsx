import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, roles = [] }) {

    const { usuario, autenticado, cargando } = useAuth();

    if (cargando) {
        return (
            <main
                className="main_general"
                style={{ justifyContent: 'center' }}
            >
                <p>Cargando sesión...</p>
            </main>
        );
    }

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    if (roles.length > 0 && !roles.includes(usuario.rol)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
