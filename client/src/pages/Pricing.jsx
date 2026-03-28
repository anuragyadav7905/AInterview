import { Link } from 'react-router-dom';

const Pricing = () => {
    return (
        <div className="fade-in" style={{ 
            minHeight: '100vh', 
            background: 'var(--surface)', 
            color: 'var(--on-surface)',
            padding: '60px 20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient Base */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '1000px',
                height: '500px',
                background: 'radial-gradient(ellipse, rgba(255, 132, 170, 0.15) 0%, rgba(10,14,20,0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 className="display-lg" style={{ marginBottom: '15px' }}>Simple, transparent pricing</h1>
                    <p className="body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', margin: '0 auto' }}>
                        Invest in your career. Choose the plan that gives you the AI edge you need to land your dream offer.
                    </p>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '40px',
                    alignItems: 'center'
                }}>
                    {/* Basic Plan */}
                    <PricingCard 
                        title="Starter" 
                        price="$0" 
                        period="/month"
                        features={["3 Basic Mock Interviews", "Standard AI Persona", "Basic Scorecard", "Community Access"]}
                        buttonLabel="Get Started"
                        outline={true}
                    />

                    {/* Pro Plan - Highlighted */}
                    <PricingCard 
                        title="Pro" 
                        price="$29" 
                        period="/month"
                        features={["Unlimited Mock Interviews", "Custom Resumes & Context", "Strict & Adaptive Personas", "Hyper-detailed Voice Analysis", "Priority Support"]}
                        buttonLabel="Upgrade to Pro"
                        highlighted={true}
                    />

                    {/* Enterprise Plan */}
                    <PricingCard 
                        title="Enterprise" 
                        price="$99" 
                        period="/month"
                        features={["Team Licenses (Up to 10)", "Custom Company Personas", "Admin Dashboard", "API Access", "Dedicated Success Manager"]}
                        buttonLabel="Contact Sales"
                        outline={true}
                    />
                </div>
            </div>
        </div>
    );
};

const PricingCard = ({ title, price, period, features, buttonLabel, highlighted, outline }) => (
    <div className={`glass-card ${highlighted ? 'highlight-glow' : ''}`} style={{
        padding: '40px 30px',
        borderRadius: 'var(--rounded-xl)',
        background: highlighted ? 'rgba(224, 142, 254, 0.05)' : 'var(--surface-container-low)',
        border: highlighted ? '2px solid var(--primary)' : '1px solid var(--surface-container-high)',
        transform: highlighted ? 'scale(1.05)' : 'scale(1)',
        position: 'relative'
    }}>
        {highlighted && (
            <div style={{ 
                position: 'absolute', 
                top: '-15px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                color: 'white',
                padding: '4px 16px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                letterSpacing: '1px'
            }}>
                MOST POPULAR
            </div>
        )}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '30px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{price}</span>
            <span style={{ color: 'var(--on-surface-variant)' }}>{period}</span>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {features.map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> {feature}
                </li>
            ))}
        </ul>

        <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button className={highlighted ? "btn-primary" : "btn-outline"} style={{ width: '100%', padding: '15px' }}>
                {buttonLabel}
            </button>
        </Link>
    </div>
);

export default Pricing;
