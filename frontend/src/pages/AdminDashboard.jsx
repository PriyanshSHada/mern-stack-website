import { useNavigate } from 'react-router-dom';
import { FiUsers, FiSettings, FiFileText, FiShield } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import StatisticsCard from '../components/StatisticsCard';

const AdminDashboard = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const containerStyle = { minHeight: '100vh', background: '#f5f6fa', paddingTop: '56px' };
  const contentStyle = { maxWidth: '1200px', margin: '0 auto', padding: '24px' };
  const grid2Col = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' };
  const grid4Col = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' };
  const dot = (color) => ({ width: '6px', height: '6px', background: color, borderRadius: '50%', marginTop: '6px', flexShrink: 0 });
  const btnBase = { padding: '10px 20px', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%' };

  const actions = [
    { icon: FiUsers, title: 'Manage Users', desc: 'Add, edit, or remove users', color: '#2563eb' },
    { icon: FiSettings, title: 'System Settings', desc: 'Configure system preferences', color: '#7c3aed' },
    { icon: FiFileText, title: 'View Logs', desc: 'Access system audit logs', color: '#16a34a' },
    { icon: FiShield, title: 'Security Settings', desc: 'Manage security configurations', color: '#dc2626' },
  ];

  const activities = [
    { color: '#22c55e', text: 'User account created', time: '1 hour ago' },
    { color: '#3b82f6', text: 'System backup completed', time: '3 hours ago' },
    { color: '#8b5cf6', text: 'Security patch applied', time: '1 day ago' },
    { color: '#eab308', text: 'Database optimized', time: '1 day ago' },
  ];

  return (
    <div style={containerStyle}>
      <Navbar user={user} logout={handleLogout} />

      <div style={contentStyle}>
        <Card gradient gradientKey="red-pink" style={{ marginBottom: '24px', color: 'white', borderRadius: '8px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px' }}>Admin Dashboard</h1>
          <p style={{ fontSize: '13px', opacity: 0.9 }}>Welcome, {user?.username}! You have full system control.</p>
        </Card>

        <div style={grid4Col}>
          <StatisticsCard title="Total Users" value="100" icon="user" color="purple" variant="outlined" />
          <StatisticsCard title="Total Managers" value="15" icon="users" color="purple" variant="outlined" />
          <StatisticsCard title="Total Admins" value="3" icon="zap" color="yellow" variant="outlined" />
          <StatisticsCard title="System Health" value="Good" icon="check" color="green" variant="outlined" />
        </div>

        <div style={grid2Col}>
          <Card>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Admin Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {actions.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ width: '36px', height: '36px', background: a.color + '15', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color }}>
                    <a.icon size={18} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: a.color }}>{a.title}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Recent Admin Activities</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activities.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={dot(item.color)}></div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#1f2937' }}>{item.text}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Admin Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Name</p>
              <p style={{ fontWeight: 500, color: '#1f2937', fontSize: '14px' }}>{user?.username}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Email</p>
              <p style={{ fontWeight: 500, color: '#1f2937', fontSize: '14px' }}>{user?.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Role</p>
              <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '9999px', textTransform: 'capitalize' }}>
                {user?.role}
              </span>
            </div>
          </div>
        </Card>

        <div style={{ marginBottom: '24px' }}>
          <Alert type="warning">
            <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Admin Access Level!</p>
            <p style={{ fontSize: '14px' }}>You have complete access to all system features, user management, and configurations. Use this power responsibly.</p>
          </Alert>
        </div>

        <div style={grid2Col}>
          <button onClick={() => navigate('/user/dashboard')} style={{ ...btnBase, background: '#2563eb' }}>
            View User Dashboard
          </button>
          <button onClick={() => navigate('/manager/dashboard')} style={{ ...btnBase, background: '#7c3aed' }}>
            View Manager Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
