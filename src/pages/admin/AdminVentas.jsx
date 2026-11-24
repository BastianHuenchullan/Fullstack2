import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listarTodasLasBoletas, cambiarEstadoBoleta, obtenerReporteResumen } from '../../services/ventasService';

function AdminVentas() {
    const { tieneRol } = useAuth();
    const [boletas, setBoletas] = useState([]);
    const [resumen, setResumen] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const cargarDatos = useCallback(async () => {
        try {
            setCargando(true);
            setError('');
            const [listaBoletas, dataResumen] = await Promise.all([
                listarTodasLasBoletas(),
                obtenerReporteResumen()
            ]);
            setBoletas(listaBoletas);
            setResumen(dataResumen);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const manejarCambioEstado = async (boletaId, nuevoEstado) => {
        if (nuevoEstado === 'ANULADA') {
            const confirmar = window.confirm(`¿Seguro que deseas anular la boleta #${boletaId}?`);
            if (!confirmar) return;
        }

        try {
            await cambiarEstadoBoleta(boletaId, nuevoEstado);
            await cargarDatos();
        } catch (err) {
            alert(`Error al actualizar estado: ${err.message}`);
        }
    };

    return (
        <main className="main_general" style={{ flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="titulo_seccion">Información de ventas</h2>

            <div className="caja_formularios" style={{ maxWidth: '1000px', flexDirection: 'column', gap: '15px', width: '100%' }}>
                {cargando && <p style={{ textAlign: 'center' }}>Cargando...</p>}
                {error && <p style={{ color: 'crimson', textAlign: 'center' }}>{error}</p>}

                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#2A3E47' }}>Lista de Boletas</h3>
                    {boletas.length === 0 && !cargando ? (
                        <p style={{ color: 'gray' }}>No hay boletas registradas.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #2A3E47', color: '#2A3E47' }}>
                                    <th style={{ padding: '8px' }}>ID</th>
                                    <th style={{ padding: '8px' }}>Cliente</th>
                                    <th style={{ padding: '8px' }}>Dirección</th>
                                    <th style={{ padding: '8px' }}>Producto</th>
                                    <th style={{ padding: '8px' }}>Cantidad</th>
                                    <th style={{ padding: '8px' }}>Total</th>
                                    <th style={{ padding: '8px' }}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boletas.map((b) => (
                                    <tr key={b.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px', fontWeight: 'bold' }}>#{b.id}</td>
                                        <td style={{ padding: '8px' }}>{b.nombre} {b.apellidos}</td>
                                        <td style={{ padding: '8px' }}>{b.calle}, {b.comuna}</td>
                                        <td style={{ padding: '8px' }}>
                                            {b.detalles?.map((det, idx) => (
                                                <div key={det.id || idx}>{det.nombreProducto}</div>
                                            ))}
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                            {b.detalles?.map((det, idx) => (
                                                <div key={det.id || idx}>{det.cantidad}</div>
                                            ))}
                                        </td>
                                        <td style={{ padding: '8px', fontWeight: 'bold' }}>${(b.total || 0).toLocaleString('es-CL')}</td>
                                        <td style={{ padding: '8px' }}>
                                            {tieneRol('ADMIN') ? (
                                                <select
                                                    className="input_formulario"
                                                    style={{ padding: '4px 8px', width: 'auto' }}
                                                    value={b.estado}
                                                    disabled={b.estado === 'ANULADA'}
                                                    onChange={(e) => manejarCambioEstado(b.id, e.target.value)}
                                                >
                                                    <option value="PAGADA">PAGADA</option>
                                                    <option value="ENVIADA">ENVIADA</option>
                                                    <option value="ANULADA">ANULADA</option>
                                                </select>
                                            ) : (
                                                <span>{b.estado}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {resumen && !cargando && (
                    <p style={{ textAlign: 'right', fontSize: '15px', color: '#2A3E47', margin: '5px 0 0 0' }}>
                        Total vendido: <strong>${(resumen.totalVendido || 0).toLocaleString('es-CL')} CLP</strong>
                    </p>
                )}
            </div>
        </main>
    );
}

export default AdminVentas;