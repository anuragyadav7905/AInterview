import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    
    const [cv, setCv] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCV = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/upload-cv/latest', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCv(res.data);
            } catch (err) {
                // No CV uploaded yet
                setCv(null);
            } finally {
                setLoading(false);
            }
        };
        fetchCV();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const displayName = cv?.structuredData?.name || user?.username || 'User Name';
    const displayEmail = cv?.structuredData?.email || user?.email || 'user@example.com';

    // Skills is a raw text section — split into chips for display
    const rawSkills = cv?.structuredData?.skills || '';
    const displaySkills = rawSkills
        ? rawSkills.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 40).slice(0, 10)
        : [];
    const displayExperience = cv?.structuredData?.experience || null;

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="display-md" style={{ marginBottom: '30px' }}>Profile</h1>

            {/* Profile Info Card */}
            <Card className="glass-card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: 'white',
                        flexShrink: 0,
                        boxShadow: '0 0 20px rgba(224,142,254,0.3)'
                    }}>
                        {displayName.charAt(0).toUpperCase()}
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Full Name</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{displayName}</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email Address</div>
                            <div style={{ fontSize: '1rem' }}>{displayEmail}</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>CV Status</div>
                            <div style={{ fontSize: '1rem', color: cv ? 'var(--primary)' : 'var(--on-surface-variant)' }}>
                                {loading ? 'Loading...' : cv ? `✓ CV uploaded — ${cv.fileName}` : 'No CV uploaded yet'}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* From Your CV & Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <Card title="From Your CV">
                    {cv ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', marginBottom: '8px' }}>Skills Detected</div>
                                {displaySkills.length > 0 ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {displaySkills.map((skill, i) => (
                                            <span key={i} style={{ background: 'rgba(224,142,254,0.1)', border: '1px solid rgba(224,142,254,0.2)', color: 'var(--primary)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>No skills section detected in CV</div>
                                )}
                            </div>
                            {displayExperience && (
                                <div>
                                    <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', marginBottom: '4px' }}>Experience</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: '1.5', maxHeight: '80px', overflow: 'hidden' }}>
                                        {displayExperience}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>Upload a CV to see parsed data here.</p>
                    )}
                </Card>

                <Card title="Quick Actions">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/interview-setup')}
                            style={{ width: '100%', padding: '12px' }}
                        >
                            🎤 Start Interview
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() => navigate('/interview-setup')}
                            style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
                        >
                            📄 Upload New CV
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() => navigate('/history')}
                            style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
                        >
                            📜 View History
                        </button>
                    </div>
                </Card>
            </div>

            {/* Logout Button */}
            <Card className="glass-card" style={{ border: '1px solid rgba(255, 132, 170, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>Sign Out</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>You'll be redirected to the login page.</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'rgba(255, 132, 170, 0.1)',
                            color: 'var(--tertiary)',
                            border: '1px solid rgba(255, 132, 170, 0.3)',
                            borderRadius: '0.75rem',
                            padding: '10px 20px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
