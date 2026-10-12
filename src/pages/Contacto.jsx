import React, { useState } from 'react';

function Contacto() {
    const [motivo, setMotivo] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [detalle, setDetalle] = useState('');

    const manejarSubmit = (e) => {
        e.preventDefault(); // Evitar que la página recargue al hacer clic en enviar
        
        const nom = nombre.trim();
        const ape = apellido.trim();
        const cor = correo.trim();
        const tel = telefono.trim();
        const ciu = ciudad.trim();
        const det = detalle.trim();

        if (!motivo) {
            alert("Por favor, selecciona un motivo de contacto.");
            return;
        }

        const regex_letras = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/; 
        const regex_correo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        const regex_telefono = /^[0-9]{9}$/; 

        if (nom.length < 3 || !regex_letras.test(nom)) {
            alert("El nombre debe tener al menos 3 caracteres y contener solo letras.");
            return;
        }

        if (ape.length < 3 || !regex_letras.test(ape)) {
            alert("El apellido debe tener al menos 3 caracteres y contener solo letras.");
            return;
        }

        if (!regex_correo.test(cor)) {
            alert("Por favor, ingresa un correo electrónico válido (ejemplo@gmail.com).");
            return;
        }

        if (!regex_telefono.test(tel)) {
            alert("El número de teléfono debe contener exactamente 9 dígitos numéricos (ej. 912345678).");
            return;
        }

        if (ciu.length < 3 || !regex_letras.test(ciu)) {
            alert("La ciudad debe tener al menos 3 caracteres y contener solo letras.");
            return;
        }

        if (det.length < 10) {
            alert("Por favor, detalla tu solicitud usando al menos 10 caracteres.");
            return;
        }

        alert("¡Tu mensaje se envió correctamente! Nos pondremos en contacto contigo pronto.");
        
        // Borrar datos
        setMotivo(''); setNombre(''); setApellido(''); setCorreo(''); setTelefono(''); setCiudad(''); setDetalle('');
    };

    return (
        <main className="main_general" style={{ flexDirection: 'column' }}>
            <h2 className="titulo_seccion">Rellena la información para contactarnos</h2>

            <div className="caja_formularios" style={{ alignItems: 'flex-start' }}>
                
                <div style={{ flex: 1, width: '100%' }}>
                    <h3 style={{ marginTop: 0, color: '#2A3E47' }}>Acerca de ti</h3>
                    
                    <label className="etiqueta_formulario">Selecciona el motivo del contacto*</label>
                    <select className="input_formulario" style={{ color: 'gray', marginBottom: '15px' }} value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                        <option value="" disabled>Selecciona una opción...</option>
                        <option value="reclamo" style={{ color: 'black' }}>Reclamo</option>
                        <option value="duda" style={{ color: 'black' }}>Duda sobre producto(s)</option>
                        <option value="felicitacion" style={{ color: 'black' }}>Otro motivo</option>
                    </select>

                    <div className="formulario_grid">
                        <div>
                            <label className="etiqueta_formulario">Nombre*</label>
                            <input type="text" className="input_formulario" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>
                        <div>
                            <label className="etiqueta_formulario">Apellido*</label>
                            <input type="text" className="input_formulario" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                        </div>
                        <div>
                            <label className="etiqueta_formulario">Correo electrónico*</label>
                            <input type="email" className="input_formulario" placeholder="ejemplo@gmail.com" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                        </div>
                        <div>
                            <label className="etiqueta_formulario">Número de teléfono*</label>
                            <input type="text" className="input_formulario" placeholder="Ej. 912345678" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        </div>
                        <div>
                            <label className="etiqueta_formulario">Ciudad*</label>
                            <input type="text" className="input_formulario" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                    <label className="etiqueta_formulario" style={{ marginTop: 0 }}>Detalla tu solicitud:*</label>
                    <textarea className="input_formulario" maxLength="1500" style={{ resize: 'none', flex: 1, marginBottom: '15px', minHeight: '150px' }} value={detalle} onChange={(e) => setDetalle(e.target.value)}></textarea>
                    
                    <button className="btn_principal" style={{ width: 'auto', alignSelf: 'flex-start' }} onClick={manejarSubmit}>Enviar</button>
                </div>
            </div>
        </main>
    );
}

export default Contacto;