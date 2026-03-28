import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('loading');
        setTimeout(() => setStatus('success'), 1200);
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--surface)' }}>
            <Card className="glass-card fade-in" style={{ width: '400px', borderTop: '4px solid var(--primary)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 className="display-sm" style={{ marginBottom: '10px' }}>Reset Password</h1>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📩</div>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Email Sent!</h3>
                        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '20px' }}>
                            Check your inbox for the reset link.
                        </p>
                        <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                            ← Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                placeholder="you@example.com" 
                            />
                        </div>

                        <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ width: '100%' }}>
                            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                            <Link to="/login" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>
                                Cancel
                            </Link>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default ForgotPassword;
