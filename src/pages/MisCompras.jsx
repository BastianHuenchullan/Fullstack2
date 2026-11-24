import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerMisBoletas } from '../services/ventasService';

function MisCompras() {
    const { autenticado, cargando: cargandoSesion } = useAuth();
    const [boletas, setBoletas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (cargandoSesion || !autenticado) return;

        const cargar = async () => {
            try {
                const data = await obtenerMisBoletas();
                setBoletas(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        cargar();
    }, [autenticado, cargandoSesion]);

    return (
        <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="titulo_seccion">Mis Compras</h2>

            <div className="caja_formularios" style={{ maxWidth: '800px', flexDirection: 'column', gap: '20px', width: '100%' }}>
                {cargando && <p style={{ textAlign: 'center' }}>Cargando historial de boletas...</p>}
                {error && <p style={{ color: 'crimson', textAlign: 'center' }}>{error}</p>}

                {!cargando && !error && boletas.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'gray' }}>Aún no has realizado compras registradas en tu cuenta.</p>
                )}

                {boletas.map((boleta) => (
                    <div key={boleta.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', width: '100%', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <div>
                                <strong style={{ color: '#2A3E47', fontSize: '18px' }}>Boleta #{boleta.id}</strong>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#555' }}>
                                    Fecha: {boleta.fecha ? new Date(boleta.fecha).toLocaleString('es-CL') : 'Reciente'}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    backgroundColor: boleta.estado === 'ANULADA' ? '#fdecea' : '#e8f5e9',
                                    color: boleta.estado === 'ANULADA' ? '#b71c1c' : '#1b5e20'
                                }}>
                                    {boleta.estado}
                                </span>
                                <p style={{ margin: '6px 0 0 0', fontWeight: 'bold', color: '#2A3E47', fontSize: '17px' }}>
                                    Total: ${(boleta.total || 0).toLocaleString('es-CL')} CLP
                                </p>
                            </div>
                        </div>

                        <p style={{ fontSize: '14px', color: '#444', margin: '10px 0' }}>
                            <strong>Envío a:</strong> {boleta.calle}{boleta.departamento ? `, ${boleta.departamento}` : ''}, {boleta.comuna}, {boleta.region}
                        </p>

                        {boleta.detalles && boleta.detalles.length > 0 && (
                            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '15px', color: '#2A3E47' }}>
                                {boleta.detalles.map((det, idx) => (
                                    <li key={det.id || idx}>
                                        {det.nombreProducto} — {det.cantidad} unid. x ${(det.precioUnitario || 0).toLocaleString('es-CL')} = <strong>${(det.subtotal || 0).toLocaleString('es-CL')}</strong>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}

export default MisCompras;