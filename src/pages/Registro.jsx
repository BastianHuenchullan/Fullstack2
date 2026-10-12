import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Registro() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena1, setContrasena1] = useState('');
    const [contrasena2, setContrasena2] = useState('');

    useEffect(() => {
        const usuario_actual = JSON.parse(localStorage.getItem('usuario_actual'));
        if (usuario_actual) navigate('/');
    }, [navigate]);

    const manejarSubmit = (e) => {
        e.preventDefault();
        
        if (nombre.length <= 4 || apellido.length <= 4 || correo.length <= 4 || contrasena1.length <= 4) {
            alert("Todos los campos deben tener más de 4 caracteres.");
            return;
        }

        if (!correo.endsWith('@gmail.com') && !correo.endsWith('@hotmail.com') && !correo.endsWith('@petsalud.cl')) {
            alert("Correo inválido.");
            return;
        }

        if (contrasena1 !== contrasena2) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const tiene_mayuscula = /[A-Z]/.test(contrasena1);
        const tiene_numero = /[0-9]/.test(contrasena1);
        
        if (!tiene_mayuscula || !tiene_numero) {
            alert("La contraseña debe contener al menos una letra mayúscula y un número.");
            return;
        }

        const nombre_capitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
        localStorage.setItem('usuario_actual', JSON.stringify({ nombre: nombre_capitalizado, correo: correo }));
        window.location.href = '/'; 
    };

    return (
        <main className="main_general" style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="titulo_seccion">Registro de usuario</h2>
            
            <div className="caja_formularios" style={{ maxWidth: '500px', flexDirection: 'column', gap: '20px' }}>
                <form id="registro_formulario" style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }} onSubmit={manejarSubmit}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <Link to="/login" className="enlace_secundario" style={{ fontSize: '14px' }}>¿Ya estás registrado? Inicia sesión</Link>
                    </div>

                    <div>
                        <label className="etiqueta_formulario">Nombre:</label>
                        <input type="text" className="input_formulario" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    <div>
                        <label className="etiqueta_formulario">Apellido:</label>
                        <input type="text" className="input_formulario" required value={apellido} onChange={(e) => setApellido(e.target.value)} />
                    </div>
                    <div>
                        <label className="etiqueta_formulario">Correo Electrónico:</label>
                        <input type="email" className="input_formulario" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    </div>
                    <div>
                        <label className="etiqueta_formulario">Contraseña:</label>
                        <input type="password" className="input_formulario" required value={contrasena1} onChange={(e) => setContrasena1(e.target.value)} />
                    </div>
                    <div>
                        <label className="etiqueta_formulario">Repetir contraseña:</label>
                        <input type="password" className="input_formulario" required value={contrasena2} onChange={(e) => setContrasena2(e.target.value)} />
                    </div>
                    
                    <div style={{ marginTop: '10px' }}>
                        <label style={{ fontSize: '14px' }}>
                            <input type="checkbox" required /> Aceptas las <a href="#" className="enlace_secundario">políticas y términos</a> de PetSalud
                        </label>
                    </div>
                    
                    <div style={{ marginTop: '10px' }}>
                        <button type="submit" className="btn_principal">Registrarse</button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default Registro;