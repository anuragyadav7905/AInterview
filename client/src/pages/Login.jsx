import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(credentials.email, credentials.password);
            navigate('/dashboard');
        } catch (err) {
            setError(typeof err === 'string' ? err : 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--surface)' }}>
            <Card className="glass-card fade-in" style={{ width: '400px', borderTop: '4px solid var(--primary)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 className="display-md" style={{ fontSize: '2rem' }}>AInterview</h1>
                    <p style={{ color: 'var(--on-surface-variant)' }}>Sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label>Email Address</label>
                        <input type="email" name="email" value={credentials.email} onChange={handleChange} required placeholder="you@example.com" />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <div className="flex-between" style={{ marginBottom: '5px' }}>
                            <label style={{ margin: 0 }}>Password</label>
                            <Link to="/forgot-password" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem' }}>Forgot password?</Link>
                        </div>
                        <input type="password" name="password" value={credentials.password} onChange={handleChange} required placeholder="••••••••" />
                    </div>

                    {error && <div style={{ color: 'var(--tertiary)', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--on-surface-variant)' }}>New here? </span>
                    <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Create Account</Link>
                </div>
            </Card>
        </div>
    );
};

export default Login;
