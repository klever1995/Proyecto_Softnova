import React from 'react';
import './App.css';
import Clientes from './Clientes';
import DireccionesCliente from './DireccionesCliente'; // Asegúrate de importar el componente DireccionesCliente
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Importa lo necesario para manejar rutas

function App() {
  return (
    <BrowserRouter> {/* Envolver la aplicación en BrowserRouter */}
      <div className="App">
        <h1>Geoclientes</h1>
        {/* Define las rutas */}
        <Routes>
          <Route path="/" element={<Clientes />} /> {/* Página principal con Clientes */}
          <Route path="/clientes/:id/direcciones" element={<DireccionesCliente />} /> {/* Ruta para ver direcciones de un cliente */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
