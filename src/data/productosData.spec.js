import { obtenerProductos, obtenerProductosPorCategoria } from './productosData';

describe('Lista de productos', () => {
    
    // Prueba 1
    it('Debería cargar al menos un producto en la lista', () => {
        const productos = obtenerProductos();
        expect(productos.length).toBeGreaterThan(0);
    });

    // Prueba 2
    it('Filtra los productos por la categoria perro', () => {
        const perros = obtenerProductosPorCategoria('perro');
        expect(perros[0].categoria).toBe('perro');
    });

    // Prueba 3
    it('Filtra los productos por la categoria gato', () => {
        const gatos = obtenerProductosPorCategoria('gato');
        expect(gatos[0].categoria).toBe('gato');
    });
});