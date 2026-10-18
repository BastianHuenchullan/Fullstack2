import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Inicio() {
    // Usamos el "estado" para recordar si el video está visible (true) o escondido (false)
    const [mostrarVideo, setMostrarVideo] = useState(false);
    
    // Usamos otro "estado" para saber si estamos viendo la historia o la sección de mascotas
    const [vistaActual, setVistaActual] = useState('historia'); // puede ser 'historia' o 'categorias'

    return (
        <main className="main_general" style={{ flexDirection: 'column', width: '100%', marginBottom: 0, paddingBottom: 0 }}>
            
            {/* VISTA 1: HISTORIA */}
            {vistaActual === 'historia' && (
                <div id="inicio_vista_historia" style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <div className="inicio_seccion">
                            <div className="inicio_contenido">
                                <h2 className="inicio_subtitulo">Nuestra Historia</h2>
                                <p className="inicio_texto">
                                    PetSalud es un negocio que comenzó en 1924, gracias a una pareja que se dedicaba al cuidado de animales callejeros. Actualmente, nos dedicamos a vender productos de origen casero, con el fin de tener alimentos más saludables para tus mascotas y así traerles una mejor calidad de vida.
                                </p>
                                
                                {!mostrarVideo && (
                                    <button className="btn_texto_enlace" onClick={() => setMostrarVideo(true)}>
                                        Ver más
                                    </button>
                                )}
                                
                                {mostrarVideo && (
                                    <div id="video_contenedor">
                                        <div style={{ left: 0, width: '100%', height: 0, position: 'relative', paddingBottom: '56.25%' }}>
                                            <iframe src="https://player.vimeo.com/video/1115185300?title=0&byline=0&portrait=0" style={{ top: 0, left: 0, width: '100%', height: '100%', position: 'absolute', border: 0 }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                                        </div>
                                        <button className="btn_texto_enlace" style={{ marginTop: '15px' }} onClick={() => setMostrarVideo(false)}>
                                            Ver menos
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="inicio_perro">
                                <img src="/assets/principal_perro.png" alt="Perro de PetSalud" />
                            </div>
                        </div>
                    </div>

                    <div className="flecha_contenedor">
                        <img src="/assets/chevron_down_icon.png" alt="Bajar" className="flecha_scroll" onClick={() => setVistaActual('categorias')} />
                    </div>
                </div>
            )}

            {/* VISTA 2: CATEGORÍAS */}
            {vistaActual === 'categorias' && (
                <div id="inicio_vista_categorias" style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <section className="categorias_seccion">
                            <h2 className="inicio_subtitulo" style={{ marginBottom: 0 }}>Selecciona una mascota</h2>
                            <div className="categorias_grid">
                                <Link to="/perros" className="categoria_tarjeta">
                                    <img src="/assets/productos_perro.png" alt="Productos para Perros" />
                                    <h3>Perros</h3>
                                </Link>
                                <Link to="/gatos" className="categoria_tarjeta">
                                    <img src="/assets/productos_gato.png" alt="Productos para Gatos" />
                                    <h3>Gatos</h3>
                                </Link>
                            </div>
                        </section>
                    </div>

                    <div className="flecha_contenedor">
                        <img src="/assets/chevron_up_icon.png" alt="Subir" className="flecha_scroll" onClick={() => setVistaActual('historia')} />
                    </div>
                </div>
            )}
            
        </main>
    );
}

export default Inicio;