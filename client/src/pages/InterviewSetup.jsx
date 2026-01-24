import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';

const InterviewSetup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('SDE');
    const [difficulty, setDifficulty] = useState('Medium');
    const [style, setStyle] = useState('Friendly');
    const [loading, setLoading] = useState(false);

    const roles = ['SDE', 'Product Manager', 'Data Scientist', 'Designer', 'Marketing'];
    const difficulties = ['Easy', 'Medium', 'Hard', 'Adaptive'];
    const styles = [
        { name: 'Friendly', icon: '😊', desc: 'Encouraging & Helpful' },
        { name: 'Professional', icon: '👔', desc: 'Standard Corporate' },
        { name: 'Strict', icon: '🧐', desc: 'Challenging & Critical' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/interview/start',
                { role, difficulty, style },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/interview/${res.data.interviewId}`);
        } catch (err) {
            console.error(err);
            alert('Failed to start interview. Please upload a CV first.');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const SelectButton = ({ active, onClick, children }) => (
        <button
            type="button"
            onClick={onClick}
            style={{
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                border: active ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                background: active ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: active ? '600' : '400',
                cursor: 'pointer',
                flex: 1,
                textAlign: 'center',
                transition: 'all 0.2s'
            }}
        >
            {children}
        </button>
    );

    return (
        <div className="flex-center fade-in" style={{ minHeight: '80vh' }}>
            <Card title="Configure Session" style={{ maxWidth: '600px', width: '100%' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                    Customize your mock interview environment. The AI will adapt questions based on your resume and these settings.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <div style={{ marginBottom: '25px' }}>
                        <label className="text-gradient" style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Target Role</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {roles.map(r => (
                                <SelectButton key={r} active={role === r} onClick={() => setRole(r)}>
                                    {r}
                                </SelectButton>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block', color: 'var(--text-main)' }}>Difficulty Level</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {difficulties.map(d => (
                                <SelectButton key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
                                    {d}
                                </SelectButton>
                            ))}
                        </div>
                    </div>

                    {/* Style Selection */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block', color: 'var(--text-main)' }}>Interviewer Persona</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                            {styles.map(s => (
                                <div
                                    key={s.name}
                                    onClick={() => setStyle(s.name)}
                                    style={{
                                        border: style === s.name ? '1px solid var(--secondary)' : '1px solid var(--glass-border)',
                                        background: style === s.name ? 'rgba(217, 70, 239, 0.1)' : 'transparent',
                                        padding: '15px',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{s.icon}</div>
                                    <div style={{ fontWeight: 'bold', color: style === s.name ? 'var(--secondary)' : 'var(--text-main)' }}>{s.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}>
                        {loading ? 'Initializing Interface...' : 'Start Interview Session ->'}
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default InterviewSetup;
