const alertStyles = {
  info: { background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' },
  warning: { background: '#fefce8', borderColor: '#fde68a', color: '#92400e' },
  error: { background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' },
  success: { background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' },
};

const Alert = ({ type = 'info', children }) => {
  const style = alertStyles[type];
  
  return (
    <div style={{
      background: style.background,
      border: `1px solid ${style.borderColor}`,
      color: style.color,
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <span style={{ marginTop: '2px', fontSize: '20px' }}>
        {type === 'info' && 'ℹ️'}
        {type === 'warning' && '⚠️'}
        {type === 'error' && '🚨'}
        {type === 'success' && '✅'}
      </span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

export default Alert;
