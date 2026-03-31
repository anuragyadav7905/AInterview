import { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const GoogleAuthSuccess = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const done = useRef(false);

    useEffect(() => {
        if (done.current) return;
        done.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token || token === 'undefined') {
            navigate('/login?error=google_failed', { replace: true });
            return;
        }

        // Store token then validate it via /api/auth/me
        localStorage.setItem('token', token);

        axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            const userData = { ...res.data, token };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            navigate('/dashboard', { replace: true });
        }).catch(() => {
            localStorage.removeItem('token');
            navigate('/login?error=google_failed', { replace: true });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-dark, #0a0e14)',
            color: 'var(--on-surface-variant, rgba(255,255,255,0.5))',
            fontSize: '1rem',
            gap: '12px'
        }}>
            <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                border: '2px solid var(--primary, #e08efe)',
                borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite'
            }} />
            Signing you in...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default GoogleAuthSuccess;
