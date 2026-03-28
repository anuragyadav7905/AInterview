import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    
    // Form fields
    const [role, setRole] = useState('');
    const [experience, setExperience] = useState('Junior');

    const handleNext = () => {
        if (step === 3) {
            navigate('/dashboard');
        } else {
            setStep(step + 1);
        }
    };

    return (
        <div className="flex-center fade-in" style={{ height: '100vh', background: 'var(--surface)', padding: '20px' }}>
            <Card className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '40px' }}>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '30px' }}>
                    <div style={{ flex: 1, height: '4px', background: step >= 1 ? 'var(--primary)' : 'var(--surface-container-highest)' }} />
                    <div style={{ flex: 1, height: '4px', background: step >= 2 ? 'var(--primary)' : 'var(--surface-container-highest)' }} />
                    <div style={{ flex: 1, height: '4px', background: step >= 3 ? 'var(--primary)' : 'var(--surface-container-highest)' }} />
                </div>

                {step === 1 && (
                    <div className="fade-in">
                        <h2 className="display-sm" style={{ marginBottom: '15px' }}>Welcome to AInterview 👋</h2>
                        <p style={{ color: 'var(--on-surface-variant)', marginBottom: '30px' }}>Let's tailor the AI to your specific career goals.</p>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label>What is your target job title?</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Senior Frontend Engineer, Product Manager" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)} 
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="fade-in">
                        <h2 className="display-sm" style={{ marginBottom: '15px' }}>Experience Level</h2>
                        <p style={{ color: 'var(--on-surface-variant)', marginBottom: '30px' }}>How many years of experience do you have?</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
                            {['Junior (0-2 YOE)', 'Mid-Level (3-5 YOE)', 'Senior (5-8 YOE)', 'Lead / Staff (8+ YOE)'].map(level => (
                                <button 
                                    key={level}
                                    onClick={() => setExperience(level)}
                                    className={experience === level ? 'btn-primary' : 'btn-outline'}
                                    style={{ padding: '15px', textTransform: 'none' }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="fade-in">
                        <h2 className="display-sm" style={{ marginBottom: '15px' }}>Upload Resume (Optional)</h2>
                        <p style={{ color: 'var(--on-surface-variant)', marginBottom: '30px' }}>Provide your resume to get ultra-personalized questions based on your past experiences.</p>
                        
                        <div className="flex-center" style={{ 
                            border: '2px dashed var(--outline-variant)', 
                            borderRadius: '12px', 
                            height: '150px', 
                            background: 'var(--surface-container-low)',
                            marginBottom: '20px',
                            cursor: 'pointer'
                        }}>
                            <div style={{ textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📄</div>
                                Drag & Drop PDF here
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-between" style={{ marginTop: '40px' }}>
                    {step > 1 ? (
                        <button className="btn-outline" onClick={() => setStep(step - 1)}>Back</button>
                    ) : <div />}
                    
                    <button className="btn-primary" onClick={handleNext}>
                        {step === 3 ? "Go to Dashboard" : "Continue"}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Onboarding;
