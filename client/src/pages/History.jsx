import React from 'react';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const navigate = useNavigate();

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
                        <div onClick={() => navigate('/summary/1')} style={{ background: '#222631', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#2c3140'} onMouseOut={(e) => e.currentTarget.style.background = '#222631'}>
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
                        <div onClick={() => navigate('/summary/2')} style={{ background: '#222631', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#2c3140'} onMouseOut={(e) => e.currentTarget.style.background = '#222631'}>
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
                        <div onClick={() => navigate('/summary/3')} style={{ background: '#222631', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#2c3140'} onMouseOut={(e) => e.currentTarget.style.background = '#222631'}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8abb3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default History;
