import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
);

const Signup = () => {
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--surface)' }}>
            <Card className="glass-card fade-in" style={{ width: '400px', borderTop: '4px solid var(--secondary)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 className="display-md" style={{ fontSize: '2rem' }}>AInterview</h1>
                    <p style={{ color: 'var(--on-surface-variant)' }}>Start your journey today</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                    </div>

                    {error && <div style={{ color: 'var(--tertiary)', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }} />
                    <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }} />
                </div>

                <a
                    href={`${import.meta.env.VITE_API_BASE || 'http://localhost:5001'}/api/auth/google`}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        width: '100%', padding: '12px', borderRadius: '8px',
                        border: '1px solid var(--outline-variant)',
                        background: 'transparent', color: 'var(--on-surface)',
                        textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500',
                        cursor: 'pointer', transition: 'background 0.2s', boxSizing: 'border-box'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                    <GoogleIcon />
                    Continue with Google
                </a>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--on-surface-variant)' }}>Already have an account? </span>
                    <Link to="/login" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Login</Link>
                </div>
            </Card>
        </div>
    );
};

export default Signup;
