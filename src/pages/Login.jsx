import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    useEffect(() => {
        const usuario_actual = JSON.parse(localStorage.getItem('usuario_actual'));
        if (usuario_actual) {
            navigate('/');
        }
    }, [navigate]);

    const manejarOlvido = (e) => {
        e.preventDefault();
        const correo_ingresado = prompt("Ingresa tu correo electrónico para recuperar tu contraseña:");
        
        if (correo_ingresado) {
            const partes = correo_ingresado.split('@');
            if (partes.length === 2) {
                const nombre_usuario = partes[0];
                const dominio = partes[1];
                
                if (nombre_usuario.length > 0) {
                    const ultima_letra = nombre_usuario.slice(-1);
                    const asteriscos = '*'.repeat(nombre_usuario.length - 1);
                    const correo_oculto = asteriscos + ultima_letra + '@' + dominio;
                    alert("Hemos enviado un correo a " + correo_oculto + " para restablecer tu contraseña.");
                } else { alert("Por favor, ingresa un correo válido."); }
            } else { alert("Por favor, ingresa un correo válido."); }
        }
    };

    const manejarSubmit = (e) => {
        e.preventDefault();
        
        if (correo.length <= 4 || contrasena.length <= 4) {
            alert("Todos los campos deben tener más de 4 caracteres.");
            return;
        }

        if (!correo.endsWith('@gmail.com') && !correo.endsWith('@hotmail.com') && !correo.endsWith('@petsalud.cl')) {
            alert("Correo y/o contraseña inválidos.");
            return;
        }

        let nombre_muestra = correo.split('@')[0];
        const nombre_capitalizado = nombre_muestra.charAt(0).toUpperCase() + nombre_muestra.slice(1);
        
        localStorage.setItem('usuario_actual', JSON.stringify({ nombre: nombre_capitalizado, correo: correo }));
        window.location.href = '/'; // Usamos window.location para forzar la recarga y que el Header lea el usuario
    };

    return (
        <main className="main_general" style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="titulo_seccion">Inicio de sesión</h2>
            
            <div className="caja_formularios" style={{ maxWidth: '500px', flexDirection: 'column', gap: '20px' }}>
                <form id="login_formulario" style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }} onSubmit={manejarSubmit}>
                    <div>
                        <label className="etiqueta_formulario">Correo electrónico:</label>
                        <input type="email" className="input_formulario" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    </div>
                    <div>
                        <label className="etiqueta_formulario">Contraseña:</label>
                        <input type="password" className="input_formulario" required value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                        <a href="#" className="enlace_secundario" style={{ textAlign: 'center', textDecoration: 'none' }} onClick={manejarOlvido}>¿Olvidaste tu contraseña?</a>
                        <button type="submit" className="btn_principal">Iniciar sesión</button>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <span style={{ fontSize: '14px' }}>¿Aún no te has registrado? </span>
                        <Link to="/registro" className="enlace_secundario">Regístrate aquí</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default Login;