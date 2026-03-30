import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';

const Profile = () => {
    const { user } = useContext(AuthContext);
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
                // No CV uploaded yet, that's fine
                setCv(null);
            } finally {
                setLoading(false);
            }
        };
        fetchCV();
    }, []);

    const displayName = cv?.structuredData?.name 
        || user?.username 
        || 'User';
    const displayEmail = cv?.structuredData?.email 
        || user?.email 
        || 'No email found';
    const displaySkills = cv?.structuredData?.skills 
        || 'No skills parsed yet';
    const displayExperience = cv?.structuredData?.experience 
        ? 'Experience found in CV' 
        : 'No experience data';

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="display-md" style={{ marginBottom: '30px' }}>
                Profile
            </h1>

            {/* Top Profile Card */}
            <Card style={{ 
                display: 'flex', 
                gap: '40px', 
                alignItems: 'center', 
                padding: '40px',
                marginBottom: '20px'
            }}>
                {/* Default SVG Avatar */}
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    flexShrink: 0,
                    boxShadow: '0 0 20px rgba(224,142,254,0.3)'
                }}>
                    {displayName.charAt(0).toUpperCase()}
                </div>

                <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px' 
                }}>
                    <div>
                        <div style={{ 
                            color: 'var(--on-surface-variant)', 
                            fontSize: '0.75rem', 
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '4px'
                        }}>
                            Full Name
                        </div>
                        <div style={{ 
                            fontSize: '1.3rem', 
                            fontWeight: 'bold' 
                        }}>
                            {displayName}
                        </div>
                    </div>
                    <div>
                        <div style={{ 
                            color: 'var(--on-surface-variant)', 
                            fontSize: '0.75rem', 
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '4px'
                        }}>
                            Email Address
                        </div>
                        <div style={{ fontSize: '1rem' }}>
                            {displayEmail}
                        </div>
                    </div>
                    <div>
                        <div style={{ 
                            color: 'var(--on-surface-variant)', 
                            fontSize: '0.75rem', 
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '4px'
                        }}>
                            CV Status
                        </div>
                        <div style={{ 
                            color: cv 
                                ? 'var(--primary)' 
                                : 'var(--on-surface-variant)',
                            fontSize: '0.95rem'
                        }}>
                            {loading 
                                ? 'Loading...' 
                                : cv 
                                    ? `✓ CV uploaded — ${cv.fileName}` 
                                    : 'No CV uploaded yet'
                            }
                        </div>
                    </div>
                </div>
            </Card>

            {/* CV Data + Actions */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '20px' 
            }}>
                <Card title="From Your CV">
                    {cv ? (
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '16px' 
                        }}>
                            <div>
                                <div style={{ 
                                    color: 'var(--on-surface-variant)', 
                                    fontSize: '0.85rem',
                                    marginBottom: '4px'
                                }}>
                                    Skills Detected
                                </div>
                                <div style={{ 
                                    fontSize: '0.95rem', 
                                    lineHeight: '1.5' 
                                }}>
                                    {displaySkills}
                                </div>
                            </div>
                            <div>
                                <div style={{ 
                                    color: 'var(--on-surface-variant)', 
                                    fontSize: '0.85rem',
                                    marginBottom: '4px'
                                }}>
                                    Experience
                                </div>
                                <div style={{ 
                                    fontSize: '0.95rem', 
                                    color: 'var(--on-surface-variant)',
                                    lineHeight: '1.5',
                                    maxHeight: '80px',
                                    overflow: 'hidden'
                                }}>
                                    {cv.structuredData?.experience 
                                        || 'No experience data parsed'}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--on-surface-variant)' }}>
                            Upload a CV to see parsed data here.
                        </p>
                    )}
                </Card>

                <Card title="Quick Actions">
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '12px' 
                    }}>
                        <Link 
                            to="/interview-setup" 
                            style={{ textDecoration: 'none' }}
                        >
                            <button 
                                className="btn-primary" 
                                style={{ width: '100%', padding: '12px' }}
                            >
                                🎤 Start Interview
                            </button>
                        </Link>
                        <Link 
                            to="/interview-setup" 
                            style={{ textDecoration: 'none' }}
                        >
                            <button 
                                className="btn-outline" 
                                style={{ width: '100%', padding: '12px' }}
                            >
                                📄 Upload New CV
                            </button>
                        </Link>
                        <Link 
                            to="/history" 
                            style={{ textDecoration: 'none' }}
                        >
                            <button 
                                className="btn-outline" 
                                style={{ width: '100%', padding: '12px' }}
                            >
                                📜 View History
                            </button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
