import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: '📊' },
        { label: 'Start Interview', path: '/interview-setup', icon: '🎤' },
        { label: 'History', path: '/history', icon: '📜' },
        { label: 'Progress', path: '/progress', icon: '📈' },
        { label: 'Profile', path: '/profile', icon: '👤' },
        { label: 'Settings', path: '/settings', icon: '⚙️' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'var(--surface-bright)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                padding: 'var(--spacing-8) var(--spacing-4)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 10
            }}>
                <div style={{ marginBottom: '3rem', paddingLeft: '1rem' }}>
                    <h1 className="display-md" style={{ fontSize: '1.5rem', margin: 0 }}>AInterview</h1>
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
                                borderRadius: '0.75rem',
                                textDecoration: 'none',
                                color: isActive(item.path) ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                                background: isActive(item.path) ? 'rgba(224, 142, 254, 0.15)' : 'transparent',
                                borderLeft: isActive(item.path) ? '3px solid var(--primary)' : '3px solid transparent',
                                transition: 'all 0.2s',
                                fontWeight: isActive(item.path) ? '600' : '500'
                            }}
                        >
                            <span style={{ filter: isActive(item.path) ? 'drop-shadow(0 0 8px rgba(224,142,254,0.6))' : 'none' }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: 'var(--spacing-8) 3rem',
                overflowY: 'auto'
            }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
