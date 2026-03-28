import { useState } from 'react';
import Card from '../components/Card';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: 'Sarah Connor',
        email: 'sarah.connor@sky.net',
        role: 'Senior Software Engineer',
        experience: '8 Years',
        skills: 'React, Node.js, GraphQL, AWS',
        photo: 'https://i.pravatar.cc/150?img=47'
    });

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="display-md" style={{ marginBottom: '30px' }}>User Profile</h1>

            <Card className="glass-card" style={{ display: 'flex', gap: '40px', alignItems: 'center', padding: '40px' }}>
                <img 
                    src={profile.photo} 
                    alt="Profile" 
                    style={{ 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%', 
                        border: '4px solid var(--surface-container-highest)',
                        boxShadow: '0 0 20px rgba(224, 142, 254, 0.2)'
                    }} 
                />
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Full Name</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{profile.name}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Email Address</div>
                        <div style={{ fontSize: '1.1rem' }}>{profile.email}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Target Role</div>
                        <div style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{profile.role}</div>
                    </div>
                </div>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                <Card title="Career Snapshot">
                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>Experience Level</div>
                        <div style={{ fontSize: '1.2rem' }}>{profile.experience}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>Core Technical Skills</div>
                        <div style={{ fontSize: '1rem', lineHeight: '1.5' }}>{profile.skills}</div>
                    </div>
                </Card>

                <Card title="Account Badges 🎖" className="flex-center" style={{ flexDirection: 'column' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚀</div>
                    <div style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Fast Learner</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', textAlign: 'center', marginTop: '5px' }}>
                        Completed 10 sessions with an improving average score.
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
