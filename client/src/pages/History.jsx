import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styleColors = {
    Technical: { border: 'rgba(137,149,255,0.3)', bg: 'rgba(137,149,255,0.1)', text: '#8995ff' },
    Strict:    { border: 'rgba(255,112,155,0.3)', bg: 'rgba(255,112,155,0.1)', text: '#ff709b' },
    Friendly:  { border: 'rgba(76,217,100,0.3)',  bg: 'rgba(76,217,100,0.1)',  text: '#4cd964' },
    HR:        { border: 'rgba(224,142,254,0.3)', bg: 'rgba(224,142,254,0.1)', text: '#e08efe' },
    Focused:   { border: 'rgba(255,234,0,0.3)',   bg: 'rgba(255,234,0,0.1)',   text: '#ffea00' },
};

const scoreColor = (score) => {
    if (score >= 8) return '#e08efe';
    if (score >= 6) return '#8995ff';
    return '#ff709b';
};

const History = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/interview/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInterviews(res.data);
            } catch (err) {
                setError('Could not load interview history.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div style={{ backgroundColor: '#0a0e14', color: '#f1f3fc', paddingBottom: '3rem', fontFamily: 'var(--font-body)' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'white', fontFamily: 'var(--font-display)' }}>
                        Interview History
                    </h1>
                    <p style={{ color: '#a8abb3', fontSize: '1rem', margin: 0 }}>
                        Review your past performance and track your growth trajectory.
                    </p>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ color: '#a8abb3', textAlign: 'center', padding: '4rem 0' }}>
                    Loading your interviews...
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{ color: '#ff709b', textAlign: 'center', padding: '4rem 0' }}>
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && interviews.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎤</div>
                    <p style={{ color: '#a8abb3', marginBottom: '1.5rem' }}>No interviews yet. Start practicing!</p>
                    <button
                        onClick={() => navigate('/interview-setup')}
                        style={{ background: 'linear-gradient(135deg, #e08efe, #8995ff)', color: '#000', border: 'none', padding: '12px 28px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Start Interview
                    </button>
                </div>
            )}

            {/* Interview Cards */}
            {!loading && !error && interviews.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                    {interviews.map((interview) => {
                        const date = new Date(interview.createdAt);
                        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
                        const day = date.getDate();
                        const style = interview.style || 'Friendly';
                        const colors = styleColors[style] || styleColors.Friendly;
                        const score = interview.averageScore || 0;
                        const pct = Math.round((score / 10) * 100);
                        const color = scoreColor(score);

                        return (
                            <div key={interview._id} style={{ background: '#1c1f26', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                {/* Date Badge */}
                                <div style={{ background: '#222631', padding: '0.75rem', borderRadius: '12px', textAlign: 'center', minWidth: '70px' }}>
                                    <div style={{ color: colors.text, fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' }}>{month}</div>
                                    <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold', lineHeight: '1.2' }}>{day}</div>
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{interview.role || 'General Interview'}</h3>
                                        <span style={{ border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                                            {style.toUpperCase()}
                                        </span>
                                        {interview.status === 'completed' && (
                                            <span style={{ border: '1px solid rgba(76,217,100,0.3)', background: 'rgba(76,217,100,0.1)', color: '#4cd964', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                                                DONE
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ color: '#a8abb3', fontSize: '0.9rem', margin: 0 }}>
                                        {interview.difficulty} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>

                                {/* Score */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: '#a8abb3', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5rem', textAlign: 'right' }}>AI SCORE</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '2px' }}></div>
                                            </div>
                                            <span style={{ color: color, fontWeight: 'bold', fontSize: '1rem' }}>{pct}%</span>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => navigate(`/summary/${interview._id}`)}
                                        style={{ background: '#222631', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#2c3140'}
                                        onMouseOut={(e) => e.currentTarget.style.background = '#222631'}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8abb3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default History;
