import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const History = () => {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/interview/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInterviews(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, []);

    const getScoreColor = (score) => {
        if (score >= 8) return 'var(--success)';
        if (score >= 5) return 'var(--warning)';
        return 'var(--danger)';
    };

    return (
        <div className="fade-in">
            <h1 className="text-gradient" style={{ marginBottom: '30px' }}>Interview History</h1>

            {interviews.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>
                    <h3>No interviews found</h3>
                    <p>Start your first session to track your progress!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {interviews.map((interview) => (
                        <Card key={interview._id} className="glass-card">
                            <div className="flex-between" style={{ marginBottom: '10px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{interview.role}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {new Date(interview.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', fontSize: '0.9rem' }}>
                                <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>{interview.difficulty}</span>
                                {interview.averageScore > 0 && (
                                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: getScoreColor(interview.averageScore), border: `1px solid ${getScoreColor(interview.averageScore)}` }}>
                                        Score: {interview.averageScore}
                                    </span>
                                )}
                            </div>

                            <Link to={`/summary/${interview._id}`}>
                                <button className="btn-outline" style={{ width: '100%', padding: '8px' }}>View Report</button>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
