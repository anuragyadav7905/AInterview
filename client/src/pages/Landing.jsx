import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#0D0F16', // Dark background matching the image
            color: 'var(--on-surface)',
            fontFamily: "'Inter', sans-serif",
            overflowX: 'hidden'
        }}>
            {/* Top Navigation Bar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 40px',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                zIndex: 10,
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#E08EFE' }}>AInterview</span>
                </div>

                <div style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: '0.9rem', color: '#A0AAB2' }}>
                    <span style={{ color: '#FFF', borderBottom: '2px solid #E08EFE', paddingBottom: '5px', cursor: 'pointer' }}>Product</span>
                    <Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none', transition: '0.2s' }} className="nav-hover">Pricing</Link>
                </div>


            </nav>

            {/* Glowing Orbs for ambiance */}
            <div style={{
                position: 'absolute',
                top: '-100px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '800px',
                height: '400px',
                background: 'radial-gradient(ellipse, rgba(160, 50, 250, 0.15) 0%, rgba(13, 15, 22, 0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Hero Section */}
            <section style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '80px 20px 40px 20px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '30px',
                    padding: '8px 16px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    color: '#D9B8FF',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textTransform: 'uppercase'
                }}>
                    FUTURE OF PREPARATION IS HERE
                </div>

                <h1 style={{
                    fontSize: '4.5rem',
                    fontWeight: '800',
                    lineHeight: '1.1',
                    marginBottom: '20px',
                    maxWidth: '800px',
                    color: '#fff'
                }}>
                    <span style={{
                        background: 'linear-gradient(50deg, #FF9A9E 0%, #FECFEF 40%, #D4A5FF 80%, #90F7EC 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Ace Your Interviews
                        <br />with AI 🚀
                    </span>
                </h1>

                <p style={{
                    color: '#A0AAB2',
                    fontSize: '1.2rem',
                    lineHeight: '1.6',
                    maxWidth: '650px',
                    marginBottom: '40px'
                }}>
                    The next generation of AI-powered mock interviews to land your dream job. Practice with real-time feedback and technical simulations.
                </p>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/signup">
                        <button style={{
                            padding: '16px 32px',
                            fontSize: '1.1rem',
                            borderRadius: '30px',
                            background: 'linear-gradient(90deg, #E08EFE 0%, #A37BFF 100%)',
                            color: '#FFF',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0 4px 15px rgba(224, 142, 254, 0.3)'
                        }}>
                            Get Started
                        </button>
                    </Link>
                    <button style={{
                        padding: '16px 32px',
                        fontSize: '1.1rem',
                        borderRadius: '30px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#FFF',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        ▶ Watch Demo
                    </button>
                </div>
            </section>

            {/* Media/Mockup Section */}
            <section style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                padding: '40px 20px 80px 20px',
                maxWidth: '1000px',
                width: '100%',
                margin: '0 auto',
                zIndex: 1
            }}>
                <div style={{
                    flex: 2,
                    background: 'url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '350px',
                    borderRadius: '20px',
                    position: 'relative',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                }}>
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(10px)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.8rem',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ width: '8px', height: '8px', background: '#FF4757', borderRadius: '50%' }} />
                        Live AI Feedback Engine
                    </div>
                </div>

                <div style={{
                    flex: 1,
                    background: '#1A1D27',
                    borderRadius: '20px',
                    padding: '30px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Skill Matrix</h3>
                        <div style={{ height: '6px', width: '100%', background: '#2D3243', borderRadius: '3px', marginBottom: '15px' }}>
                            <div style={{ height: '100%', width: '85%', background: '#E08EFE', borderRadius: '3px' }} />
                        </div>
                        <div style={{ height: '6px', width: '100%', background: '#2D3243', borderRadius: '3px', marginBottom: '15px' }}>
                            <div style={{ height: '100%', width: '60%', background: '#7C4DFF', borderRadius: '3px' }} />
                        </div>
                        <div style={{ height: '6px', width: '100%', background: '#2D3243', borderRadius: '3px', marginBottom: '15px' }}>
                            <div style={{ height: '100%', width: '90%', background: '#FF758F', borderRadius: '3px' }} />
                        </div>
                    </div>

                    <p style={{
                        color: '#A0AAB2',
                        fontSize: '0.85rem',
                        fontStyle: 'italic',
                        lineHeight: '1.5'
                    }}>
                        "Our users report a 40% higher success rate in technical rounds after practicing with our behavioral AI."
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section style={{
                background: '#11131A',
                padding: '100px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Everything You Need To Win</h2>
                <p style={{ color: '#A0AAB2', maxWidth: '600px', marginBottom: '60px', lineHeight: '1.6' }}>
                    Powerful tools designed to simulate real-world pressure and provide actionable intelligence.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px',
                    maxWidth: '1100px',
                    width: '100%'
                }}>
                    <div className="feature-card" style={{
                        background: '#181B24',
                        padding: '40px 30px',
                        borderRadius: '24px',
                        textAlign: 'left',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.02)'
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            background: 'rgba(168, 85, 247, 0.15)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            marginBottom: '20px',
                            color: '#E08EFE'
                        }}>🤖</div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Smart AI Interviews</h3>
                        <p style={{ color: '#A0AAB2', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Experience adaptive questioning that evolves based on your answers, pushing your technical and soft skills to the limit.
                        </p>
                        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '8rem', opacity: '0.03' }}>🤖</div>
                    </div>

                    <div className="feature-card" style={{
                        background: '#181B24',
                        padding: '40px 30px',
                        borderRadius: '24px',
                        textAlign: 'left',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.02)'
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            background: 'rgba(59, 130, 246, 0.15)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            marginBottom: '20px',
                            color: '#60A5FA'
                        }}>📈</div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Track Progress</h3>
                        <p style={{ color: '#A0AAB2', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Visual analytics and sentiment scoring track your improvement over time, identifying exactly where you need more practice.
                        </p>
                        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '8rem', opacity: '0.03' }}>📈</div>
                    </div>

                    <div className="feature-card" style={{
                        background: '#181B24',
                        padding: '40px 30px',
                        borderRadius: '24px',
                        textAlign: 'left',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.02)'
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            background: 'rgba(236, 72, 153, 0.15)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            marginBottom: '20px',
                            color: '#F472B6'
                        }}>🎯</div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Target Roles</h3>
                        <p style={{ color: '#A0AAB2', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Select specific roles from Big Tech to Boutique Agencies. AI tailors questions to the exact standards of your dream company.
                        </p>
                        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '8rem', opacity: '0.03' }}>🎯</div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA Section */}
            <section style={{ padding: '80px 20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    background: 'linear-gradient(180deg, #1C1E2B 0%, #151722 100%)',
                    borderRadius: '40px',
                    padding: '80px 40px',
                    maxWidth: '1000px',
                    width: '100%',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '30px', lineHeight: '1.1' }}>
                        Your Dream Job Is One<br />
                        <span style={{
                            background: 'linear-gradient(90deg, #E08EFE 0%, #A37BFF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Practice Session</span> Away.
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '60px' }}>
                        <Link to="/signup">
                            <button style={{
                                padding: '18px 40px',
                                fontSize: '1.2rem',
                                borderRadius: '30px',
                                background: 'linear-gradient(90deg, #E08EFE 0%, #A37BFF 100%)',
                                color: '#FFF',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(224, 142, 254, 0.2)'
                            }}>
                                Start Free Session
                            </button>
                        </Link>
                        <span style={{ color: '#A0AAB2', fontSize: '0.9rem' }}>No credit card required.</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '40px',
                        opacity: '0.4',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                        color: '#FFF',
                        flexWrap: 'wrap'
                    }}>
                        <span>FAANG</span>
                        <span>STRIPE</span>
                        <span>OPENAI</span>
                        <span>TESLA</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                background: '#0A0C11',
                padding: '40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                color: '#A0AAB2',
                fontSize: '0.8rem'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ fontWeight: 'bold', color: '#FFF', fontSize: '1rem' }}>AInterview AI</div>
                </div>

                <div style={{ display: 'flex', gap: '30px', letterSpacing: '1px' }}>
                    <span style={{ cursor: 'pointer' }}>PRIVACY</span>
                    <span style={{ cursor: 'pointer' }}>TERMS</span>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
