import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: '📊' },
        { label: 'Start Interview', path: '/interview-setup', icon: '🎤' },
        { label: 'History', path: '/history', icon: '📜' },
        { label: 'Progress', path: '/progress', icon: '📈' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: 'var(--bg-dark)',
                borderRight: '1px solid var(--glass-border)',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 10
            }}>
                <div style={{ marginBottom: '3rem', paddingLeft: '1rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AI Prep Pro</h1>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 1rem',
                                borderRadius: 'var(--radius-sm)',
                                textDecoration: 'none',
                                color: isActive(item.path) ? 'white' : 'var(--text-muted)',
                                background: isActive(item.path) ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.2) 0%, transparent 100%)' : 'transparent',
                                borderLeft: isActive(item.path) ? '3px solid var(--accent)' : '3px solid transparent',
                                transition: 'all 0.2s',
                                fontWeight: isActive(item.path) ? '600' : '400'
                            }}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 1rem', marginBottom: '1rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>User</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--danger)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: 'var(--radius-sm)',
                            textAlign: 'left',
                            paddingLeft: '1rem'
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: '260px', // Matches sidebar width
                padding: '2rem 3rem',
                overflowY: 'auto'
            }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
