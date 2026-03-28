import React from 'react';
import { Link } from 'react-router-dom';

const InterviewSummary = () => {
    return (
        <div style={{ backgroundColor: '#0a0e14', color: '#f1f3fc', paddingBottom: '3rem', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
            
            {/* Header / Breadcrumb Section */}
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#a8abb3', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Interviews
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    <span style={{ color: '#e08efe' }}>Senior System Architect Role</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ 
                            fontSize: '2.2rem', 
                            fontWeight: 'bold', 
                            margin: '0 0 0.5rem 0',
                            color: 'white',
                            fontFamily: 'var(--font-display)'
                        }}>Performance Report</h1>
                        <p style={{ color: '#a8abb3', fontSize: '0.9rem', margin: 0, maxWidth: '400px', lineHeight: '1.4' }}>
                            Comprehensive AI analysis of your technical interview for the Lead Engineer position. Completed May 24, 2024.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                            <button style={{
                                background: 'transparent',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '12px 24px',
                                borderRadius: '24px',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '140px'
                            }}>
                                Go to<br/>Dashboard
                            </button>
                        </Link>
                        <button style={{
                            background: 'linear-gradient(135deg, #e08efe, #8995ff)',
                            color: '#000',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '24px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '140px'
                        }}>
                            Retry<br/>Interview
                        </button>
                    </div>
                </div>
            </div>

            {/* Top Stats Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', marginBottom: '3rem' }}>
                
                {/* Overall Score Circle */}
                <div style={{ background: '#12141c', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <div style={{ fontSize: '0.7rem', color: '#a8abb3', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '2rem' }}>OVERALL SCORE</div>
                    
                    <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '2rem' }}>
                        {/* Background SVG Circle */}
                        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="100" cy="100" r="90" fill="none" stroke="#2a2d39" strokeWidth="12" />
                            {/* Glowing Arc */}
                            <circle cx="100" cy="100" r="90" fill="none" stroke="url(#scoreGradient)" strokeWidth="12" strokeDasharray="565.48" strokeDashoffset="101.78" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(224,142,254,0.6))' }} />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#e08efe" />
                                    <stop offset="100%" stopColor="#8995ff" />
                                </linearGradient>
                            </defs>
                        </svg>
                        
                        <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                <span style={{ fontSize: '4.5rem', fontWeight: 'bold', color: 'white', lineHeight: '1' }}>82</span>
                                <span style={{ fontSize: '1.5rem', color: '#e08efe', fontWeight: 'bold' }}>%</span>
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#e08efe', letterSpacing: '1.5px', fontWeight: 'bold', marginTop: '4px' }}>EXCEPTIONAL</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>42m</div>
                            <div style={{ fontSize: '0.6rem', color: '#a8abb3', letterSpacing: '1px', fontWeight: 'bold', marginTop: '4px' }}>DURATION</div>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>8/10</div>
                            <div style={{ fontSize: '0.6rem', color: '#a8abb3', letterSpacing: '1px', fontWeight: 'bold', marginTop: '4px' }}>QUESTIONS</div>
                        </div>
                    </div>
                </div>

                {/* Strengths & Growth Areas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Strengths */}
                    <div style={{ borderLeft: '2px solid #e08efe', paddingLeft: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                            <div style={{ background: '#e08efe', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 'bold' }}>Key Strengths</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {/* Strength Card 1 */}
                            <div style={{ background: '#15171e', padding: '1.2rem', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                                <div style={{ background: '#e08efe', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Scalability Design</div>
                                    <div style={{ fontSize: '0.75rem', color: '#a8abb3', lineHeight: '1.4' }}>Expertly explained horizontal partitioning strategies.</div>
                                </div>
                            </div>
                            {/* Strength Card 2 */}
                            <div style={{ background: '#15171e', padding: '1.2rem', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                                <div style={{ background: '#e08efe', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Technical Articulation</div>
                                    <div style={{ fontSize: '0.75rem', color: '#a8abb3', lineHeight: '1.4' }}>Clear, jargon-free explanations of complex concepts.</div>
                                </div>
                            </div>
                            {/* Strength Card 3 */}
                            <div style={{ background: '#15171e', padding: '1.2rem', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                                <div style={{ background: '#e08efe', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Security Awareness</div>
                                    <div style={{ fontSize: '0.75rem', color: '#a8abb3', lineHeight: '1.4' }}>Strong emphasis on OAuth2 and JWT best practices.</div>
                                </div>
                            </div>
                            {/* Strength Card 4 */}
                            <div style={{ background: '#15171e', padding: '1.2rem', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                                <div style={{ background: '#e08efe', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Conflict Resolution</div>
                                    <div style={{ fontSize: '0.75rem', color: '#a8abb3', lineHeight: '1.4' }}>Handled behavioral questions with high emotional IQ.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Growth */}
                    <div style={{ borderLeft: '2px solid #ff709b', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff709b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 'bold' }}>Areas for Growth</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {/* Growth Card 1 */}
                            <div style={{ background: '#15171e', padding: '1.2rem', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                                <div style={{ background: '#ff709b', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}></div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Cache Invalidation</div>
                                    <div style={{ fontSize: '0.75rem', color: '#a8abb3', lineHeight: '1.4' }}>Struggled with Write-Through vs Write-Back logic.</div>
                                </div>
                            </div>
                            {/* Growth Card 2 */}
                            <div style={{ background: '#15171e', padding: '1.2rem', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                                <div style={{ background: '#ff709b', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}></div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Database Indexing</div>
                                    <div style={{ fontSize: '0.75rem', color: '#a8abb3', lineHeight: '1.4' }}>Missed nuances of B-tree vs Hash index optimization.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Questions Analysis Section */}
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e08efe" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 'bold' }}>Question-by-Question Analysis</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    {/* Q1 EXPANED */}
                    <div style={{ background: '#1c1f26', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ background: '#252936', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: '#8995ff' }}>1</div>
                                <div>
                                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Design a high-frequency trading system.</div>
                                    <div style={{ fontSize: '0.75rem', color: '#a8abb3' }}>Focus: System Design & Low Latency</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ background: 'rgba(224,142,254,0.1)', border: '1px solid rgba(224,142,254,0.3)', color: '#e08efe', padding: '4px 10px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' }}>EXCELLENT</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8abb3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>
                        {/* Expanded Content */}
                        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'flex', gap: '2rem' }}>
                            <div style={{ flex: 1, paddingRight: '2rem', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '0.65rem', color: '#e08efe', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI RECOMMENDATION</div>
                                <div style={{ color: '#a8abb3', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Your approach to the message bus was solid. To reach 'Senior' level, consider discussing <span style={{ color: 'white', fontWeight: 'bold' }}>LMAX Disruptor patterns</span> and kernel bypass techniques to further reduce micro-latency.
                                </div>
                            </div>
                            <div style={{ width: '200px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#a8abb3', marginBottom: '0.5rem' }}>
                                    <span>Confidence Score</span>
                                    <span style={{ color: 'white', fontWeight: 'bold' }}>94%</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                    <div style={{ width: '94%', height: '100%', background: '#e08efe', borderRadius: '2px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div style={{ background: '#1c1f26', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ background: '#252936', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: '#8995ff' }}>2</div>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>How do you handle a disagreement with a Product Manager?</div>
                                <div style={{ fontSize: '0.75rem', color: '#a8abb3' }}>Focus: Behavioral & Leadership</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ background: 'rgba(255,112,155,0.1)', border: '1px solid rgba(255,112,155,0.3)', color: '#ff709b', padding: '4px 10px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' }}>NEEDS WORK</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8abb3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div style={{ background: '#1c1f26', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ background: '#252936', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: '#8995ff' }}>3</div>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Explain the CAP theorem and its trade-offs.</div>
                                <div style={{ fontSize: '0.75rem', color: '#a8abb3' }}>Focus: Theoretical Foundations</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a8abb3', padding: '4px 10px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' }}>GREAT</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8abb3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>

                </div>
            </div>

            {/* Recommendations Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ background: '#1c1f26', borderRadius: '16px', padding: '2rem' }}>
                    <div style={{ background: '#252936', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e08efe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 22l10-4 10 4L12 2z"></path></svg>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'white' }}>Improve System Design</h3>
                    <p style={{ color: '#a8abb3', fontSize: '0.85rem', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>Deep dive into microservices orchestration and fault tolerance patterns.</p>
                    <div style={{ color: '#ff709b', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        VIEW STUDY PATH <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                </div>
                
                <div style={{ background: '#1c1f26', borderRadius: '16px', padding: '2rem' }}>
                    <div style={{ background: '#252936', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8995ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'white' }}>Database Deep Dive</h3>
                    <p style={{ color: '#a8abb3', fontSize: '0.85rem', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>Master advanced SQL optimization and NoSQL consistency models.</p>
                    <div style={{ color: '#8995ff', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        VIEW STUDY PATH <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                </div>

                <div style={{ background: '#1c1f26', borderRadius: '16px', padding: '2rem' }}>
                    <div style={{ background: '#252936', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff709b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'white' }}>Refine Soft Skills</h3>
                    <p style={{ color: '#a8abb3', fontSize: '0.85rem', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>Practice the STAR method for more concise behavioral responses.</p>
                    <div style={{ color: '#ff709b', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        VIEW STUDY PATH <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                </div>
            </div>

            {/* Bottom CTA Banner */}
            <div style={{ 
                background: 'linear-gradient(135deg, rgba(224,142,254,0.1) 0%, rgba(137,149,255,0.1) 100%)', 
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px', 
                padding: '4rem 2rem', 
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '4rem'
            }}>
                {/* Decorative gradients */}
                <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '60%', height: '200%', background: 'radial-gradient(ellipse at center, rgba(224,142,254,0.15) 0%, transparent 70%)', transform: 'rotate(-45deg)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', bottom: '-50%', right: '-20%', width: '60%', height: '200%', background: 'radial-gradient(ellipse at center, rgba(137,149,255,0.15) 0%, transparent 70%)', transform: 'rotate(-45deg)', pointerEvents: 'none' }}></div>
                
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: '0 0 1rem 0', position: 'relative' }}>Ready for another round?</h2>
                <p style={{ color: '#a8abb3', fontSize: '1rem', margin: '0 0 2rem 0', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', position: 'relative' }}>
                    Practicing with AI is the fastest way to bridge the gap between your current skills and a 'Senior' designation.
                </p>
                <button style={{
                    background: 'linear-gradient(135deg, #e08efe, #8995ff)',
                    color: '#000',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: '30px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    position: 'relative',
                    letterSpacing: '1px'
                }}>
                    START NEW SESSION
                </button>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', letterSpacing: '1px' }}>AINTERVIEW AI</h2>
                </div>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', color: '#a8abb3', letterSpacing: '1px' }}>
                    <span style={{ cursor: 'pointer' }}>PRIVACY</span>
                    <span style={{ cursor: 'pointer' }}>TERMS</span>
                    <span style={{ cursor: 'pointer' }}>TWITTER</span>
                    <span style={{ cursor: 'pointer' }}>LINKEDIN</span>
                    <span style={{ marginLeft: '1rem' }}>© 2024 AINTERVIEW AI. CINEMATIC INTELLIGENCE.</span>
                </div>
            </div>

        </div>
    );
};

export default InterviewSummary;
