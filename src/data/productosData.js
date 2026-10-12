let productos = [
    { id: 1, titulo: "ALFA DOG", precio: "$22.990", categoria: "perro", imagen: "producto_1.png", detalle: "Alimento completo Alfa Dog formulado para mantener la energía y salud de tu perro." },
    { id: 2, titulo: "BIRBO DOG", precio: "$18.990", categoria: "perro", imagen: "producto_2.png", detalle: "Nutrición premium Birbo para perros activos con alta dosis de proteínas." },
    { id: 3, titulo: "PEDIGREE", precio: "$24.500", categoria: "perro", imagen: "producto_3.png", detalle: "Pedigree adulto con trozos de carne reales y vegetales." },
    { id: 4, titulo: "CHAMPION DOG", precio: "$21.300", categoria: "perro", imagen: "producto_4.png", detalle: "Champion Dog especial para mejorar el pelaje y la digestión de tu mascota." },
    { id: 5, titulo: "CACHUPIN", precio: "$19.990", categoria: "perro", imagen: "producto_5.png", detalle: "Cachupin con fórmula reforzada de calcio para huesos sanos." },
    { id: 6, titulo: "CATCHOW", precio: "$19.990", categoria: "gato", imagen: "producto_6.png", detalle: "CatChow formulado para el cuidado urinario y control de peso de tu gato." },
    { id: 7, titulo: "WHISKAS", precio: "$17.500", categoria: "gato", imagen: "producto_7.png", detalle: "Whiskas sabor pescado, irresistible textura que tu gato amará." },
    { id: 8, titulo: "MASTER CAT", precio: "$20.100", categoria: "gato", imagen: "producto_8.png", detalle: "Master Cat para gatitos, ayuda al desarrollo del sistema inmune." }
];

export const obtenerProductos = () => productos;

export const obtenerProductosPorCategoria = (categoria) => {
    return productos.filter(producto => producto.categoria === categoria);
};


export const crearProducto = (nuevoProducto) => {
    productos.push(nuevoProducto);
};

export const actualizarProducto = (id, datosActualizados) => {
    productos = productos.map(producto => 
        producto.id === id ? { ...producto, ...datosActualizados } : producto
    );
};

export const eliminarProducto = (id) => {
    productos = productos.filter(producto => producto.id !== id);
};