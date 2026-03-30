import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { loading } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-dark, #0a0e14)',
                color: 'var(--on-surface-variant, rgba(255,255,255,0.5))',
                fontSize: '1rem'
            }}>
                Loading...
            </div>
        );
    }

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
