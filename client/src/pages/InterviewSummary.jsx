import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InterviewSummary = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [expandedQId, setExpandedQId] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // If it's the mock ID from earlier UI-only testing, handle gracefully
                if (id === 'latest' || id.startsWith('mock_')) {
                     setTimeout(() => setLoading(false), 2000);
                     return;
                }

                const res = await axios.get(`/api/interview/${id}/summary`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSummary(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [id]);

    const handleDownload = () => {
        if (!summary) return;
        const textToSave = `
Interview Report
Role: ${summary.interview?.role || 'General'}
Date: ${new Date(summary.interview?.createdAt).toLocaleDateString()}
Overall Score: ${Math.round((summary.interview?.averageScore || 0) * 10)}%
        
Strengths:
${summary.summaryData?.strengths?.map(s => "- " + s).join('\n')}

Areas for Growth:
${summary.summaryData?.improvements?.map(i => "- " + i).join('\n')}

Q&A Detail:
${summary.questions?.map((q, i) => `
Q${i+1}: ${q.content}
Score: ${q.finalScore || q.score || 'N/A'}/10
Your Answer: ${q.transcript || 'No answer provided'}
AI Feedback: ${q.feedback}
`).join('\n')}
        `.trim();
        
        const element = document.createElement("a");
        const file = new Blob([textToSave], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "AInterview_Report.txt";
        document.body.appendChild(element); // Required for FireFox
        element.click();
    };

    if (loading) {
        return (
            <div style={{ padding: '4rem 2rem', background: '#0a0e14', minHeight: '100vh', color: '#fff' }}>
                <style>{`
                    @keyframes shimmer { 
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }
                    .skeleton {
                        background: linear-gradient(90deg, #1c1f26 25%, #2a2d39 50%, #1c1f26 75%);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite linear;
                        border-radius: 12px;
                    }
                `}</style>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="skeleton" style={{ height: '40px', width: '300px' }}></div>
                    <div className="skeleton" style={{ height: '200px', width: '100%', borderRadius: '24px' }}></div>
                    <div className="skeleton" style={{ height: '100px', width: '100%' }}></div>
                    <div className="skeleton" style={{ height: '100px', width: '100%' }}></div>
                </div>
            </div>
        );
    }

    if (!summary) {
        return (
            <div style={{ backgroundColor: '#0a0e14', color: '#f1f3fc', padding: '4rem', minHeight: '100vh', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Mock Interview Complete</h2>
                <p style={{ color: '#a8abb3', marginBottom: '2rem' }}>You previewed an interview session without a real backend connection.</p>
                <Link to="/interview-setup">
                    <button style={{
                        background: 'linear-gradient(135deg, #e08efe, #8995ff)', color: '#000', border: 'none', padding: '14px 32px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer'
                    }}>Start Real Interview</button>
                </Link>
            </div>
        );
    }

    const avgScore = summary.interview?.averageScore || 0;
    const percentage = Math.round((avgScore / 10) * 100);
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div style={{ backgroundColor: '#0a0e14', color: '#f1f3fc', padding: '3rem 2rem', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#a8abb3', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Interviews
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        <span style={{ color: '#e08efe' }}>Report</span>
                    </div>
                    
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'white' }}>Interview Report</h1>
                    <p style={{ color: '#a8abb3', fontSize: '0.9rem', margin: 0, maxWidth: '400px', lineHeight: '1.4' }}>
                        Completed {new Date(summary.interview?.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Top Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{ background: '#12141c', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#a8abb3', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '2rem' }}>OVERALL SCORE</div>
                        
                        <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '1rem' }}>
                            <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="100" cy="100" r="90" fill="none" stroke="#2a2d39" strokeWidth="12" />
                                <circle cx="100" cy="100" r="90" fill="none" stroke="url(#scoreGradient)" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(224,142,254,0.6))', transition: 'stroke-dashoffset 1s ease-out' }} />
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#e08efe" />
                                        <stop offset="100%" stopColor="#8995ff" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            
                            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '4.5rem', fontWeight: 'bold', color: 'white', lineHeight: '1' }}>{percentage}</span>
                                    <span style={{ fontSize: '1.5rem', color: '#e08efe', fontWeight: 'bold' }}>%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Strengths & Growth */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ borderLeft: '2px solid #e08efe', paddingLeft: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', fontWeight: 'bold', color: 'white' }}>Key Strengths</h2>
                            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {summary.summaryData?.strengths?.map((str, idx) => (
                                    <li key={idx} style={{ background: '#1c1f26', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', color: '#f1f3fc', border: '1px solid rgba(224,142,254,0.1)' }}>
                                        <span style={{ color: '#e08efe', marginRight: '8px' }}>✦</span> {str}
                                    </li>
                                ))}
                                {(!summary.summaryData?.strengths || summary.summaryData.strengths.length === 0) && (
                                    <div style={{ color: '#a8abb3', fontSize: '0.9rem' }}>No defined strengths explicitly highlighted.</div>
                                )}
                            </ul>
                        </div>

                        <div style={{ borderLeft: '2px solid #ff709b', paddingLeft: '1.5rem', marginTop: '1rem' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', fontWeight: 'bold', color: 'white' }}>Areas for Growth</h2>
                            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {summary.summaryData?.improvements?.map((imp, idx) => (
                                    <li key={idx} style={{ background: '#1c1f26', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', color: '#f1f3fc', border: '1px solid rgba(255,112,155,0.1)' }}>
                                        <span style={{ color: '#ff709b', marginRight: '8px' }}>▲</span> {imp}
                                    </li>
                                ))}
                                {(!summary.summaryData?.improvements || summary.summaryData.improvements.length === 0) && (
                                    <div style={{ color: '#a8abb3', fontSize: '0.9rem' }}>No major areas for improvement noted.</div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Question Accordion */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.3rem', margin: '0 0 1.5rem 0', fontWeight: 'bold' }}>Question-by-Question Analysis</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {summary.questions?.map((q, idx) => {
                            const isExpanded = expandedQId === q._id;
                            const score = Math.round(q.finalScore || q.score || 0);
                            let scoreColor = '#ffea00';
                            if (score >= 8) scoreColor = '#e08efe';
                            else if (score <= 5) scoreColor = '#ff709b';

                            return (
                                <div key={q._id} style={{ background: '#1c1f26', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div 
                                        onClick={() => setExpandedQId(isExpanded ? null : q._id)}
                                        style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, paddingRight: '20px' }}>
                                            <div style={{ background: '#252936', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: '#8995ff', flexShrink: 0 }}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>{q.content}</div>
                                                <div style={{ 
                                                    fontSize: '0.85rem', color: '#a8abb3', marginTop: '6px', 
                                                    display: '-webkit-box', WebkitLineClamp: isExpanded ? 'none' : '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                                                }}>
                                                    {q.transcript ? `"${q.transcript}"` : "(No answer)"}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ border: \`1px solid \${scoreColor}\`, color: scoreColor, padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', background: \`\${scoreColor}10\` }}>
                                                Score: {score}/10
                                            </span>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8abb3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    {isExpanded && (
                                        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#e08efe', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>AI FEEDBACK & MODEL ANSWER</div>
                                                <div style={{ fontSize: '0.95rem', color: '#f1f3fc', lineHeight: '1.5', background: 'rgba(224,142,254,0.05)', padding: '16px', borderRadius: '8px', borderLeft: '2px solid #e08efe' }}>
                                                    {q.feedback || "No feedback generated."}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Actions */}
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '4rem' }}>
                    <Link to="/interview-setup" style={{ textDecoration: 'none' }}>
                        <button style={{
                            background: 'linear-gradient(135deg, #e08efe, #8995ff)', color: '#000', border: 'none', padding: '14px 32px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', letterSpacing: '1px', boxShadow: '0 4px 15px rgba(224,142,254,0.3)', transition: 'all 0.2s'
                        }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
                            Start New Interview
                        </button>
                    </Link>
                    <button onClick={handleDownload} style={{
                        background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '14px 32px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', letterSpacing: '1px', transition: 'all 0.2s'
                    }} onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.05)'}>
                        Download Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewSummary;
