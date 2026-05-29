const bgColors = {
  blue: '#3b82f6',
  purple: '#8b5cf6',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
};

const icons = {
  users: '👥',
  projects: '📁',
  tasks: '✅',
  activity: '🔔',
  settings: '⚙️',
  security: '🔒',
  logs: '📄',
  lock: '🔐',
};

const StatisticsCard = ({ title, value, icon, color = 'blue' }) => {
  return (
    <div style={{
      background: bgColors[color],
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', opacity: 0.85 }}>{title}</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{value}</p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '10px',
          borderRadius: '10px',
          fontSize: '24px'
        }}>
          {icons[icon] || '📊'}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
