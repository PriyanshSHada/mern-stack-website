import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    }, []);

    const login = async (email, password) => {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const userData = response.data.user;
      const token = response.data.token;
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return response.data;
    };

    const register = async (username, email, password, role) => {
      const response = await axiosInstance.post('/auth/register', { username, email, password, role });
      const userData = response.data.user;
      const token = response.data.token;
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return response.data;
    };

    const logout = async () => {
      try { await axiosInstance.post('/auth/logout'); } catch (e) {}
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>Loading...</div>;

    return <WrappedComponent {...props} user={user} login={login} register={register} logout={logout} isAuthenticated={!!user} />;
  };
};

const withRoleProtection = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { user, isAuthenticated } = props;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/user/dashboard" replace />;
    return <WrappedComponent {...props} />;
  };
};

const UserDashboardWithAuth = withAuth(UserDashboard);
const ManagerDashboardWithAuth = withAuth(withRoleProtection(ManagerDashboard, ['manager', 'admin']));
const AdminDashboardWithAuth = withAuth(withRoleProtection(AdminDashboard, ['admin']));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginWithAuth />} />
        <Route path="/register" element={<RegisterWithAuth />} />
        <Route path="/user/dashboard" element={<UserDashboardWithAuth />} />
        <Route path="/manager/dashboard" element={<ManagerDashboardWithAuth />} />
        <Route path="/admin/dashboard" element={<AdminDashboardWithAuth />} />
      </Routes>
    </Router>
  );
}

const LoginWithAuth = withAuth(Login);
const RegisterWithAuth = withAuth(Register);

export default App;
