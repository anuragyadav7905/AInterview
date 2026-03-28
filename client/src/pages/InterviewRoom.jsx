import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAudioRecorder from '../hooks/useAudioRecorder';

const InterviewRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);
    const [textAnswer, setTextAnswer] = useState('');

    // Audio Hook
    const { isRecording, startRecording, stopRecording } = useAudioRecorder();

    useEffect(() => {
        const fetchSession = () => {
            setTimeout(() => {
                setQuestions([
                    {
                        _id: '1',
                        type: 'BEHAVIORAL QUESTION',
                        content: 'Tell me about a time you had to manage a conflict within your design team. How did you approach it and what was the resolution?',
                        subtext: 'Focus on your communication style, the specific steps you took to mediate, and the measurable impact on the project timeline.'
                    },
                    {
                        _id: '2',
                        type: 'TECHNICAL QUESTION',
                        content: 'Walk me through your process for handing off high-fidelity designs to the engineering team.',
                        subtext: 'Mention any specific tools (Figma, Zeplin) and how you ensure design intent is maintained during implementation.'
                    },
                    {
                        _id: '3',
                        type: 'SITUATIONAL QUESTION',
                        content: 'If stakeholders push back on a critical UX research finding, how do you defend your design decisions?',
                        subtext: 'Discuss how you balance user needs with business goals and use data to drive consensus.'
                    }
                ]);
                setCurrentQuestionIndex(0);
                setLoading(false);
            }, 800);
        };
        fetchSession();
    }, [id]);

    const handleSkip = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTextAnswer('');
        } else {
            navigate(`/summary/${id || '1'}`);
        }
    };

    const handleSubmit = async () => {
        setEvaluating(true);
        // Simulate processing the answer
        setTimeout(() => {
            setEvaluating(false);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setTextAnswer('');
            } else {
                navigate(`/summary/${id || '1'}`);
            }
        }, 1500);
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111218', color: '#fff' }}>
                <div className="loader"></div>
            </div>
        );
    }

    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return <div className="flex-center" style={{ color: 'white' }}>No Questions Data</div>;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#111218', // Very dark purple/blue
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Top Bar */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 32px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: '#15161E'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#E08EFE' }}>
                        AInterview
                    </div>

                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.65rem', color: '#8B949E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Role</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Senior Product Designer</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.65rem', color: '#8B949E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Difficulty</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#FF758F' }}>Expert</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar Center */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#8B949E', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {questions.map((_, i) => (
                            <div key={i} style={{
                                height: '3px',
                                width: '40px',
                                background: i === currentQuestionIndex ? '#E08EFE' : (i < currentQuestionIndex ? '#7C4DFF' : '#2D2F3E'),
                                borderRadius: '2px',
                                transition: '0.3s'
                            }} />
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem'
                    }}>
                        <span style={{ color: '#E08EFE' }}>⏱</span> 12:45
                    </div>
                    <div style={{ cursor: 'pointer', color: '#8B949E', fontSize: '1.2rem' }}>⚙️</div>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 20px',
                maxWidth: '900px',
                margin: '0 auto',
                width: '100%',
                position: 'relative'
            }}>

                {/* Question Card */}
                <div style={{
                    background: '#1B1C26',
                    borderRadius: '24px',
                    padding: '40px',
                    width: '100%',
                    marginBottom: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.02)'
                }}>
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(124, 77, 255, 0.15)',
                        color: '#A37BFF',
                        padding: '6px 14px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        marginBottom: '20px'
                    }}>
                        {currentQ.type}
                    </div>

                    <h2 style={{
                        fontSize: '2rem',
                        lineHeight: '1.4',
                        fontWeight: '600',
                        marginBottom: '20px',
                        color: '#F8F9FA'
                    }}>
                        "{currentQ.content}"
                    </h2>

                    <p style={{
                        color: '#8B949E',
                        fontSize: '1.05rem',
                        lineHeight: '1.6'
                    }}>
                        {currentQ.subtext}
                    </p>
                </div>

                {/* Answer Input Area */}
                <div style={{
                    background: '#0A0A0F',
                    borderRadius: '16px',
                    width: '100%',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    marginBottom: '20px'
                }}>
                    <textarea
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        placeholder="Type your answer here or use the voice recorder..."
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#FFF',
                            padding: '30px',
                            minHeight: '200px',
                            resize: 'none',
                            fontSize: '1rem',
                            outline: 'none',
                            lineHeight: '1.6',
                            fontFamily: 'inherit'
                        }}
                    />

                    {/* Toolbar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 30px',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        fontSize: '0.8rem',
                        color: '#8B949E'
                    }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>A</span> Auto-correct active
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>○</span> {textAnswer.trim() ? textAnswer.trim().split(/\s+/).length : 0} / 500 words
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', fontSize: '1.2rem' }}>
                            <span style={{ cursor: 'pointer' }}>📎</span>
                            <span style={{ cursor: 'pointer' }}>≡</span>
                        </div>
                    </div>
                </div>

                {/* Big Record Button Area */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px',
                    marginTop: '20px',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100px',
                        height: '100px'
                    }}>
                        {/* Glow effect */}
                        <div style={{
                            position: 'absolute',
                            width: '120px',
                            height: '120px',
                            background: isRecording ? 'radial-gradient(circle, rgba(224,142,254,0.4) 0%, rgba(0,0,0,0) 70%)' : 'radial-gradient(circle, rgba(224,142,254,0.15) 0%, rgba(0,0,0,0) 70%)',
                            borderRadius: '50%',
                            animation: isRecording ? 'pulse 1.5s infinite' : 'none'
                        }} />

                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'linear-gradient(180deg, #D4A5FF 0%, #A37BFF 100%)',
                                border: 'none',
                                color: '#FFF',
                                fontSize: '1.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 2,
                                boxShadow: '0 8px 20px rgba(163, 123, 255, 0.2)'
                            }}
                        >
                            {isRecording ? '⬛' : '🎙'}
                        </button>
                    </div>

                    <span style={{
                        color: '#E08EFE',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase'
                    }}>
                        {isRecording ? 'RECORDING...' : 'RECORD ANSWER'}
                    </span>
                </div>

            </main>

            {/* Bottom Navigation */}
            <footer style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '30px 40px',
                background: '#111218'
            }}>
                <button
                    onClick={handleSkip}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#8B949E',
                        fontSize: '0.85rem',
                        letterSpacing: '1.5px',
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                    }}
                >
                    SKIP QUESTION
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <button style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#8B949E',
                        fontSize: '0.85rem',
                        letterSpacing: '1.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textTransform: 'uppercase'
                    }}>
                        <span>⏸</span> PAUSE SESSION
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={evaluating}
                        style={{
                            padding: '14px 30px',
                            borderRadius: '30px',
                            background: 'linear-gradient(90deg, #D9B8FF 0%, #B892FF 100%)',
                            color: '#000',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            letterSpacing: '1px',
                            cursor: evaluating ? 'wait' : 'pointer',
                            textTransform: 'uppercase',
                            opacity: evaluating ? 0.7 : 1
                        }}
                    >
                        {evaluating ? 'SUBMITTING...' : 'SUBMIT ANSWER'}
                    </button>
                </div>
            </footer>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.3); opacity: 0.4; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default InterviewRoom;
