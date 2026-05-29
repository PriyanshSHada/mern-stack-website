import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import StatisticsCard from '../components/StatisticsCard';

const ManagerDashboard = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const containerStyle = { minHeight: '100vh', background: '#f5f6fa', paddingTop: '60px' };
  const contentStyle = { maxWidth: '1200px', margin: '0 auto', padding: '24px' };
  const grid2Col = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' };
  const grid3Col = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' };
  const infoRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' };
  const dot = (color) => ({ width: '6px', height: '6px', background: color, borderRadius: '50%', marginTop: '6px', flexShrink: 0 });
  const roleBadge = { background: '#f3e8ff', color: '#7c3aed', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '9999px', textTransform: 'capitalize' };
  const btnBase = { padding: '12px 24px', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%' };

  return (
    <div style={containerStyle}>
      <Navbar user={user} logout={handleLogout} />
      
      <div style={contentStyle}>
        <Card gradient gradientKey="purple-blue" style={{ marginBottom: '24px', color: 'white' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Manager Dashboard</h1>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Welcome back, {user?.username}! Manage your team efficiently.</p>
        </Card>

        <div style={grid3Col}>
          <StatisticsCard title="Team Members" value="10" icon="users" color="purple" />
          <StatisticsCard title="Active Projects" value="8" icon="projects" color="blue" />
          <StatisticsCard title="Pending Approvals" value="4" icon="tasks" color="yellow" />
        </div>

        <div style={grid2Col}>
          <Card>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Recent Activities</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { color: '#22c55e', text: 'Approved project proposal from Team A' },
                { color: '#3b82f6', text: 'Reviewed performance reports' },
                { color: '#8b5cf6', text: 'Scheduled team meeting for next week' },
                { color: '#eab308', text: 'Assigned new tasks to team members' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={dot(item.color)}></div>
                  <p style={{ fontSize: '14px', color: '#1f2937' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Manager Information</h2>
            <div>
              <div style={infoRow}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Name</span>
                <span style={{ fontWeight: 500, color: '#1f2937', fontSize: '14px' }}>{user?.username}</span>
              </div>
              <div style={infoRow}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Email</span>
                <span style={{ fontWeight: 500, color: '#1f2937', fontSize: '14px' }}>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Role</span>
                <span style={roleBadge}>{user?.role}</span>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Alert type="info">
            <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Manager Access Level</p>
            <p style={{ fontSize: '14px' }}>You can manage team members, approve requests, and oversee projects.</p>
          </Alert>
        </div>

        <div style={grid2Col}>
          <button onClick={() => navigate('/user/dashboard')} style={{ ...btnBase, background: '#2563eb' }}>
            View User Dashboard
          </button>
          <button onClick={() => navigate('/admin/dashboard')} style={{ ...btnBase, background: '#dc2626' }}>
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
