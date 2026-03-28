const Card = ({ children, title, action, className, style }) => {
    return (
        <div className={`glass-card ${className || ''}`} style={style}>
            {(title || action) && (
                <div className="flex-between" style={{ marginBottom: 'var(--spacing-8)' }}>
                    {title && <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
