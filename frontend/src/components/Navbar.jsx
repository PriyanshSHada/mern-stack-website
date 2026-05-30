const Navbar = ({ user, logout }) => {
  return (
    <nav style={{
      background: '#2563eb',
      height: '56px',
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
      <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>JWT Auth</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'white', fontSize: '13px' }}>
          Welcome, <span style={{ fontWeight: 600 }}>{user?.username}</span> <span style={{ textTransform: 'capitalize' }}>({user?.role})</span>
        </span>
        <button
          onClick={logout}
          style={{
            background: '#ef4444',
            color: 'white',
            fontSize: '13px',
            padding: '6px 14px',
            borderRadius: '6px',
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
