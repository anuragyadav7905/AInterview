import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex-center fade-in" style={{ height: '100vh', flexDirection: 'column', background: 'var(--surface)', color: 'var(--on-surface)' }}>
            <h1 style={{ 
                fontSize: '8rem', 
                fontWeight: 'bold', 
                margin: 0,
                background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1'
             }}>
                404
            </h1>
            <h2 className="display-sm" style={{ marginBottom: '20px' }}>Page Not Found</h2>
            <p style={{ color: 'var(--on-surface-variant)', marginBottom: '40px', maxWidth: '400px', textAlign: 'center' }}>
                The page you are looking for has been moved, deleted, or possibly never existed in this dimension.
            </p>
            <Link to="/">
                <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>Take Me Home 🚀</button>
            </Link>
        </div>
    );
};

export default NotFound;
