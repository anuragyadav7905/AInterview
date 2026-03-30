import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import CVUpload from '../components/CVUpload';

const InterviewSetup = () => {
    const navigate = useNavigate();

    const handleUploadSuccess = (data) => {
        if (data && data.id) {
            localStorage.setItem('cvId', data.id);
        } else if (data && data._id) {
            localStorage.setItem('cvId', data._id);
        }
        
        // Let the user see the success state of the CV component briefly before navigating
        setTimeout(() => {
            navigate('/interview/new');
        }, 1500);
    };

    const handleContinueWithoutResume = () => {
        localStorage.removeItem('cvId'); // Ensure no CV is lingering
        navigate('/interview/new');
    };

    return (
        <div className="flex-center fade-in" style={{ minHeight: '80vh', padding: '40px 20px' }}>
            <Card title="Ready to Practice?" style={{ maxWidth: '650px', width: '100%', textAlign: 'center' }}>
                <p style={{ color: 'var(--on-surface-variant)', marginBottom: '40px' }}>
                    Choose your preparation path. The AI will tailor the interview to match your profile seamlessly.
                </p>

                {/* Path A */}
                <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', 
                            background: 'rgba(224, 142, 254, 0.1)', color: 'var(--primary)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontWeight: 'bold', marginRight: '12px', border: '1px solid rgba(224, 142, 254, 0.3)'
                        }}>
                            A
                        </div>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', margin: 0 }}>Upload Your Resume</h3>
                    </div>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '0px', paddingLeft: '44px' }}>
                        Get personalized questions based on your actual experience and skills. Supported formats: PDF, DOCX (Max 5MB).
                    </p>
                    
                    {/* The Antigravity Upload Component */}
                    <div style={{ margin: '-10px 0', position: 'relative', zIndex: 10 }}> 
                        <CVUpload onUploadSuccess={handleUploadSuccess} />
                    </div>
                </div>

                {/* Divider */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    margin: '20px 0',
                    color: 'rgba(255,255,255,0.2)'
                }}>
                    <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.05)', margin: 0 }} />
                    <span style={{ padding: '0 20px', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '2px' }}>OR</span>
                    <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.05)', margin: 0 }} />
                </div>

                {/* Path B */}
                <div style={{ textAlign: 'left', marginTop: '30px', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', 
                            background: 'rgba(137, 149, 255, 0.1)', color: 'var(--secondary)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontWeight: 'bold', marginRight: '12px', border: '1px solid rgba(137, 149, 255, 0.3)'
                        }}>
                            B
                        </div>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', margin: 0 }}>Practice Without Resume</h3>
                    </div>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '24px', paddingLeft: '44px' }}>
                        Jump straight into a general behavioral or technical interview session. You can set the persona and difficulty inside.
                    </p>
                    
                    <button 
                        onClick={handleContinueWithoutResume}
                        className="btn-path-b"
                    >
                        Skip & Start Interview →
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
                .btn-path-b:hover::before {
                    left: 100%;
                }
            `}</style>
        </div>
    );
};

export default InterviewSetup;
