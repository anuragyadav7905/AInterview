import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const InterviewSummary = () => {
    const { id } = useParams();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem('token');
                // Support both routes
                const reportId = id || window.location.pathname.split('/')[2];

                const res = await axios.get(`/api/interview/${reportId}/summary`, {
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

    if (loading) return <div className="flex-center" style={{ height: '80vh' }}>Loading Report...</div>;
    if (!summary) return <div className="flex-center">Report Not Found</div>;

    const { interview, highlights, questions, feedback } = summary;

    // Chart Data
    const scoreData = [
        { name: 'Score', value: interview.averageScore },
        { name: 'Remaining', value: 10 - interview.averageScore }
    ];
    const COLORS = ['#00e5ff', 'rgba(255,255,255,0.1)'];

    return (
        <div className="fade-in">
            <h1 className="text-gradient" style={{ marginBottom: '30px' }}>Session Report</h1>

            {/* Top Row: Score & Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>
                <Card title="Overall Score" className="flex-center" style={{ flexDirection: 'column' }}>
                    <div style={{ height: '200px', width: '100%' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={scoreData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    {scoreData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)',
                            fontSize: '2rem', fontWeight: 'bold'
                        }}>
                            {interview.averageScore}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '-40px' }}>
                        <div style={{ color: 'var(--text-muted)' }}>{interview.role}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>{interview.difficulty} • {interview.style}</div>
                    </div>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Auto-Feedback */}
                    <Card title="AI Feedback 🤖">
                        {feedback.length > 0 ? (
                            <ul style={{ paddingLeft: '20px' }}>
                                {feedback.map((item, i) => (
                                    <li key={i} style={{ marginBottom: '10px', color: 'var(--text-main)' }}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--success)' }}>Outstanding performance! No major issues detected.</p>
                        )}
                    </Card>

                    {/* Highlights */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1 }}>
                        <Card title="Best Answer 🏆">
                            {highlights.bestAnswer ? (
                                <>
                                    <div style={{ fontSize: '2rem', color: 'var(--success)', fontWeight: 'bold' }}>{highlights.bestAnswer.score}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>"{highlights.bestAnswer.question.substring(0, 50)}..."</div>
                                </>
                            ) : <div>N/A</div>}
                        </Card>
                        <Card title="Needs Focus 🎯">
                            {highlights.worstAnswer ? (
                                <>
                                    <div style={{ fontSize: '2rem', color: 'var(--warning)', fontWeight: 'bold' }}>{highlights.worstAnswer.score}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>"{highlights.worstAnswer.question.substring(0, 50)}..."</div>
                                </>
                            ) : <div>N/A</div>}
                        </Card>
                    </div>
                </div>
            </div>

            {/* Questions Table */}
            <Card title="Question Breakdown">
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Question</th>
                            <th style={{ padding: '10px' }}>WPM</th>
                            <th style={{ padding: '10px' }}>Fillers</th>
                            <th style={{ padding: '10px' }}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px 10px' }}>{q.content}</td>
                                <td style={{ padding: '15px 10px' }}>{q.wpm || '-'}</td>
                                <td style={{ padding: '15px 10px' }}>{q.fillerCount || '-'}</td>
                                <td style={{ padding: '15px 10px', fontWeight: 'bold', color: q.finalScore >= 8 ? 'var(--success)' : q.finalScore >= 5 ? 'var(--warning)' : 'var(--danger)' }}>
                                    {q.finalScore || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <div className="flex-center" style={{ marginTop: '30px', gap: '20px' }}>
                <Link to="/dashboard"><button className="btn-primary">Back to Dashboard</button></Link>
                <Link to="/history"><button className="btn-outline">View History</button></Link>
            </div>
        </div>
    );
};

export default InterviewSummary;
