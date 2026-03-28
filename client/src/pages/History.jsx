import React from 'react';

const History = () => {
    return (
        <div style={{ backgroundColor: '#0a0e14', color: '#f1f3fc', paddingBottom: '3rem', fontFamily: 'var(--font-body)' }}>
            
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 'bold', 
                        margin: '0 0 0.5rem 0',
                        color: 'white',
                        fontFamily: 'var(--font-display)'
                    }}>Interview History</h1>
                    <p style={{ color: '#a8abb3', fontSize: '1rem', margin: 0 }}>
                        Review your past performance and track your growth trajectory.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                        background: '#1c1f26',
                        color: '#a8abb3',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                        FILTER
                    </button>
                    <button style={{
                        background: '#1c1f26',
                        color: '#a8abb3',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        EXPORT
                    </button>
                </div>
            </div>

            {/* History List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                
                {/* Card 1 */}
                <div style={{ background: '#1c1f26', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: '#222631', padding: '0.75rem', borderRadius: '12px', textAlign: 'center', minWidth: '70px' }}>
                        <div style={{ color: '#e08efe', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' }}>OCT</div>
                        <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold', lineHeight: '1.2' }}>24</div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Senior Product Designer</h3>
                            <span style={{ border: '1px solid rgba(137,149,255,0.3)', background: 'rgba(137,149,255,0.1)', color: '#8995ff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' }}>TECHNICAL</span>
                        </div>
                        <p style={{ color: '#a8abb3', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>"Excellent articulation of design systems, but could improve on cross-..."</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div>
                            <div style={{ fontSize: '0.65rem', color: '#a8abb3', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5rem', textAlign: 'right' }}>AI SCORE</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                    <div style={{ width: '88%', height: '100%', background: '#b899fd', borderRadius: '2px' }}></div>
                                </div>
                                <span style={{ color: '#b899fd', fontWeight: 'bold', fontSize: '1rem' }}>88%</span>
                            </div>
                        </div>
                        <div style={{ background: '#222631', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8abb3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div style={{ background: '#1c1f26', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: '#222631', padding: '0.75rem', borderRadius: '12px', textAlign: 'center', minWidth: '70px' }}>
                        <div style={{ color: '#ff709b', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' }}>OCT</div>
                        <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold', lineHeight: '1.2' }}>19</div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Fullstack Engineer</h3>
                            <span style={{ border: '1px solid rgba(255,112,155,0.3)', background: 'rgba(255,112,155,0.1)', color: '#ff709b', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' }}>SYSTEM DESIGN</span>
                        </div>
                        <p style={{ color: '#a8abb3', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>"Strong architectural knowledge. Scalability answers were top-tier. Minor..."</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div>
                            <div style={{ fontSize: '0.65rem', color: '#a8abb3', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5rem', textAlign: 'right' }}>AI SCORE</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                    <div style={{ width: '94%', height: '100%', background: '#ff709b', borderRadius: '2px' }}></div>
                                </div>
                                <span style={{ color: '#ff709b', fontWeight: 'bold', fontSize: '1rem' }}>94%</span>
                            </div>
                        </div>
                        <div style={{ background: '#222631', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8abb3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div style={{ background: '#1c1f26', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: '#222631', padding: '0.75rem', borderRadius: '12px', textAlign: 'center', minWidth: '70px' }}>
                        <div style={{ color: '#4a5568', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' }}>OCT</div>
                        <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold', lineHeight: '1.2' }}>12</div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Marketing Manager</h3>
                            <span style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#a8abb3', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' }}>CULTURAL FIT</span>
                        </div>
                        <p style={{ color: '#a8abb3', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>"Tone was professional yet approachable. Good storytelling. Needs more..."</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div>
                            <div style={{ fontSize: '0.65rem', color: '#a8abb3', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5rem', textAlign: 'right' }}>AI SCORE</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                    <div style={{ width: '76%', height: '100%', background: '#8995ff', borderRadius: '2px' }}></div>
                                </div>
                                <span style={{ color: '#8995ff', fontWeight: 'bold', fontSize: '1rem' }}>76%</span>
                            </div>
                        </div>
                        <div style={{ background: '#222631', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8abb3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '4rem' }}>
                
                {/* Progress Chart */}
                <div style={{ background: '#1c1f26', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8995ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Progress Over Time</h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', flex: 1, height: '180px', paddingTop: '20px' }}>
                        {/* Bars */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '100%', height: '30%', background: '#232631', borderRadius: '6px' }}></div>
                            <span style={{ fontSize: '0.65rem', color: '#a8abb3', fontWeight: 'bold', letterSpacing: '1px' }}>AUG</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '100%', height: '45%', background: '#232631', borderRadius: '6px' }}></div>
                            <span style={{ fontSize: '0.65rem', color: 'transparent' }}>-</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '100%', height: '40%', background: '#232631', borderRadius: '6px' }}></div>
                            <span style={{ fontSize: '0.65rem', color: 'transparent' }}>-</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '100%', height: '60%', background: '#232631', borderRadius: '6px' }}></div>
                            <span style={{ fontSize: '0.65rem', color: '#a8abb3', fontWeight: 'bold', letterSpacing: '1px' }}>SEP</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '100%', height: '55%', background: '#232631', borderRadius: '6px' }}></div>
                            <span style={{ fontSize: '0.65rem', color: 'transparent' }}>-</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #e08efe, #8995ff)', borderRadius: '6px' }}></div>
                            <span style={{ fontSize: '0.65rem', color: '#a8abb3', fontWeight: 'bold', letterSpacing: '1px' }}>OCT (CURRENT)</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ background: '#1c1f26', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#ff709b', lineHeight: '1' }}>12</div>
                        <div style={{ fontSize: '0.65rem', color: '#a8abb3', fontWeight: 'bold', letterSpacing: '1px', marginTop: '0.5rem' }}>TOTAL SESSIONS</div>
                    </div>
                    
                    <div style={{ width: '80%', height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}></div>
                    
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', lineHeight: '1' }}>84.2</div>
                        <div style={{ fontSize: '0.65rem', color: '#a8abb3', fontWeight: 'bold', letterSpacing: '1px', marginTop: '0.5rem' }}>AVG CONFIDENCE SCORE</div>
                    </div>
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

export default History;
