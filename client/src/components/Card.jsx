const Card = ({ children, title, action, className, style }) => {
    return (
        <div className={`glass-card ${className || ''}`} style={{ padding: '24px', ...style }}>
            {(title || action) && (
                <div className="flex-between" style={{ marginBottom: '20px' }}>
                    {title && <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
