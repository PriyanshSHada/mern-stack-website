import {
  FiUser, FiUsers, FiClipboard, FiBell, FiBarChart2,
  FiZap, FiCheck, FiShield, FiLock, FiSettings, FiFileText
} from 'react-icons/fi';

const solidColors = {
  blue: '#3b82f6',
  purple: '#8b5cf6',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
  orange: '#f97316',
};

const outlinedColors = {
  blue: { border: '#3b82f6', iconBg: '#eff6ff', icon: '#3b82f6' },
  purple: { border: '#8b5cf6', iconBg: '#faf5ff', icon: '#8b5cf6' },
  green: { border: '#22c55e', iconBg: '#f0fdf4', icon: '#22c55e' },
  red: { border: '#ef4444', iconBg: '#fef2f2', icon: '#ef4444' },
  yellow: { border: '#eab308', iconBg: '#fefce8', icon: '#eab308' },
  orange: { border: '#f97316', iconBg: '#fff7ed', icon: '#f97316' },
};

const iconMap = {
  user: FiUser,
  users: FiUsers,
  tasks: FiClipboard,
  activity: FiBell,
  bell: FiBell,
  projects: FiBarChart2,
  chart: FiBarChart2,
  zap: FiZap,
  bolt: FiZap,
  check: FiCheck,
  shield: FiShield,
  lock: FiLock,
  settings: FiSettings,
  logs: FiFileText,
};

const StatisticsCard = ({ title, value, icon, color = 'blue', variant = 'solid' }) => {
  const IconComponent = iconMap[icon] || FiUser;

  if (variant === 'outlined') {
    const theme = outlinedColors[color] || outlinedColors.blue;
    return (
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px', textTransform: 'capitalize' }}>{title}</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{value}</p>
        </div>
        <div style={{
          background: theme.iconBg,
          padding: '10px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <IconComponent size={22} color={theme.icon} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: solidColors[color],
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', opacity: 0.9 }}>{title}</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{value}</p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '10px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <IconComponent size={24} color="white" />
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
