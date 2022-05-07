import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/index.css';

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('app'));

//ReactDOM.render(
root.render(
    <React.StrictMode>
                <App />
    </React.StrictMode>,
);

