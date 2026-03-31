import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const [cv, setCv] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        Promise.allSettled([
            axios.get('/api/upload-cv/latest', { headers }),
            axios.get('/api/upload-cv/suggestions', { headers })
        ]).then(([cvRes, suggestionsRes]) => {
            if (cvRes.status === 'fulfilled') setCv(cvRes.value.data);
            if (suggestionsRes.status === 'fulfilled') setSuggestions(suggestionsRes.value.data || []);
        }).finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const displayName = cv?.structuredData?.name || user?.username || 'User Name';
    const displayEmail = cv?.structuredData?.email || user?.email || 'user@example.com';

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
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 'bold', color: 'white',
                        flexShrink: 0, boxShadow: '0 0 20px rgba(224,142,254,0.3)'
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
                        <button className="btn-primary" onClick={() => navigate('/interview-setup')} style={{ width: '100%', padding: '12px' }}>
                            🎤 Start Interview
                        </button>
                        <button className="btn-outline" onClick={() => navigate('/interview-setup')} style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}>
                            📄 Upload New CV
                        </button>
                        <button className="btn-outline" onClick={() => navigate('/history')} style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}>
                            📜 View History
                        </button>
                    </div>
                </Card>
            </div>

            {/* CV Suggestions Card */}
            {cv && (
                <Card title="CV Improvement Suggestions" style={{ marginBottom: '20px' }}>
                    {suggestions.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
                            <span style={{ fontSize: '1.4rem' }}>✓</span>
                            <span>Your CV looks strong — no major issues detected based on your interview history.</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {suggestions.map((s, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    gap: '14px',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,132,170,0.05)',
                                    border: '1px solid rgba(255,132,170,0.15)'
                                }}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                                        background: 'rgba(255,132,170,0.12)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', fontWeight: '700', color: 'var(--tertiary, #ff84aa)'
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--tertiary, #ff84aa)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                                            {s.section}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: '1.5' }}>
                                            {s.tip}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}

            {/* Sign Out */}
            <Card className="glass-card" style={{ border: '1px solid rgba(255, 132, 170, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>Sign Out</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>You'll be redirected to the login page.</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'rgba(255, 132, 170, 0.1)', color: 'var(--tertiary)',
                            border: '1px solid rgba(255, 132, 170, 0.3)', borderRadius: '0.75rem',
                            padding: '10px 20px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem'
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
