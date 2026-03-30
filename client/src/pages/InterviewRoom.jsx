import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InterviewRoom = () => {
    const navigate = useNavigate();

    // Core states
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputMode, setInputMode] = useState('voice'); // 'voice' or 'text'
    const [textInput, setTextInput] = useState('');
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const [interviewId, setInterviewId] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);

    // Audio recording states
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessingVoice, setIsProcessingVoice] = useState(false);
    const [audioDataArray, setAudioDataArray] = useState(new Uint8Array(20));
    
    const messagesEndRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);
    const chunksRef = useRef([]);

    const MAX_QUESTIONS = 4;

    // --- Initialization & API Calls ---
    useEffect(() => {
        const initSession = async () => {
            const cvId = localStorage.getItem('cvId');
            setIsTyping(true);

            try {
                const token = localStorage.getItem('token');
                
                // Real API Hookup (Fallback to mock if needed)
                let resId;
                try {
                    const startRes = await axios.post('/api/interview/start', { cvId }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    resId = startRes.data.interviewId || startRes.data.id;
                } catch (e) {
                    resId = `mock_int_${Date.now()}`;
                }
                
                setInterviewId(resId);
                
                // Determine greeting
                const greeting = "Hello! I'm your AI interviewer today. " + 
                    (cvId 
                        ? "I've reviewed your resume and I'm ready to ask you some questions based on your experience. " 
                        : "Let's start with a general interview. I'll ask you some common interview questions. ") +
                    "Shall we begin?";

                setIsTyping(false);
                addMessage('ai', greeting);
            } catch (err) {
                console.error(err);
                setIsTyping(false);
            }
        };

        // Small delay for realism
        setTimeout(initSession, 1000);

        return () => stopRecordingCleanup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto layout scroller
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Cleanup audio resources
    const stopRecordingCleanup = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(e => console.error(e));
        }
    };

    // --- Message Management ---
    const addMessage = (sender, text) => {
        const newMsg = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            sender,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            eval: null,
            isRevealed: false
        };
        setMessages(prev => [...prev, newMsg]);
        return newMsg.id;
    };

    const toggleEvalReveal = (msgId) => {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isRevealed: !m.isRevealed } : m));
    };

    const handleUserSubmit = async (text) => {
        if (!text.trim()) return;
        
        setShowQuickReplies(false);
        const thisMsgId = addMessage('user', text);
        setTextInput('');
        setIsTyping(true);
        setQuestionCount(prev => prev + 1);

        // Terminate path if we hit max questions
        if (questionCount >= MAX_QUESTIONS - 1) {
            setTimeout(() => {
                navigate(`/summary/${interviewId || 'latest'}`);
            }, 3000);
            addMessage('ai', "Thank you for your time. That concludes our interview. Please wait while I generate your final summary report...");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const [evalRes, nextQRes] = await Promise.allSettled([
                axios.post('/api/interview/evaluate', { answer: text, interviewId }, { headers: { Authorization: `Bearer ${token}` } }),
                axios.post(`/api/interview/${interviewId}/questions`, {}, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            // Setup next Question
            setIsTyping(false);
            const nextQuestion = nextQRes.status === 'fulfilled' && nextQRes.value.data.question 
                ? nextQRes.value.data.question 
                : generateMockQuestion(questionCount);
            
            addMessage('ai', nextQuestion);

            // Update user message with evaluation data silently in background
            const evaluation = evalRes.status === 'fulfilled' && evalRes.value.data.evaluation
                ? evalRes.value.data.evaluation
                : generateMockEval();
                
            setMessages(prev => prev.map(m => m.id === thisMsgId ? { ...m, eval: evaluation } : m));

        } catch (error) {
            console.error(error);
            setIsTyping(false);
            addMessage('ai', generateMockQuestion(questionCount));
            
            setTimeout(() => {
                setMessages(prev => prev.map(m => m.id === thisMsgId ? { ...m, eval: generateMockEval() } : m));
            }, 1000);
        }
    };

    // --- Audio Logic ---
    const toggleRecording = async () => {
        if (isRecording) {
            // Stop recording
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessingVoice(true);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            // reset visualizer
            setAudioDataArray(new Uint8Array(20));
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 64; 
                
                const source = audioContextRef.current.createMediaStreamSource(stream);
                source.connect(analyserRef.current);
                
                const bufferLength = analyserRef.current.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                const drawWaveform = () => {
                    if (!analyserRef.current) return;
                    animationFrameRef.current = requestAnimationFrame(drawWaveform);
                    analyserRef.current.getByteFrequencyData(dataArray);
                    setAudioDataArray(new Uint8Array(dataArray.slice(0, 20))); // Take exactly 20 bins
                };
                drawWaveform();

                mediaRecorderRef.current.ondataavailable = e => {
                    if (e.data.size > 0) chunksRef.current.push(e.data);
                };

                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                    chunksRef.current = [];
                    stream.getTracks().forEach(track => track.stop());
                    
                    if (audioContextRef.current?.state !== 'closed') {
                        audioContextRef.current.close().catch(e => console.error(e));
                    }

                    // Process blob here (simulate api transcription)
                    setTimeout(() => {
                        setIsProcessingVoice(false);
                        handleUserSubmit("This is a transcribed voice answer demonstrating my communication skills and technical knowledge.");
                    }, 1500);
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Microphone access denied or failed", err);
                alert("Please ensure microphone permissions are granted.");
            }
        }
    };

    const handleEndInterview = () => {
        if (window.confirm("Are you sure you want to end the interview early?")) {
            navigate(`/summary/${interviewId || 'latest'}`);
        }
    };

    // --- Mocks ---
    const generateMockQuestion = (idx) => {
        const qs = [
            "Could you describe a time when you had to work with a difficult colleague?",
            "Can you explain a complex project you led and how you managed the timelines?",
            "What is your approach to resolving disputes within a team?",
            "Where do you see your technical skills making the biggest impact in the next two years?"
        ];
        return qs[idx % qs.length];
    };
    
    const generateMockEval = () => ({
        score: Math.floor(Math.random() * 3) + 7, // 7 to 9
        strength: "Clear articulation of your role.",
        improvement: "Provide more quantifiable metrics."
    });

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100vh', 
            background: 'var(--bg-dark, #0a0e14)', color: '#fff', fontFamily: 'var(--font-body, "Inter", sans-serif)'
        }}>
            {/* Header */}
            <header style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 24px', background: 'var(--surface-container-highest, #13151f)',
                borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0
            }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary, #e08efe)' }}>
                    AInterview
                </div>

                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '20px',
                    fontSize: '0.85rem', fontWeight: '600'
                }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success, #4cd964)', animation: 'pulseStatus 2s infinite' }} />
                    In Progress
                </div>

                <button onClick={handleEndInterview} style={{
                    background: 'transparent', border: '1px solid rgba(255,82,82,0.4)', color: '#ff5252',
                    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
                    transition: 'all 0.2s', fontWeight: '500'
                }} onMouseOver={e => e.target.style.background = 'rgba(255,82,82,0.1)'} onMouseOut={e => e.target.style.background = 'transparent'}>
                    End Interview
                </button>
            </header>

            {/* Chat Area */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '30px 20px', 
                display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', margin: '0 auto', width: '100%'
            }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
                        width: '100%'
                    }}>
                        <div style={{
                            display: 'flex', gap: '12px', maxWidth: '85%',
                            flexDirection: msg.sender === 'ai' ? 'row' : 'row-reverse'
                        }}>
                            {/* AI Avatar */}
                            {msg.sender === 'ai' && (
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(224, 142, 254, 0.3)'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
                                    </svg>
                                </div>
                            )}

                            {/* Bubble */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: msg.sender === 'ai' ? 'flex-start' : 'flex-end' }}>
                                <div style={{
                                    padding: '16px 20px',
                                    fontSize: '1.05rem', lineHeight: '1.5',
                                    background: msg.sender === 'ai' ? 'rgba(224, 142, 254, 0.08)' : 'var(--surface-bright, rgba(255, 255, 255, 0.05))',
                                    border: msg.sender === 'ai' ? '1px solid rgba(224, 142, 254, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: msg.sender === 'ai' ? '4px 20px 20px 20px' : '20px 4px 20px 20px',
                                    backdropFilter: 'blur(10px)',
                                    color: msg.sender === 'ai' ? '#fcfcfc' : '#fff'
                                }}>
                                    {msg.text}
                                </div>
                                
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: '0 4px' }}>
                                    {msg.timestamp}
                                </div>

                                {/* Evaluation Expandable Chip for User Message */}
                                {msg.sender === 'user' && msg.eval && (
                                    <div style={{ marginTop: '4px', alignSelf: 'flex-end', width: '100%', maxWidth: '350px' }}>
                                        <button 
                                            onClick={() => toggleEvalReveal(msg.id)}
                                            style={{
                                                background: 'rgba(137, 149, 255, 0.1)', border: '1px solid rgba(137, 149, 255, 0.2)',
                                                color: 'var(--secondary, #8995ff)', padding: '6px 12px', borderRadius: '12px',
                                                fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', float: 'right'
                                            }}
                                        >
                                            View Feedback {msg.isRevealed ? '↑' : '↓'}
                                        </button>
                                        
                                        {msg.isRevealed && (
                                            <div style={{
                                                clear: 'both', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)',
                                                borderRadius: '12px', padding: '12px', marginTop: '36px', fontSize: '0.85rem', color: '#ccc', animation: 'fadeIn 0.3s ease-out'
                                            }}>
                                                <div style={{ color: msg.eval.score >= 8 ? '#4cd964' : '#ffea00', fontWeight: 'bold', marginBottom: '4px' }}>
                                                    Score: {msg.eval.score}/10
                                                </div>
                                                <div style={{ marginBottom: '4px' }}><strong style={{ color: '#fff' }}>Strength:</strong> {msg.eval.strength}</div>
                                                <div><strong style={{ color: '#fff' }}>Improvement:</strong> {msg.eval.improvement}</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Quick Replies (Only directly after intro) */}
                {showQuickReplies && messages.length === 1 && !isTyping && (
                    <div style={{ display: 'flex', gap: '10px', marginLeft: '48px', flexWrap: 'wrap', animation: 'fadeInUp 0.5s ease-out' }}>
                        {["Yes, let's start", "Give me a moment", "What topics will you cover?"].map((chip) => (
                            <button key={chip} onClick={() => handleUserSubmit(chip)} style={{
                                background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)',
                                padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s'
                            }} onMouseOver={e => e.target.style.background = 'rgba(224, 142, 254, 0.1)'} onMouseOut={e => e.target.style.background = 'transparent'}>
                                {chip}
                            </button>
                        ))}
                    </div>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                    <div style={{ display: 'flex', gap: '12px', maxWidth: '85%' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
                            </svg>
                        </div>
                        <div style={{
                            padding: '16px 20px', background: 'rgba(224, 142, 254, 0.08)', border: '1px solid rgba(224, 142, 254, 0.2)',
                            borderRadius: '4px 20px 20px 20px', display: 'flex', gap: '6px', alignItems: 'center'
                        }}>
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Area */}
            <footer style={{
                background: 'var(--surface-container, rgba(20, 24, 33, 0.95))', borderTop: '1px solid rgba(255,255,255,0.05)',
                padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, position: 'relative'
            }}>
                <button 
                    onClick={() => setInputMode(prev => prev === 'voice' ? 'text' : 'voice')}
                    style={{ position: 'absolute', top: '-14px', right: '40px', background: 'var(--surface-highest, #2a2d3a)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 16px', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    Switch to {inputMode === 'voice' ? 'Text ⌨️' : 'Voice 🎙️'}
                </button>

                {inputMode === 'voice' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%', height: '140px', justifyContent: 'center' }}>
                        <div style={{ color: isProcessingVoice ? 'var(--secondary)' : (isRecording ? '#ff5252' : 'rgba(255,255,255,0.5)'), fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', animation: isRecording || isProcessingVoice ? 'pulseText 1.5s infinite' : 'none' }}>
                            {isProcessingVoice ? 'Processing...' : (isRecording ? 'Recording... Tap to stop' : 'Tap to speak')}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {/* Left Waveform */}
                            {isRecording && (
                                <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'center' }}>
                                    {[...Array(10)].map((_, i) => (
                                        <div key={`l-${i}`} style={{ width: '4px', background: 'var(--primary)', borderRadius: '2px', height: `${Math.max(4, audioDataArray[i] / 4)}px`, transition: 'height 0.1s ease' }} />
                                    ))}
                                </div>
                            )}

                            {/* Mic Button */}
                            <button 
                                onClick={toggleRecording}
                                disabled={isProcessingVoice}
                                style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    background: isRecording ? 'linear-gradient(135deg, #ff5252, #cc0000)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                    border: 'none', color: '#fff', cursor: isProcessingVoice ? 'wait' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: isRecording ? '0 0 30px rgba(255, 82, 82, 0.4)' : '0 10px 20px rgba(224, 142, 254, 0.3)',
                                    transition: 'all 0.3s', opacity: isProcessingVoice ? 0.5 : 1, transform: isRecording ? 'scale(1.05)' : 'scale(1)'
                                }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {isRecording ? <rect x="7" y="7" width="10" height="10" /> : <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>}
                                </svg>
                            </button>

                            {/* Right Waveform */}
                            {isRecording && (
                                <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'center' }}>
                                    {[...Array(10)].map((_, i) => (
                                        <div key={`r-${i}`} style={{ width: '4px', background: 'var(--secondary)', borderRadius: '2px', height: `${Math.max(4, audioDataArray[19-i] / 4)}px`, transition: 'height 0.1s ease' }} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ width: '100%', maxWidth: '900px', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                        <textarea 
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleUserSubmit(textInput); } }}
                            placeholder="Type your response here..."
                            style={{
                                flex: 1, minHeight: '60px', maxHeight: '150px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '16px', padding: '16px 20px', color: '#fff', fontSize: '1rem',
                                resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: '1.5'
                            }}
                        />
                        <button 
                            onClick={() => handleUserSubmit(textInput)}
                            style={{
                                width: '60px', height: '60px', borderRadius: '16px', flexShrink: 0,
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </button>
                    </div>
                )}
            </footer>

            <style>{`
                @keyframes pulseStatus {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 217, 100, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(76, 217, 100, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 217, 100, 0); }
                }
                @keyframes pulseText {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes typingBounce {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
                    30% { transform: translateY(-4px); opacity: 1; }
                }
                .typing-dot {
                    width: 6px; height: 6px; border-radius: 50%; background: var(--primary);
                    animation: typingBounce 1.4s infinite;
                }
                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Scrollbar hiding for cleaner look */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
};

export default InterviewRoom;
