import { useState, useEffect } from 'react';
import Card from '../components/Card';

const Settings = () => {
    const [notifications, setNotifications] = useState(true);
    const [persona, setPersona] = useState('Professional');
    const [saved, setSaved] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const prefs = JSON.parse(
                localStorage.getItem('userPreferences') || '{}'
            );
            if (prefs.notifications !== undefined) {
                setNotifications(prefs.notifications);
            }
            if (prefs.persona) {
                setPersona(prefs.persona);
            }
        } catch (e) {
            // ignore parse errors
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('userPreferences', JSON.stringify({
            notifications,
            persona
        }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="fade-in" style={{ 
            maxWidth: '800px', 
            margin: '0 auto' 
        }}>
            <h1 className="display-md" style={{ marginBottom: '30px' }}>
                Settings
            </h1>

            {/* Success Toast */}
            {saved && (
                <div style={{
                    background: 'rgba(224,142,254,0.15)',
                    border: '1px solid rgba(224,142,254,0.3)',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    marginBottom: '20px',
                    color: 'var(--primary)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    ✓ Settings saved successfully
                </div>
            )}

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px' 
            }}>

                {/* Preferences */}
                <Card title="Preferences">
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '24px' 
                    }}>
                        {/* Notifications Toggle */}
                        <div className="flex-between">
                            <div>
                                <div style={{ 
                                    fontSize: '1rem', 
                                    marginBottom: '4px',
                                    fontWeight: '500'
                                }}>
                                    Email Notifications
                                </div>
                                <div style={{ 
                                    fontSize: '0.85rem', 
                                    color: 'var(--on-surface-variant)' 
                                }}>
                                    Receive session summaries by email.
                                </div>
                            </div>
                            <Toggle 
                                checked={notifications} 
                                onChange={setNotifications} 
                            />
                        </div>

                        <div style={{ 
                            height: '1px', 
                            background: 'var(--outline-variant)' 
                        }} />

                        {/* Persona Selector */}
                        <div className="flex-between">
                            <div>
                                <div style={{ 
                                    fontSize: '1rem', 
                                    marginBottom: '4px',
                                    fontWeight: '500'
                                }}>
                                    Default Interviewer Persona
                                </div>
                                <div style={{ 
                                    fontSize: '0.85rem', 
                                    color: 'var(--on-surface-variant)' 
                                }}>
                                    Sets the AI tone for every interview.
                                </div>
                            </div>
                            <select
                                value={persona}
                                onChange={(e) => setPersona(e.target.value)}
                                style={{
                                    padding: '8px 16px',
                                    background: 'var(--surface-container-high)',
                                    color: 'var(--on-surface)',
                                    border: '1px solid var(--outline-variant)',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    width: '180px'
                                }}
                            >
                                <option>Professional</option>
                                <option>Strict & Technical</option>
                                <option>Friendly & Casual</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="btn-primary"
                    style={{ 
                        padding: '14px', 
                        fontSize: '1rem',
                        alignSelf: 'flex-start',
                        minWidth: '160px'
                    }}
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
};

// Proper controlled Toggle component
const Toggle = ({ checked, onChange }) => {
    return (
        <div
            onClick={() => onChange(!checked)}
            style={{
                width: '48px',
                height: '26px',
                borderRadius: '13px',
                background: checked 
                    ? 'var(--primary)' 
                    : 'var(--surface-container-high)',
                border: '1px solid var(--outline-variant)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                flexShrink: 0
            }}
        >
            <div style={{
                position: 'absolute',
                top: '3px',
                left: checked ? '24px' : '3px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'white',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }} />
        </div>
    );
};

export default Settings;
