import React, { useState, useEffect } from 'react';
import { obtenerMisBoletas } from '../services/ventasService';

function MisCompras() {
    const [boletas, setBoletas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        obtenerMisBoletas()
            .then(setBoletas)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    }, []);

    return (
        <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="titulo_seccion">Mis Compras</h2>

            <div className="caja_formularios" style={{ maxWidth: '750px', flexDirection: 'column', gap: '15px', width: '100%' }}>
                {cargando && <p style={{ textAlign: 'center' }}>Cargando compras...</p>}
                {error && <p style={{ color: 'crimson', textAlign: 'center' }}>{error}</p>}

                {!cargando && !error && boletas.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'gray' }}>Aún no tienes compras registradas.</p>
                )}

                {boletas.map((boleta) => (
                    <div key={boleta.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', width: '100%', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                            <div>
                                <strong style={{ color: '#2A3E47', fontSize: '18px' }}>Boleta #{boleta.id}</strong>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#555' }}>
                                    {new Date(boleta.fecha).toLocaleDateString('es-CL')} - Estado: <strong>{boleta.estado}</strong>
                                </p>
                            </div>
                            <strong style={{ color: '#2A3E47', fontSize: '18px' }}>
                                ${(boleta.total || 0).toLocaleString('es-CL')} CLP
                            </strong>
                        </div>

                        <p style={{ fontSize: '14px', color: '#444', margin: '8px 0' }}>
                            Dirección: {boleta.calle}, {boleta.comuna}
                        </p>

                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px', color: '#2A3E47' }}>
                            {boleta.detalles?.map((det, idx) => (
                                <li key={det.id || idx}>
                                    {det.nombreProducto} - {det.cantidad} x ${(det.precioUnitario || 0).toLocaleString('es-CL')} = ${(det.subtotal || 0).toLocaleString('es-CL')}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default MisCompras;