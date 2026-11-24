import React, { useState, useEffect, useCallback } from 'react';
import { listarTodasLasBoletas, cambiarEstadoBoleta, obtenerReporteResumen } from '../services/ventasService';

function AdminVentas() {
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
            const confirmar = window.confirm(`¿Seguro que deseas ANULAR la boleta #${boletaId}? Esto repondrá el stock en inventario.`);
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
            <h2 className="titulo_seccion">Gestión de Ventas y Reportes</h2>

            <div className="caja_formularios" style={{ maxWidth: '950px', flexDirection: 'column', gap: '25px', width: '100%' }}>
                {cargando && <p style={{ textAlign: 'center' }}>Cargando métricas y boletas...</p>}
                {error && <p style={{ color: 'crimson', textAlign: 'center' }}>{error}</p>}

                {resumen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
                                <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>Total Vendido</p>
                                <h3 style={{ margin: '8px 0 0 0', color: '#2A3E47', fontSize: '22px' }}>
                                    ${(resumen.totalVendido || 0).toLocaleString('es-CL')} CLP
                                </h3>
                            </div>
                            <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
                                <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>Boletas Válidas</p>
                                <h3 style={{ margin: '8px 0 0 0', color: '#2A3E47', fontSize: '22px' }}>
                                    {resumen.cantidadBoletas || 0}
                                </h3>
                            </div>
                            <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
                                <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>Ticket Promedio</p>
                                <h3 style={{ margin: '8px 0 0 0', color: '#2A3E47', fontSize: '22px' }}>
                                    ${Math.round(resumen.ticketPromedio || 0).toLocaleString('es-CL')} CLP
                                </h3>
                            </div>
                        </div>

                        {resumen.topProductos && resumen.topProductos.length > 0 && (
                            <div>
                                <h3 style={{ margin: '0 0 10px 0', color: '#2A3E47' }}>Top Productos Más Vendidos</h3>
                                <ul style={{ margin: 0, paddingLeft: '20px', color: '#2A3E47' }}>
                                    {resumen.topProductos.map((prod) => (
                                        <li key={prod.productoId}>
                                            <strong>{prod.nombreProducto}</strong>: {prod.cantidadVendida} unidades (${(prod.totalGenerado || 0).toLocaleString('es-CL')} CLP)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <hr style={{ width: '100%', border: '1px solid #141414' }} />

                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#2A3E47' }}>Listado General de Boletas</h3>
                    {boletas.length === 0 && !cargando ? (
                        <p style={{ color: 'gray' }}>No hay boletas registradas.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #2A3E47', color: '#2A3E47' }}>
                                    <th style={{ padding: '8px' }}>ID</th>
                                    <th style={{ padding: '8px' }}>Cliente</th>
                                    <th style={{ padding: '8px' }}>Comuna</th>
                                    <th style={{ padding: '8px' }}>Total</th>
                                    <th style={{ padding: '8px' }}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boletas.map((b) => (
                                    <tr key={b.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px', fontWeight: 'bold' }}>#{b.id}</td>
                                        <td style={{ padding: '8px' }}>{b.nombre} {b.apellidos}<br /><small>{b.correo}</small></td>
                                        <td style={{ padding: '8px' }}>{b.comuna}</td>
                                        <td style={{ padding: '8px', fontWeight: 'bold' }}>${(b.total || 0).toLocaleString('es-CL')}</td>
                                        <td style={{ padding: '8px' }}>
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </main>
    );
}

export default AdminVentas;