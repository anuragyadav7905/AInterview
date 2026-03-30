import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close sidebar when navigating on mobile
    useEffect(() => {
        if (isMobile) setSidebarOpen(false);
    }, [location.pathname, isMobile]);

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
            {/* Mobile overlay */}
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 9
                    }}
                />
            )}

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
                zIndex: 10,
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-260px)',
                transition: 'transform 0.25s ease'
            }}>
                <div style={{ marginBottom: '3rem', paddingLeft: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="display-md" style={{ fontSize: '1.5rem', margin: 0 }}>AInterview</h1>
                    {isMobile && (
                        <button
                            onClick={() => setSidebarOpen(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
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
                marginLeft: isMobile ? 0 : '260px',
                padding: 'var(--spacing-8) 3rem',
                overflowY: 'auto',
                transition: 'margin-left 0.25s ease'
            }}>
                {/* Mobile hamburger */}
                {isMobile && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            marginBottom: '1.5rem',
                            background: 'var(--surface-container-high)',
                            border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface)',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                        }}
                    >
                        ☰ Menu
                    </button>
                )}
                {children}
            </main>
        </div>
    );
};

export default Layout;
