import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import CVUpload from '../components/CVUpload';

const ROLES = [
    'Software Engineer',
    'Frontend Engineer',
    'Backend Engineer',
    'Full Stack Engineer',
    'Data Scientist',
    'Data Engineer',
    'Machine Learning Engineer',
    'DevOps / SRE',
    'Mobile Engineer',
    'QA / SDET',
    'Product Manager',
    'System Design',
];

const DIFFICULTIES = [
    { value: 'Easy', label: 'Easy', desc: 'Fundamentals & concepts' },
    { value: 'Medium', label: 'Medium', desc: 'Mid-level, balanced depth' },
    { value: 'Hard', label: 'Hard', desc: 'Senior-level, deep expertise' },
];

const InterviewSetup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('Software Engineer');
    const [difficulty, setDifficulty] = useState('Medium');

    const saveAndNavigate = () => {
        localStorage.setItem('interviewRole', role);
        localStorage.setItem('interviewDifficulty', difficulty);
        navigate('/interview/new');
    };

    const handleUploadSuccess = (data) => {
        if (data?.id) localStorage.setItem('cvId', data.id);
        else if (data?._id) localStorage.setItem('cvId', data._id);
        setTimeout(saveAndNavigate, 1500);
    };

    const handleContinueWithoutResume = () => {
        localStorage.removeItem('cvId');
        saveAndNavigate();
    };

    return (
        <div className="flex-center fade-in" style={{ minHeight: '80vh', padding: '40px 20px' }}>
            <Card title="Ready to Practice?" style={{ maxWidth: '680px', width: '100%', textAlign: 'center' }}>
                <p style={{ color: 'var(--on-surface-variant)', marginBottom: '32px' }}>
                    Configure your session, then upload your CV or jump straight in.
                </p>

                {/* ── Interview Configuration ── */}
                <div style={{
                    background: 'rgba(224,142,254,0.05)',
                    border: '1px solid rgba(224,142,254,0.15)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    marginBottom: '28px',
                    textAlign: 'left'
                }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1.5px', color: 'var(--primary)', marginBottom: '16px', textTransform: 'uppercase' }}>
                        Interview Configuration
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {/* Role */}
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: '8px', fontWeight: '500' }}>
                                Target Role
                            </label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    background: 'var(--surface-container-high)',
                                    color: 'var(--on-surface)',
                                    border: '1px solid var(--outline-variant)',
                                    borderRadius: '10px',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {ROLES.map(r => <option key={r}>{r}</option>)}
                            </select>
                        </div>

                        {/* Difficulty */}
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: '8px', fontWeight: '500' }}>
                                Difficulty
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {DIFFICULTIES.map(d => (
                                    <button
                                        key={d.value}
                                        onClick={() => setDifficulty(d.value)}
                                        title={d.desc}
                                        style={{
                                            flex: 1,
                                            padding: '10px 6px',
                                            borderRadius: '10px',
                                            border: difficulty === d.value
                                                ? '1px solid var(--primary)'
                                                : '1px solid var(--outline-variant)',
                                            background: difficulty === d.value
                                                ? 'rgba(224,142,254,0.15)'
                                                : 'var(--surface-container-high)',
                                            color: difficulty === d.value ? 'var(--primary)' : 'var(--on-surface-variant)',
                                            fontWeight: difficulty === d.value ? '700' : '500',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '6px', paddingLeft: '2px' }}>
                                {DIFFICULTIES.find(d => d.value === difficulty)?.desc}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Path A: Upload CV ── */}
                <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'rgba(224, 142, 254, 0.1)', color: 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 'bold', marginRight: '12px', border: '1px solid rgba(224, 142, 254, 0.3)'
                        }}>A</div>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', margin: 0 }}>Upload Your Resume</h3>
                    </div>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '0px', paddingLeft: '44px' }}>
                        Get personalized questions based on your actual experience. PDF, DOCX (Max 5MB).
                    </p>
                    <div style={{ margin: '-10px 0', position: 'relative', zIndex: 10 }}>
                        <CVUpload onUploadSuccess={handleUploadSuccess} />
                    </div>
                </div>

                {/* ── Divider ── */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'rgba(255,255,255,0.2)' }}>
                    <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.05)', margin: 0 }} />
                    <span style={{ padding: '0 20px', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '2px' }}>OR</span>
                    <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.05)', margin: 0 }} />
                </div>

                {/* ── Path B: Skip ── */}
                <div style={{ textAlign: 'left', marginTop: '30px', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'rgba(137, 149, 255, 0.1)', color: 'var(--secondary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 'bold', marginRight: '12px', border: '1px solid rgba(137, 149, 255, 0.3)'
                        }}>B</div>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', margin: 0 }}>Practice Without Resume</h3>
                    </div>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '24px', paddingLeft: '44px' }}>
                        Jump straight into a <strong style={{ color: 'var(--on-surface)' }}>{role}</strong> interview at <strong style={{ color: 'var(--on-surface)' }}>{difficulty}</strong> difficulty using your configuration above.
                    </p>
                    <button onClick={handleContinueWithoutResume} className="btn-path-b">
                        Skip &amp; Start Interview →
                    </button>
                </div>
            </Card>

            <style>{`
                .btn-path-b {
                    width: 100%;
                    padding: 16px;
                    border-radius: 16px;
                    background: rgba(137, 149, 255, 0.05);
                    border: 1px solid rgba(137, 149, 255, 0.2);
                    color: var(--secondary);
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                    overflow: hidden;
                }
                .btn-path-b::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%; width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(137, 149, 255, 0.1), transparent);
                    transition: left 0.5s ease;
                }
                .btn-path-b:hover {
                    background: rgba(137, 149, 255, 0.15);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(137, 149, 255, 0.15);
                    border-color: rgba(137, 149, 255, 0.4);
                }
                .btn-path-b:hover::before { left: 100%; }
            `}</style>
        </div>
    );
};

export default InterviewSetup;
