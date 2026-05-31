import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = ({ register }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await register(formData.username, formData.email, formData.password, formData.role);
      // Registration successful - redirect to login (separate login required)
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      console.error('Register error:', err);
      setError(msg);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #22c55e 0%, #2563eb 100%)',
        padding: '16px'
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '4px',
          padding: '32px',
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}
      >
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', textAlign: 'center', color: '#1f2937', marginBottom: '24px' }}>
          Register
        </h2>
        
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '10px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              placeholder="Enter your password"
              required
              minLength="6"
            />
          </div>
          
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              placeholder="Confirm your password"
              required
              minLength="6"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.background = '#15803d'}
            onMouseLeave={(e) => e.target.style.background = '#16a34a'}
          >
            Register
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#16a34a', fontWeight: '500', textDecoration: 'none' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
