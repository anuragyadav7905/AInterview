import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-dark, #0a0e14)',
                    color: '#fff',
                    gap: '16px',
                    padding: '40px'
                }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--primary, #e08efe)' }}>Something went wrong</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                        An unexpected error occurred. Please refresh the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            background: 'var(--primary, #e08efe)',
                            border: 'none',
                            color: '#000',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Refresh
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
