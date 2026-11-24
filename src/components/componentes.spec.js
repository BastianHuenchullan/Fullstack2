import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';

describe('Elementos de los componentes Header y Footer)', () => {

    // Prueba 4
    it('El Header debería mostrar el boton del carrito', () => {
        const { container } = render(
            <AuthProvider>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </AuthProvider>
        );
        expect(container.textContent).toContain('Ver carrito');
    });

    // Prueba 5
    it('El Header debería mostrar los enlaces para Iniciar sesion y Registrarse', () => {
        const { container } = render(
            <AuthProvider>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </AuthProvider>
        );
        expect(container.textContent).toContain('Iniciar sesión');
        expect(container.textContent).toContain('Registrarse');
    });

    // Prueba 6
    it('El Footer debería mostrar los derechos de autor', () => {
        const { container } = render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
        expect(container.textContent).toContain('2026 PetSalud');
    });
});