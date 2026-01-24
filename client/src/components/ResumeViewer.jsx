import React from 'react';

const ResumeViewer = ({ data }) => {
    if (!data) return null;

    const { name, email, phone, education, experience, skills, projects } = data;

    const Section = ({ title, content }) => {
        if (!content) return null;
        return (
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h4 style={{ marginTop: 0, borderBottom: '2px solid #007bff', paddingBottom: '5px', display: 'inline-block' }}>{title}</h4>
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>{content}</div>
            </div>
        );
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h2 style={{ margin: '0 0 10px 0' }}>{name || 'Unknown Candidate'}</h2>
                <p style={{ margin: 0 }}>
                    {email && <span>📧 {email} </span>}
                    {phone && <span style={{ marginLeft: '15px' }}>📱 {phone}</span>}
                </p>
            </div>

            <Section title="Education" content={education} />
            <Section title="Experience" content={experience} />
            <Section title="Projects" content={projects} />
            <Section title="Skills" content={skills} />
        </div>
    );
};

export default ResumeViewer;
