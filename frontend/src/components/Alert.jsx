import { FiAlertTriangle, FiInfo, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const alertStyles = {
  info: { background: '#eff6ff', borderColor: '#3b82f6', color: '#1e40af', icon: FiInfo },
  warning: { background: '#fefce8', borderColor: '#eab308', color: '#92400e', icon: FiAlertTriangle },
  error: { background: '#fef2f2', borderColor: '#ef4444', color: '#991b1b', icon: FiXCircle },
  success: { background: '#f0fdf4', borderColor: '#22c55e', color: '#166534', icon: FiCheckCircle },
};

const Alert = ({ type = 'info', children }) => {
  const style = alertStyles[type];
  const Icon = style.icon;

  return (
    <div style={{
      background: style.background,
      border: `1px solid ${style.borderColor}`,
      borderLeft: `4px solid ${style.borderColor}`,
      color: style.color,
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <span style={{ marginTop: '2px', flexShrink: 0 }}>
        <Icon size={20} />
      </span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

export default Alert;
