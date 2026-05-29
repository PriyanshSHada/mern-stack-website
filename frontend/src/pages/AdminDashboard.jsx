import { useNavigate } from 'react-router-dom';
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

  const containerStyle = { minHeight: '100vh', background: '#f5f6fa', paddingTop: '60px' };
  const contentStyle = { maxWidth: '1200px', margin: '0 auto', padding: '24px' };
  const grid2Col = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' };
  const grid4Col = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' };
  const dot = (color) => ({ width: '6px', height: '6px', background: color, borderRadius: '50%', marginTop: '6px', flexShrink: 0 });
  const btnBase = { padding: '12px 24px', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%' };

  const actions = [
    { bg: '#eff6ff', iconBg: '#dbeafe', icon: '👥', title: 'Manage Users', desc: 'Add, edit, or remove users', color: '#2563eb' },
    { bg: '#faf5ff', iconBg: '#f3e8ff', icon: '⚙️', title: 'System Settings', desc: 'Configure system preferences', color: '#7c3aed' },
    { bg: '#f0fdf4', iconBg: '#dcfce7', icon: '📄', title: 'View Logs', desc: 'Access system audit logs', color: '#16a34a' },
    { bg: '#fef2f2', iconBg: '#fee2e2', icon: '🔒', title: 'Security Settings', desc: 'Manage security configurations', color: '#dc2626' },
  ];

  const activities = [
    { color: '#22c55e', text: 'User account created', time: '1 hour ago' },
    { color: '#3b82f6', text: 'System backup completed', time: '3 hours ago' },
    { color: '#8b5cf6', text: 'Security patch applied', time: '5 hours ago' },
    { color: '#eab308', text: 'Database optimized', time: '1 day ago' },
  ];

  return (
    <div style={containerStyle}>
      <Navbar user={user} logout={handleLogout} />
      
      <div style={contentStyle}>
        <Card gradient gradientKey="red-pink" style={{ marginBottom: '24px', color: 'white' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Admin Dashboard</h1>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Welcome back, {user?.username}! You have full system control.</p>
        </Card>

        <div style={grid4Col}>
          <StatisticsCard title="Total Users" value="100" icon="users" color="blue" />
          <StatisticsCard title="Total Managers" value="15" icon="users" color="purple" />
          <StatisticsCard title="Total Admins" value="3" icon="users" color="red" />
          <StatisticsCard title="System Health" value="Good" icon="lock" color="green" />
        </div>

        <div style={grid2Col}>
          <Card>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Admin Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {actions.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: a.bg, borderRadius: '8px' }}>
                  <div style={{ width: '36px', height: '36px', background: a.iconBg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    {a.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>{a.title}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Recent Admin Activities</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activities.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={dot(item.color)}></div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#1f2937' }}>{item.text}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Admin Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
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
              <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '9999px', textTransform: 'capitalize' }}>
                {user?.role}
              </span>
            </div>
          </div>
        </Card>

        <div style={{ marginBottom: '24px' }}>
          <Alert type="error">
            <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Permissions</p>
            <p style={{ fontSize: '14px' }}>Admin can manage users, configure system, access logs, and change settings.</p>
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
