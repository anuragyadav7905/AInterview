import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ResumeViewer from '../components/ResumeViewer';
import Card from '../components/Card';

const Dashboard = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [weaknesses, setWeaknesses] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    // Mock stats for visual flair
    const [stats, setStats] = useState({ interviews: 0, avgScore: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch CV
                try {
                    const cvRes = await axios.get('/api/upload-cv/latest', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUploadedFile(cvRes.data);
                } catch (err) { }

                // Fetch Weaknesses
                const weakRes = await axios.get('/api/interview/weakness', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWeaknesses(weakRes.data);

                // Fetch Suggestions
                const suggRes = await axios.get('/api/upload-cv/suggestions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuggestions(suggRes.data);

                // Fetch Progress (for stats)
                const progRes = await axios.get('/api/interview/progress', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (progRes.data.length > 0) {
                    const latest = progRes.data[progRes.data.length - 1].score;
                    setStats({ interviews: progRes.data.length, avgScore: latest });
                }

            } catch (err) {
                console.error("Error fetching dashboard data", err);
            }
        };
        fetchData();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0]?.name || '');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/upload-cv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            alert('CV Uploaded Successfully');
            window.location.reload();
        } catch (err) {
            alert('Upload Failed');
        } finally {
            setLoading(false);
        }
    };

    const startPractice = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/interview/practice', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/interview/${res.data.interviewId}`);
        } catch (err) {
            alert('Failed to start practice session');
        }
    };

    return (
        <div className="fade-in">
            {/* Hero / Header */}
            <div style={{ marginBottom: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back! Ready to ace your next interview?</p>
            </div>

            {/* Quick Stats & Actions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <Card title="Start Interview" className="glass-card">
                    <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Begin a new AI-mock interview tailored to your profile.</p>
                    <Link to="/interview-setup">
                        <button className="btn-primary" style={{ width: '100%' }}>Launch Session 🚀</button>
                    </Link>
                </Card>

                <Card title="Performance" className="glass-card">
                    <div className="flex-between">
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.avgScore || 'N/A'}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Avg Score</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.interviews}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sessions</div>
                        </div>
                    </div>
                </Card>

                <Card title="Weak Areas" className="glass-card">
                    {weaknesses.length > 0 ? (
                        <>
                            <div style={{ marginBottom: '15px' }}>
                                <Badge>{weaknesses[0].issue}</Badge>
                            </div>
                            <button onClick={startPractice} className="btn-outline" style={{ width: '100%' }}>Practice This 🎯</button>
                        </>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No weak areas detected yet!
                        </div>
                    )}
                </Card>
            </div>

            {/* Main Content Grid: Resume vs Improvement */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                {/* Left Column: Resume */}
                <Card title="My Resume">
                    {!uploadedFile ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📄</div>
                            <h4 style={{ marginBottom: '10px' }}>No Resume Uploaded</h4>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Upload your CV to generate personalized questions.</p>
                            <form onSubmit={handleUpload}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label htmlFor="file-upload" className="btn-outline" style={{ display: 'inline-block', cursor: 'pointer' }}>
                                        {fileName || 'Select PDF/DOCX'}
                                    </label>
                                    <input id="file-upload" type="file" onChange={handleFileChange} accept=".pdf,.docx,.doc" style={{ display: 'none' }} />
                                </div>
                                {file && (
                                    <button type="submit" disabled={loading} className="btn-primary">
                                        {loading ? 'Processing...' : 'Upload Resume'}
                                    </button>
                                )}
                            </form>
                            {message && <div style={{ marginTop: '10px', color: 'var(--danger)' }}>{message}</div>}
                        </div>
                    ) : (
                        <div>
                            <div className="flex-between" style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--glass-border)' }}>
                                <div>
                                    <strong>{uploadedFile.fileName}</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Uploaded {new Date(uploadedFile.uploadedAt).toLocaleDateString()}</div>
                                </div>
                                <details>
                                    <summary style={{ cursor: 'pointer', color: 'var(--primary)', listStyle: 'none' }}>🔄 Replace</summary>
                                    <form onSubmit={handleUpload} style={{ position: 'absolute', background: 'var(--bg-dark)', padding: '15px', border: '1px solid var(--glass-border)', borderRadius: '8px', marginTop: '5px', zIndex: 10 }}>
                                        <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.doc" style={{ marginBottom: '10px' }} />
                                        <button type="submit" className="btn-primary" disabled={loading}>{loading ? '...' : 'Upload'}</button>
                                    </form>
                                </details>
                            </div>

                            {/* Render extracted data or raw text */}
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {uploadedFile.structuredData ? (
                                    <ResumeViewer data={uploadedFile.structuredData} />
                                ) : (
                                    <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)', fontFamily: 'inherit' }}>
                                        {uploadedFile.extractedText}
                                    </pre>
                                )}
                            </div>
                        </div>
                    )}
                </Card>

                {/* Right Column: Suggestions & Weaknesses Detail */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Full Weakness List */}
                    {weaknesses.length > 0 && (
                        <Card title="Areas for Improvement">
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {weaknesses.map((w, i) => (
                                    <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid var(--danger)' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--danger)', marginBottom: '5px' }}>{w.issue}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{w.tip}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Resume Tips */}
                    {suggestions.length > 0 && (
                        <Card title="Resume Tips 💡">
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {suggestions.map((s, i) => (
                                    <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid var(--warning)' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--warning)', marginBottom: '5px' }}>{s.section}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{s.tip}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

// Simple Badge Component inline for now or move to components
const Badge = ({ children }) => (
    <span style={{
        padding: '4px 8px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--danger)',
        border: '1px solid currentColor',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600'
    }}>
        {children}
    </span>
);

export default Dashboard;
