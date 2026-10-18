import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Contacto from './pages/Contacto';
import CatalogoPerros from './pages/CatalogoPerros';
import CatalogoGatos from './pages/CatalogoGatos';
import Detalle from './pages/Detalle';
import Carrito from './pages/Carrito';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Main>
        <Routes>
          <Route path="/" element={<Inicio />}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/registro" element={<Registro/>}/>
          <Route path="/contacto" element={<Contacto/>}/>
          <Route path="/perros" element={<CatalogoPerros/>}/>
          <Route path="/gatos" element={<CatalogoGatos/>}/>
          <Route path="/detalle" element={<Detalle/>}/>
          <Route path="/carrito" element={<Carrito/>}/>
        </Routes>
      </Main>
    </BrowserRouter>
  );
}

export default App;