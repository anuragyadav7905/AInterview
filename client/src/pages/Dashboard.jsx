import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div style={{ backgroundColor: '#0a0e14', color: '#f1f3fc', paddingBottom: '3rem', fontFamily: 'var(--font-body)' }}>
            
            {/* Top Navigation Bar from image (since it was requested to match) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div className="display-md" style={{ fontSize: '1.5rem', margin: 0 }}>AInterview</div>
                    <div style={{ display: 'flex', gap: '1.5rem', color: '#a8abb3', fontSize: '0.9rem' }}>
                        <span style={{ cursor: 'pointer' }}>Product</span>
                        <span style={{ cursor: 'pointer' }}>Features</span>
                        <span style={{ cursor: 'pointer' }}>Pricing</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <span style={{ color: '#a8abb3', fontSize: '0.9rem', cursor: 'pointer' }}>Log In</span>
                    <button style={{ 
                        background: 'linear-gradient(135deg, #e08efe, #8995ff)', 
                        border: 'none', 
                        padding: '8px 20px', 
                        borderRadius: '20px', 
                        color: 'black', 
                        fontWeight: '600' 
                    }}>Sign Up</button>
                </div>
            </div>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ 
                        fontSize: '3rem', 
                        fontWeight: 'bold', 
                        background: 'linear-gradient(to right, #e08efe, #8995ff)', 
                        WebkitBackgroundClip: 'text', 
                        color: 'transparent', 
                        margin: '0 0 1rem 0',
                        fontFamily: 'var(--font-display)'
                    }}>Welcome back, Alex!</h1>
                    <p style={{ color: '#a8abb3', fontSize: '1.1rem', maxWidth: '600px', margin: 0 }}>
                        Ready to ace your next session? We've analyzed 12 new industry trends for your role since your last visit.
                    </p>
                </div>
                <Link to="/interview-setup" style={{ textDecoration: 'none' }}>
                    <button style={{ 
                        background: '#b899fd', 
                        color: '#1e1136', 
                        padding: '14px 28px', 
                        borderRadius: '30px', 
                        fontWeight: 'bold', 
                        border: 'none', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        fontSize: '1rem' 
                    }}>
                        <div style={{ background: 'rgba(0,0,0,0.2)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        Start Interview
                    </button>
                </Link>
            </div>

            {/* Top Grid: Consistency & Resume */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Consistency Score Card */}
                <div style={{ background: '#181b21', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <div style={{ color: '#e08efe', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Performance Overview</div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Consistency Score</h2>
                        </div>
                        <div style={{ background: 'rgba(137, 149, 255, 0.1)', color: '#8995ff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
                            +14%
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1' }}>84<span style={{ fontSize: '1.5rem', color: '#a8abb3' }}>%</span></div>
                            <div style={{ color: '#a8abb3', fontSize: '0.9rem', marginTop: '0.5rem' }}>Accuracy Rate</div>
                        </div>
                        
                        {/* Mock Chart */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '60px' }}>
                            <div style={{ width: '40px', height: '30px', background: 'rgba(224, 142, 254, 0.3)', borderRadius: '6px' }}></div>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(224, 142, 254, 0.3)', borderRadius: '6px' }}></div>
                            <div style={{ width: '40px', height: '20px', background: 'rgba(224, 142, 254, 0.3)', borderRadius: '6px' }}></div>
                            <div style={{ width: '40px', height: '45px', background: 'rgba(224, 142, 254, 0.4)', borderRadius: '6px' }}></div>
                            <div style={{ width: '40px', height: '60px', background: '#d58ffd', borderRadius: '6px', boxShadow: '0 0 15px rgba(224, 142, 254, 0.3)' }}></div>
                        </div>

                        <div>
                            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1' }}>28</div>
                            <div style={{ color: '#a8abb3', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'right' }}>Sessions</div>
                        </div>
                    </div>
                </div>

                {/* Resume Status Card */}
                <div style={{ background: '#1c1f26', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ background: '#ff709b', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: 'bold' }}>Resume Status</h2>
                    <p style={{ color: '#a8abb3', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                        Last updated 2 days ago. ATS compatibility: <strong style={{ color: '#ff709b' }}>92%</strong>
                    </p>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        View Full Analysis <span style={{ fontSize: '1.2rem' }}>→</span>
                    </div>
                </div>
            </div>

            {/* Middle Grid: Weak Areas & Technical Score */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Target Weak Areas */}
                <div style={{ background: '#1c1f26', borderRadius: '24px', padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <div style={{ width: '4px', height: '20px', background: '#ff709b', borderRadius: '2px' }}></div>
                        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>Target Weak Areas</h2>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: '#15171e', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff709b' }}></div>
                                <span style={{ fontSize: '0.95rem' }}>System Design Scalability</span>
                            </div>
                            <span style={{ background: 'rgba(255,112,155,0.1)', color: '#ff709b', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>High Priority</span>
                        </div>
                        
                        <div style={{ background: '#15171e', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff709b' }}></div>
                                <span style={{ fontSize: '0.95rem' }}>Behavioral: Conflict Res</span>
                            </div>
                            <span style={{ background: 'rgba(255,112,155,0.1)', color: '#ff709b', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Medium</span>
                        </div>
                        
                        <div style={{ background: '#15171e', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8995ff' }}></div>
                                <span style={{ fontSize: '0.95rem' }}>Concurrency & Locks</span>
                            </div>
                            <span style={{ background: 'rgba(137,149,255,0.1)', color: '#8995ff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Stable</span>
                        </div>
                    </div>
                </div>

                {/* Avg Technical Score */}
                <div style={{ background: '#1c1f26', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>Avg Technical Score</h2>
                        <div style={{ background: 'rgba(224,142,254,0.1)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e08efe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                        {/* Circular Progress Mockup */}
                        <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#e08efe" strokeWidth="8" strokeDasharray="314" strokeDashoffset="78" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(224,142,254,0.6))' }} />
                            </svg>
                            <div style={{ position: 'absolute', fontSize: '2rem', fontWeight: 'bold' }}>7.5</div>
                        </div>
                        
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.7rem', color: '#a8abb3', letterSpacing: '1px', fontWeight: 'bold' }}>CURRENT RANK</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Top 15%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '1.5rem' }}>
                                <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #e08efe, #8995ff)', borderRadius: '3px' }}></div>
                            </div>
                            <p style={{ color: '#a8abb3', fontSize: '0.85rem', mragin: 0, lineHeight: '1.4' }}>
                                Your logic and reasoning skills are currently your strongest assets.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid: 3 small feature cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
                <div style={{ background: '#1c1f26', borderRadius: '20px', padding: '1.5rem' }}>
                    <div style={{ color: '#e08efe', marginBottom: '1rem', fontSize: '1.5rem' }}>✨</div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>AI Feedback Loop</h3>
                    <p style={{ color: '#a8abb3', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>Get real-time voice and sentiment analysis on your last session.</p>
                </div>
                
                <div style={{ background: '#1c1f26', borderRadius: '20px', padding: '1.5rem' }}>
                    <div style={{ color: '#8995ff', marginBottom: '1rem', fontSize: '1.5rem' }}>⚙️</div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Role Customization</h3>
                    <p style={{ color: '#a8abb3', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>Tailor your next mock interview to a specific job description.</p>
                </div>
                
                <div style={{ background: '#1c1f26', borderRadius: '20px', padding: '1.5rem' }}>
                    <div style={{ color: '#ff709b', marginBottom: '1rem', fontSize: '1.5rem' }}>💼</div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Market Insights</h3>
                    <p style={{ color: '#a8abb3', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>View salary benchmarks and tech stack trends for your targets.</p>
                </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>AInterview AI</h2>
                    <p style={{ color: '#a8abb3', fontSize: '0.8rem', margin: 0 }}>© 2024 AINTERVIEW AI. CINEMATIC INTELLIGENCE.</p>
                </div>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', color: '#a8abb3', letterSpacing: '1px' }}>
                    <span style={{ cursor: 'pointer' }}>PRIVACY</span>
                    <span style={{ cursor: 'pointer' }}>TERMS</span>
                    <span style={{ cursor: 'pointer' }}>TWITTER</span>
                    <span style={{ cursor: 'pointer' }}>LINKEDIN</span>
                </div>
            </div>
            
        </div>
    );
};

export default Dashboard;
