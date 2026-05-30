import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import StatisticsCard from '../components/StatisticsCard';

const UserDashboard = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const containerStyle = {
    minHeight: '100vh',
    background: '#f5f6fa',
    paddingTop: '56px'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px'
  };

  const grid2Col = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  };

  const infoRow = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f3f4f6'
  };

  const roleBadge = {
    background: '#dbeafe',
    color: '#1e40af',
    fontSize: '11px',
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: '9999px',
    textTransform: 'capitalize'
  };

  const btnBase = {
    padding: '10px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%'
  };

  return (
    <div style={containerStyle}>
      <Navbar user={user} logout={handleLogout} />

      <div style={contentStyle}>
        <Card style={{ marginBottom: '24px', borderRadius: '8px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '6px' }}>User Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '13px' }}>Welcome, {user?.username}!</p>
        </Card>

        <div style={grid2Col}>
          <StatisticsCard title="My Tasks" value="5" icon="tasks" color="blue" />
          <StatisticsCard title="Notifications" value="3" icon="bell" color="green" />
        </div>

        <Card style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Your Information</h2>
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

        <div style={{ marginBottom: '24px' }}>
          <Alert type="warning">
            <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>User Access Level</p>
            <p style={{ fontSize: '14px' }}>You have basic access to view your profile and tasks.</p>
          </Alert>
        </div>

        <div style={grid2Col}>
          <button onClick={() => navigate('/manager/dashboard')} style={{ ...btnBase, background: '#7c3aed' }}>
            Go to Manager Dashboard
          </button>
          <button onClick={() => navigate('/admin/dashboard')} style={{ ...btnBase, background: '#dc2626' }}>
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
