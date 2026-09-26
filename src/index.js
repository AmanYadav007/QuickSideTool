import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Brand stand-in for Axiforma: Regular, Medium and Semi Bold only
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);