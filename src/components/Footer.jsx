import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer_principal">
            <div className="footer_columna">
                <p>© 2026 PetSalud. Todos los derechos reservados.</p>
            </div>
            <div className="footer_columna">
                <h4><Link to="/contacto" className="enlace_texto" style={{color: '#FAF8F2', fontWeight: 'bold'}}>Contáctanos &gt;</Link></h4>
                <p><img src="/assets/whatsapp_icon.png" alt="WhatsApp" className="icono_whatsapp" /> Escríbenos al +56 9 2135 5198 para más información.</p>
            </div>
            <div className="footer_columna">
                <h4>Encuéntranos en:</h4>
                <ul>
                    <li>Sucursal 1: Av. Quintero, Juan Laprieta 8291</li>
                    <li>Sucursal 2: Av. Caracól, Luka Yamil 2340</li>
                    <li>Sucursal 3: Av. Providencia, Pedro de Valdivia 1111</li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;