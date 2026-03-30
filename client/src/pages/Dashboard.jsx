import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                // Execute all API requests in parallel
                const [historyRes, progressRes] = await Promise.allSettled([
                    axios.get('/api/interview/history', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/interview/progress', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (historyRes.status === 'fulfilled') {
                    setHistory(historyRes.value.data);
                }
                
                if (progressRes.status === 'fulfilled') {
                    // Format score out of 100 for Recharts display
                    const rawProgress = progressRes.value.data.map(d => ({
                        ...d, 
                        score: Math.round(d.score * 10) 
                    }));
                    setProgressData(rawProgress);
                }

            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const recentSessions = history.slice(0, 3);
    const hasProgressData = progressData && progressData.length >= 2;

    if (loading) {
        return <div style={{ minHeight: '100vh', background: '#0a0e14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e08efe' }}>Loading Dashboard...</div>;
    }

    return (
        <div style={{ backgroundColor: '#0a0e14', color: '#f1f3fc', padding: '2rem', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Hero / Greeting */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '3rem' }}>
                    <h1 style={{ 
                        fontSize: '2.5rem', fontWeight: 'bold', margin: 0,
                        background: 'linear-gradient(to right, #e08efe, #8995ff)', WebkitBackgroundClip: 'text', color: 'transparent',
                        fontFamily: 'var(--font-display)'
                    }}>
                        Welcome back, {user?.username?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'}!
                    </h1>
                    <p style={{ color: '#a8abb3', fontSize: '1.05rem', maxWidth: '600px', margin: 0 }}>
                        Ready to elevate your skills? Your AI interviewer is waiting.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: hasProgressData ? '1fr 1fr' : '1fr', gap: '2rem', marginBottom: '3rem' }}>
                    
                    {/* Start Practicing CTA Card */}
                    <div style={{ 
                        background: 'linear-gradient(145deg, #1c1f26 0%, #15171e 100%)', 
                        borderRadius: '24px', padding: '3rem 2rem', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ background: '#e08efe', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 8px 24px rgba(224,142,254,0.3)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'white' }}>Start Practicing</h2>
                        <p style={{ color: '#a8abb3', fontSize: '0.95rem', margin: '0 0 2rem 0', lineHeight: '1.5', maxWidth: '300px' }}>
                            Jump right into a mock interview customized to your latest resume.
                        </p>
                        <Link to="/interview-setup" style={{ textDecoration: 'none' }}>
                            <button style={{ 
                                background: 'linear-gradient(135deg, #e08efe, #8995ff)', color: '#000', padding: '16px 36px', 
                                borderRadius: '30px', fontWeight: 'bold', border: 'none', cursor: 'pointer',
                                fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(224,142,254,0.3)', transition: 'transform 0.2s ease'
                            }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
                                Start Session
                            </button>
                        </Link>
                    </div>

                    {/* Progress Chart (Only if sufficient data) */}
                    {hasProgressData && (
                        <div style={{ background: '#1c1f26', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <div style={{ width: '4px', height: '20px', background: '#8995ff', borderRadius: '2px' }}></div>
                                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>Performance Growth</h2>
                            </div>
                            <div style={{ flex: 1, minHeight: '200px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8995ff" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8995ff" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" stroke="#a8abb3" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#a8abb3" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                        <Tooltip 
                                            contentStyle={{ background: '#15171e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                            itemStyle={{ color: '#8995ff' }}
                                        />
                                        <Area type="monotone" dataKey="score" stroke="#8995ff" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent History Section */}
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <div style={{ width: '4px', height: '20px', background: '#ff709b', borderRadius: '2px' }}></div>
                        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>Recent Sessions</h2>
                    </div>

                    {history.length === 0 ? (
                        <div style={{ 
                            background: '#1c1f26', borderRadius: '24px', padding: '4rem 2rem', 
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center'
                        }}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem' }}>
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                            <h3 style={{ fontSize: '1.2rem', color: 'white', margin: '0 0 0.5rem 0' }}>No interviews yet</h3>
                            <p style={{ color: '#a8abb3', fontSize: '0.9rem', margin: 0 }}>Start your first mock interview to see analysis here.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentSessions.map(session => {
                                const score = session.averageScore ? Math.round(session.averageScore * 10) : 0;
                                let statusColor = '#a8abb3';
                                if (score >= 80) statusColor = '#e08efe';
                                else if (score >= 50) statusColor = '#8995ff';
                                else if (score > 0) statusColor = '#ff709b';

                                return (
                                    <div key={session._id} style={{ 
                                        background: '#1c1f26', borderRadius: '16px', padding: '1.5rem 2rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s cursor'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>
                                                {session.role || 'General Software Engineer'}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#a8abb3', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                                                <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                                                <span>{session.difficulty}</span>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>{score}%</div>
                                                <div style={{ fontSize: '0.7rem', color: statusColor, fontWeight: 'bold', letterSpacing: '1px' }}>AVERAGE SCORE</div>
                                            </div>
                                            
                                            <Link to={`/summary/${session._id}`} style={{ textDecoration: 'none' }}>
                                                <button style={{
                                                    background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
                                                    padding: '10px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s'
                                                }} onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.05)'}>
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
