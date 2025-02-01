import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa la nueva forma de ReactDOM en React 18
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Crea un root y renderiza el componente App
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
