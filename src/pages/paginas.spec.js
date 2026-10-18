import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Inicio from './Inicio';
import Login from './Login';
import Contacto from './Contacto';

describe('Páginas principales de PetSalud', () => {
    
    // Prueba 7
    it('La página de Inicio debería mostrar el texto de la historia de la tienda', () => {
        const { container } = render(
            <BrowserRouter>
                <Inicio />
            </BrowserRouter>
        );
        expect(container.textContent).toContain('Nuestra Historia');
    });

    // Prueba 8
    it('La página de Inicio debería contener el texto del origen de los productos', () => {
        const { container } = render(
            <BrowserRouter>
                <Inicio />
            </BrowserRouter>
        );
        expect(container.textContent).toContain('productos de origen casero');
    });

    // Prueba 9
    it('La página de Login debería contener los campos para el correo y contraseña', () => {
        const { container } = render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        expect(container.textContent).toContain('Correo electrónico:');
        expect(container.textContent).toContain('Contraseña:');
    });

    // Prueba 10
    it('La página de Contacto debería pedir el motivo del contacto', () => {
        const { container } = render(
            <BrowserRouter>
                <Contacto />
            </BrowserRouter>
        );
        expect(container.textContent).toContain('Selecciona el motivo del contacto');
    });
});