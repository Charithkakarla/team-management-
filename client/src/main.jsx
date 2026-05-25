// Client entry point: mounts the React app into the page.
// It starts React and renders the top-level App component.
// Use this file to understand how the frontend begins.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
