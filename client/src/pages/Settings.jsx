import Card from '../components/Card';

const Settings = () => {
    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="display-md" style={{ marginBottom: '30px' }}>Settings</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Account Preferences */}
                <Card title="Account Preferences" className="glass-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="flex-between">
                            <div>
                                <div style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Email Notifications</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>Receive weekly progress reports and platform updates.</div>
                            </div>
                            <Toggle defaultChecked={true} />
                        </div>
                        <div style={{ height: '1px', background: 'var(--outline-variant)' }} />
                        <div className="flex-between">
                            <div>
                                <div style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Data Sharing</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>Allow anonymous data usage to improve AI training.</div>
                            </div>
                            <Toggle defaultChecked={false} />
                        </div>
                    </div>
                </Card>

                {/* AI Configuration */}
                <Card title="AI Configuration" className="glass-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="flex-between">
                            <div>
                                <div style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Strict Mode Scoring</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>Enable harsher grading for filler words and hesitation.</div>
                            </div>
                            <Toggle defaultChecked={true} />
                        </div>
                        <div style={{ height: '1px', background: 'var(--outline-variant)' }} />
                        <div className="flex-between">
                            <div>
                                <div style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Default Interview Persona</div>
                            </div>
                            <select style={{ 
                                padding: '8px 16px', 
                                background: 'var(--surface-container-high)', 
                                color: 'var(--on-surface)',
                                border: '1px solid var(--outline-variant)',
                                borderRadius: '8px',
                                outline: 'none'
                             }}>
                                <option>Professional</option>
                                <option>Strict & Technical</option>
                                <option>Friendly & Casual</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Danger Zone */}
                <Card title="Danger Zone" className="glass-card" style={{ border: '1px solid rgba(255, 110, 132, 0.3)' }}>
                    <div className="flex-between">
                        <div>
                            <div style={{ fontSize: '1.1rem', marginBottom: '5px', color: 'var(--error)' }}>Clear Interview Data</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>Permanently delete all audio transcripts and past scores.</div>
                        </div>
                        <button className="btn-outline" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>Clear Logs</button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const Toggle = ({ defaultChecked }) => (
    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
        <input type="checkbox" defaultChecked={defaultChecked} style={{ opacity: 0, width: 0, height: 0 }} />
        <span style={{
            display: 'inline-block', width: '40px', height: '24px', background: defaultChecked ? 'var(--primary)' : 'var(--outline-variant)',
            borderRadius: '12px', position: 'relative', transition: '0.3s'
        }}>
            <span style={{
                position: 'absolute', top: '2px', left: defaultChecked ? '18px' : '2px', width: '20px', height: '20px',
                background: 'white', borderRadius: '50%', transition: '0.3s'
            }} />
        </span>
    </label>
);

export default Settings;
