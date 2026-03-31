import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import axios from 'axios';

// In production VITE_API_BASE = https://your-render-app.onrender.com
// In development it's empty so Vite proxy handles /api calls
axios.defaults.baseURL = import.meta.env.VITE_API_BASE || '';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
