import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import useAudioRecorder from '../hooks/useAudioRecorder';
import Card from '../components/Card';

const InterviewRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);
    const [interviewData, setInterviewData] = useState(null);

    // Audio Hook
    const { isRecording, audioBlob, startRecording, stopRecording } = useAudioRecorder();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const token = localStorage.getItem('token');

                // Get Interview Details (for Style/Role)
                const interviewRes = await axios.get(`/api/interview/${id}?n=${Date.now()}`, { // Cache bust
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInterviewData(interviewRes.data);

                // Get Questions
                const res = await axios.post(`/api/interview/${id}/questions`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setQuestions(res.data);

                // Check if we should resume
                const answeredCount = res.data.filter(q => q.finalScore).length;
                if (answeredCount === res.data.length && res.data.length > 0) {
                    navigate(`/summary/${id}`);
                } else {
                    setCurrentQuestionIndex(answeredCount);
                }

            } catch (err) {
                console.error(err);
                alert("Error loading session");
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [id, navigate]);

    // Handle Audio Upload when blob is ready
    useEffect(() => {
        if (audioBlob) {
            submitAnswer(audioBlob);
        }
    }, [audioBlob]);

    const submitAnswer = async (blob) => {
        setEvaluating(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('audio', blob, 'answer.wav');
            formData.append('questionId', questions[currentQuestionIndex]._id);
            formData.append('interviewId', id);

            // 1. Upload & Transcribe
            const answerRes = await axios.post('/api/interview/answer', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            // Update local state with transcript
            const updatedQuestions = [...questions];
            updatedQuestions[currentQuestionIndex].transcript = answerRes.data.transcript;

            // 2. Evaluate
            const evalRes = await axios.post('/api/interview/evaluate', {
                questionId: questions[currentQuestionIndex]._id,
                interviewId: id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state with score
            const evaluation = evalRes.data;
            Object.assign(updatedQuestions[currentQuestionIndex], {
                score: evaluation.score,
                feedback: evaluation.feedback,
                voiceScore: evaluation.voiceScore,
                finalScore: evaluation.finalScore,
                wpm: evaluation.wpm,
                fillerCount: evaluation.fillerCount
            });

            setQuestions(updatedQuestions);

        } catch (err) {
            console.error(err);
            alert('Failed to submit answer');
        } finally {
            setEvaluating(false);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            navigate(`/summary/${id}`);
        }
    };

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading Interview Environment...</div>;

    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return <div className="flex-center">No Questions Data</div>;

    return (
        <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header: Progress & Persona */}
            <div className="flex-between" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {questions.map((_, i) => (
                        <div key={i} style={{
                            width: '40px', height: '4px',
                            background: i <= currentQuestionIndex ? 'var(--primary)' : 'var(--glass-border)',
                            borderRadius: '2px'
                        }} />
                    ))}
                </div>
                {interviewData && (
                    <div style={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        border: '1px solid var(--accent)',
                        color: 'var(--accent)'
                    }}>
                        Speaking with: <strong>{interviewData.style} AI</strong>
                    </div>
                )}
            </div>

            {/* Main Stage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>

                {/* Question Card */}
                <Card className="glass-card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(0, 229, 255, 0.3)', boxShadow: '0 0 30px rgba(0, 229, 255, 0.1)' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Question {currentQuestionIndex + 1} / {questions.length}
                    </div>
                    <h2 style={{ fontSize: '1.8rem', lineHeight: '1.4', maxWidth: '80%' }}>
                        "{currentQ.content}"
                    </h2>

                    {/* Recording Controls */}
                    <div style={{ marginTop: '40px' }}>
                        {!currentQ.finalScore && !evaluating && (
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: isRecording ? 'var(--danger)' : 'var(--primary)',
                                    color: 'white',
                                    fontSize: '2rem',
                                    boxShadow: isRecording ? '0 0 30px var(--danger)' : '0 0 30px var(--primary)',
                                    animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                {isRecording ? '⬛' : '🎤'}
                            </button>
                        )}

                        {evaluating && (
                            <div className="flex-center" style={{ flexDirection: 'column', gap: '10px' }}>
                                <div className="loader"></div> {/* Add CSS loader later if needed */}
                                <div style={{ color: 'var(--primary)' }}>Analyzing Content & Voice...</div>
                            </div>
                        )}
                    </div>
                    {isRecording && <div style={{ marginTop: '15px', color: 'var(--danger)', fontWeight: 'bold' }}>Recording...</div>}
                </Card>

                {/* Feedback Panel (Appears after answer) */}
                {currentQ.finalScore && (
                    <div className="fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                            {/* Analysis */}
                            <Card title="AI Analysis">
                                <div style={{ marginBottom: '20px' }}>
                                    <h4 style={{ color: 'var(--text-muted)' }}>Transcript:</h4>
                                    <p style={{ fontStyle: 'italic', color: 'var(--text-main)', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                                        "{currentQ.transcript}"
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ color: 'var(--text-muted)' }}>Feedback:</h4>
                                    <p>{currentQ.feedback}</p>
                                </div>
                            </Card>

                            {/* Score Card */}
                            <Card title="Score" style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '3.5rem',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(to bottom, var(--primary), var(--accent))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '10px'
                                }}>
                                    {currentQ.finalScore}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <div>Content <br /><strong style={{ color: 'var(--text-main)' }}>{currentQ.score}</strong></div>
                                    <div>Voice <br /><strong style={{ color: 'var(--text-main)' }}>{currentQ.voiceScore}</strong></div>
                                </div>
                                <div style={{ marginTop: '20px', textAlign: 'left', fontSize: '0.9rem' }}>
                                    <div>⚡ Pace: <strong>{currentQ.wpm} WPM</strong></div>
                                    <div>😶 Fillers: <strong>{currentQ.fillerCount}</strong></div>
                                </div>
                                <button onClick={handleNext} className="btn-primary" style={{ marginTop: '20px', width: '100%' }}>
                                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Summary'}
                                </button>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
            `}</style>
        </div>
    );
};

export default InterviewRoom;
