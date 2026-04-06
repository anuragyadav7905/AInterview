import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Card from '../components/Card';

const Progress = () => {
    const [data, setData] = useState([]);
    const [totalSessions, setTotalSessions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const [progressRes, historyRes] = await Promise.allSettled([
                    axios.get('/api/interview/progress', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/interview/history', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                if (progressRes.status === 'fulfilled') setData(progressRes.value.data);
                if (historyRes.status === 'fulfilled') setTotalSessions(historyRes.value.data.length);
            } catch (err) {
                setError('Could not load progress data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, []);

    const bestScore = data.length > 0
        ? Math.max(...data.map(d => d.score))
        : 0;
    const avgScore = data.length > 0
        ? (data.reduce((s, d) => s + d.score, 0) / data.length).toFixed(1)
        : 0;

    if (loading) return (
        <div className="flex-center" style={{ minHeight: '60vh' }}>
            <p style={{ color: 'var(--on-surface-variant)' }}>
                Loading your progress...
            </p>
        </div>
    );

    if (error) return (
        <div className="flex-center" style={{ minHeight: '60vh' }}>
            <p style={{ color: 'var(--tertiary)' }}>{error}</p>
        </div>
    );

    return (
        <div className="fade-in">
            <h1 className="display-md" style={{ marginBottom: '8px' }}>
                Your Progress
            </h1>
            <p style={{ 
                color: 'var(--on-surface-variant)', 
                marginBottom: '2rem' 
            }}>
                Track your interview performance over time.
            </p>

            {/* Top Stats - Real Data */}
            <div style={{ 
                display: 'flex', 
                gap: '20px', 
                marginBottom: '30px' 
            }}>
                <Card className="flex-center" style={{ 
                    flex: 1, 
                    flexDirection: 'column', 
                    padding: '1.5rem' 
                }}>
                    <div style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 'bold', 
                        color: 'var(--primary)' 
                    }}>
                        {totalSessions}
                    </div>
                    <div style={{ color: 'var(--on-surface-variant)' }}>
                        Total Sessions
                    </div>
                </Card>

                <Card className="flex-center" style={{ 
                    flex: 1, 
                    flexDirection: 'column', 
                    padding: '1.5rem' 
                }}>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'var(--secondary)'
                    }}>
                        {data.length > 0 ? `${Math.round((bestScore / 10) * 100)}%` : 0}
                    </div>
                    <div style={{ color: 'var(--on-surface-variant)' }}>
                        Best Score
                    </div>
                </Card>

                <Card className="flex-center" style={{
                    flex: 1,
                    flexDirection: 'column',
                    padding: '1.5rem'
                }}>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'var(--tertiary)'
                    }}>
                        {data.length > 0 ? `${Math.round((avgScore / 10) * 100)}%` : 0}
                    </div>
                    <div style={{ color: 'var(--on-surface-variant)' }}>
                        Average Score
                    </div>
                </Card>
            </div>

            {/* Chart or Empty State */}
            <Card title="Score History">
                <div style={{ 
                    height: '400px', 
                    width: '100%', 
                    marginTop: '20px' 
                }}>
                    {data.length >= 2 ? (
                        <ResponsiveContainer>
                            <AreaChart 
                                data={data} 
                                margin={{ 
                                    top: 10, 
                                    right: 30, 
                                    left: 0, 
                                    bottom: 0 
                                }}
                            >
                                <defs>
                                    <linearGradient 
                                        id="colorScore" 
                                        x1="0" y1="0" 
                                        x2="0" y2="1"
                                    >
                                        <stop 
                                            offset="5%" 
                                            stopColor="var(--primary)" 
                                            stopOpacity={0.4} 
                                        />
                                        <stop 
                                            offset="95%" 
                                            stopColor="var(--primary)" 
                                            stopOpacity={0} 
                                        />
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="date" 
                                    stroke="var(--on-surface-variant)" 
                                />
                                <YAxis
                                    stroke="var(--on-surface-variant)"
                                    domain={[0, 10]}
                                    tickFormatter={(v) => `${Math.round((v / 10) * 100)}%`}
                                />
                                <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    stroke="rgba(255,255,255,0.05)" 
                                />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: 'var(--surface-container-low)', 
                                        borderColor: 'var(--outline-variant)', 
                                        color: 'white' 
                                    }}
                                    itemStyle={{ color: 'var(--primary)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="score" 
                                    stroke="var(--primary)" 
                                    fillOpacity={1} 
                                    fill="url(#colorScore)" 
                                    strokeWidth={3} 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex-center" style={{ 
                            height: '100%', 
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ fontSize: '3rem' }}>📈</div>
                            <p style={{ color: 'var(--on-surface-variant)' }}>
                                Complete at least 2 interviews to see your progress chart.
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Progress;
