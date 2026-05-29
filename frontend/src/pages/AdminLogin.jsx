import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const API_BASE = 'http://localhost:4000/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }

      // Kiểm tra role có phải admin không
      if (data.data.user.role !== 'admin') {
        setError('❌ Bạn không có quyền truy cập trang quản trị!');
        setLoading(false);
        return;
      }

      // Lưu token và user info
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect tới AdminDashboard
      navigate('/maychu/admin/dashboard');
      setLoading(false);
    } catch (err) {
      setError('❌ Lỗi kết nối server: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>🛡️ Quản Trị Viên</h1>
          <p>Đăng Nhập Hệ Thống Quản Lý</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Tên Đăng Nhập</label>
            <input
              id="username"
              type="text"
              placeholder="Nhập username hoặc email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật Khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? '⏳ Đang đăng nhập...' : '🔐 Đăng Nhập'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>© 2024 Hệ Thống Quản Trị - Truy cập chỉ dành cho admin</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
