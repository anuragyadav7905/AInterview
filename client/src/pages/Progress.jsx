import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Card from '../components/Card';

const Progress = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/interview/progress', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProgress();
    }, []);

    const bestScore = data.length > 0 ? Math.max(...data.map(d => d.score)) : 0;
    const totalSessions = data.length;

    return (
        <div className="fade-in">
            <h1 className="text-gradient" style={{ marginBottom: '30px' }}>Your Progress</h1>

            {/* Top Stats */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <Card className="flex-center" style={{ flex: 1, flexDirection: 'column' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{totalSessions}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Total Sessions</div>
                </Card>
                <Card className="flex-center" style={{ flex: 1, flexDirection: 'column' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{bestScore}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Best Score</div>
                </Card>
            </div>

            {/* Chart */}
            <Card title="Score History In-Depth">
                <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
                    {data.length > 0 ? (
                        <ResponsiveContainer>
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" domain={[0, 10]} />
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--glass-border)', color: 'white' }}
                                    itemStyle={{ color: 'var(--primary)' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#00e5ff" stopColor="#00e5ff" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>
                            No enough data to display chart.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Progress;
