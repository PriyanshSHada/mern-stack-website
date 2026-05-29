const Navbar = ({ user, logout }) => {
  return (
    <nav style={{
      background: '#2563eb',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
    }}>
      <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>JWT Auth</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'white', fontSize: '14px' }}>
          Welcome, <span style={{ fontWeight: 600 }}>{user?.username}</span>
        </span>
        <span style={{
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: '12px',
          padding: '4px 12px',
          borderRadius: '9999px',
          textTransform: 'capitalize',
          fontWeight: 500
        }}>
          {user?.role}
        </span>
        <button
          onClick={logout}
          style={{
            background: '#ef4444',
            color: 'white',
            fontSize: '14px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
