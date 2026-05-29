import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const API_BASE = 'http://localhost:4000/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ novels: 0, users: 0, comments: 0, pendingReports: 0 });
    const [novels, setNovels] = useState([]);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [genres, setGenres] = useState([]);
    const [reports, setReports] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [bannedWords, setBannedWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newGenre, setNewGenre] = useState({ ten_tl: '', slug: '' });
    const [editingGenre, setEditingGenre] = useState(null);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
    
    // Chi tiết truyện để duyệt
    const [showNovelDetail, setShowNovelDetail] = useState(false);
    const [selectedNovel, setSelectedNovel] = useState(null);
    const [selectedNovelChapters, setSelectedNovelChapters] = useState([]);
    const [loadingChapters, setLoadingChapters] = useState(false);

    // Role mapping: Vietnamese DB roles ↔ English UI roles
    const roleMapping = {
      'docgia': 'user',
      'tacgia': 'author',
      'nhanvien': 'moderator',
      'admin': 'admin'
    };

    // Convert database role to display role
    const getDisplayRole = (dbRole) => {
      return roleMapping[dbRole] || dbRole;
    };

    // Convert display role to database role
    const getDbRole = (displayRole) => {
      const reverse = Object.fromEntries(Object.entries(roleMapping).map(([k, v]) => [v, k]));
      return reverse[displayRole] || displayRole;
    };

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        if (!token || !userData) {
            navigate('/maychu/admin');
            return;
        }

        try {
            const user = JSON.parse(userData);
            
            // Kiểm tra role có phải admin không
            if (user.role !== 'admin') {
                alert('❌ Bạn không có quyền truy cập!');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/maychu/admin');
                return;
            }
            
            setUser(user);
            loadDashboardData(token);
        } catch (err) {
            navigate('/maychu/admin');
        }
    }, [navigate]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const loadDashboardData = async (token) => {
        try {
            // Load stats
            const statsRes = await fetch(`${API_BASE}/admin/dashboard/stats`, {
                headers: getAuthHeaders()
            });
            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data.data || {});
            }
            setLoading(false);
        } catch (err) {
            console.error('Error loading dashboard:', err);
            setLoading(false);
        }
    };

    const loadPendingNovels = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/novels/pending`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setNovels(data.data || []);
            }
        } catch (err) {
            console.error('Error loading novels:', err);
        }
    };

    const loadUsers = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/users`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.data?.users || []);
            }
        } catch (err) {
            console.error('Error loading users:', err);
        }
    };

    const loadComments = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/comments/pending`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setComments(data.data || []);
            }
        } catch (err) {
            console.error('Error loading comments:', err);
        }
    };

    const loadGenres = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/genres`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setGenres(data.data || []);
            }
        } catch (err) {
            console.error('Error loading genres:', err);
        }
    };

    const loadReports = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/reports`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setReports(data.data || []);
            }
        } catch (err) {
            console.error('Error loading reports:', err);
        }
    };

    const loadAnnouncements = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/announcements`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setAnnouncements(data.data || []);
            }
        } catch (err) {
            console.error('Error loading announcements:', err);
        }
    };

    const loadBannedWords = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/banned-words`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setBannedWords(data.data || []);
            }
        } catch (err) {
            console.error('Error loading banned words:', err);
        }
    };

    const handleApproveNovel = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/admin/novels/${id}/approve`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Truyện đã được duyệt!');
                loadPendingNovels();
            }
        } catch (err) {
            alert('❌ Lỗi duyệt truyện');
        }
    };

    const handleRejectNovel = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/admin/novels/${id}/reject`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Truyện đã bị từ chối!');
                loadPendingNovels();
            }
        } catch (err) {
            alert('❌ Lỗi từ chối truyện');
        }
    };

    const handleDeleteNovel = async (id) => {
        if (!window.confirm('Xác nhận xóa truyện này?')) return;
        try {
            const res = await fetch(`${API_BASE}/admin/novels/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Truyện đã bị xóa!');
                loadPendingNovels();
            }
        } catch (err) {
            alert('❌ Lỗi xóa truyện');
        }
    };

    // Xem chi tiết truyện + chapters
    const handleViewNovelDetail = async (novel) => {
        setSelectedNovel(novel);
        setShowNovelDetail(true);
        setLoadingChapters(true);
        try {
            const res = await fetch(`${API_BASE}/chapters/novel/${novel.idln}`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedNovelChapters(data.data || []);
            } else {
                setSelectedNovelChapters([]);
            }
        } catch (err) {
            console.error('Lỗi tải chapters:', err);
            setSelectedNovelChapters([]);
        } finally {
            setLoadingChapters(false);
        }
    };

    // Đóng modal chi tiết
    const handleCloseNovelDetail = () => {
        setShowNovelDetail(false);
        setSelectedNovel(null);
        setSelectedNovelChapters([]);
    };

    // Duyệt truyện từ modal
    const handleApproveNovelFromModal = async () => {
        if (!selectedNovel) return;
        try {
            const res = await fetch(`${API_BASE}/admin/novels/${selectedNovel.idln}/approve`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Truyện được duyệt thành công!');
                handleCloseNovelDetail();
                loadPendingNovels();
            }
        } catch (err) {
            alert('❌ Lỗi duyệt truyện');
        }
    };

    const handleToggleUser = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/admin/users/${id}/toggle-active`, {
                method: 'PATCH',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Đã cập nhật tài khoản!');
                loadUsers();
            }
        } catch (err) {
            alert('❌ Lỗi cập nhật');
        }
    };

    const handleDeleteUser = async (id, username) => {
        if (!window.confirm(`⚠️ Xác nhận xóa tài khoản ${username}?\nHành động này không thể hoàn tác!`)) return;
        try {
            const res = await fetch(`${API_BASE}/admin/users/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Tài khoản đã bị xóa!');
                loadUsers();
            } else {
                alert('❌ Lỗi xóa tài khoản');
            }
        } catch (err) {
            alert('❌ Lỗi xóa tài khoản');
        }
    };

    const handleChangeRole = async (id, newRole) => {
        try {
            const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) {
                alert(`✅ Đổi vai trò thành ${newRole}!`);
                loadUsers();
            }
        } catch (err) {
            alert('❌ Lỗi đổi vai trò');
        }
    };

    const handleApproveComment = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/admin/comments/${id}/approve`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Bình luận được duyệt!');
                loadComments();
            }
        } catch (err) {
            alert('❌ Lỗi duyệt bình luận');
        }
    };

    const handleDeleteComment = async (id) => {
        if (!window.confirm('Xác nhận xóa bình luận?')) return;
        try {
            const res = await fetch(`${API_BASE}/admin/comments/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Bình luận đã bị xóa!');
                loadComments();
            }
        } catch (err) {
            alert('❌ Lỗi xóa bình luận');
        }
    };

    const handleAddGenre = async () => {
        if (!newGenre.ten_tl) {
            alert('⚠️ Nhập tên thể loại!');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/admin/genres`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(newGenre)
            });
            if (res.ok) {
                alert('✅ Thể loại đã được thêm!');
                setNewGenre({ ten_tl: '', slug: '' });
                loadGenres();
            }
        } catch (err) {
            alert('❌ Lỗi thêm thể loại');
        }
    };

    const handleEditGenre = (genre) => {
        setEditingGenre({ ...genre });
    };

    const handleUpdateGenre = async () => {
        if (!editingGenre.ten_tl) {
            alert('⚠️ Nhập tên thể loại!');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/admin/genres/${editingGenre.id_tl}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    ten_tl: editingGenre.ten_tl,
                    slug: editingGenre.slug
                })
            });
            if (res.ok) {
                alert('✅ Thể loại đã được cập nhật!');
                setEditingGenre(null);
                loadGenres();
            }
        } catch (err) {
            alert('❌ Lỗi cập nhật thể loại');
        }
    };

    const handleCancelEdit = () => {
        setEditingGenre(null);
    };

    const handleDeleteGenre = async (id) => {
        if (!window.confirm('Xác nhận xóa thể loại?')) return;
        try {
            const res = await fetch(`${API_BASE}/admin/genres/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Thể loại đã bị xóa!');
                loadGenres();
            }
        } catch (err) {
            alert('❌ Lỗi xóa thể loại');
        }
    };

    const handleResolveReport = async (id, status) => {
        try {
            const res = await fetch(`${API_BASE}/admin/reports/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status, notes: `Xử lý bởi admin` })
            });
            if (res.ok) {
                alert(`✅ Báo cáo đã được ${status}!`);
                loadReports();
            }
        } catch (err) {
            alert('❌ Lỗi xử lý báo cáo');
        }
    };

    const handleCreateAnnouncement = async () => {
        if (!newAnnouncement.title || !newAnnouncement.content) {
            alert('⚠️ Nhập tiêu đề và nội dung!');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/admin/announcements`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(newAnnouncement)
            });
            if (res.ok) {
                alert('✅ Thông báo đã được đăng!');
                setNewAnnouncement({ title: '', content: '' });
                loadAnnouncements();
            }
        } catch (err) {
            alert('❌ Lỗi đăng thông báo');
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Xác nhận xóa thông báo?')) return;
        try {
            const res = await fetch(`${API_BASE}/admin/announcements/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Thông báo đã bị xóa!');
                loadAnnouncements();
            }
        } catch (err) {
            alert('❌ Lỗi xóa thông báo');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/maychu/admin');
    };

    if (loading) {
        return <div className="admin-loading">Đang tải...</div>;
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        switch(tab) {
            case 'novels':
                loadPendingNovels();
                break;
            case 'users':
                loadUsers();
                break;
            case 'comments':
                loadComments();
                break;
            case 'genres':
                loadGenres();
                break;
            case 'reports':
                loadReports();
                break;
            case 'announcements':
                loadAnnouncements();
                break;
            case 'banned-words':
                loadBannedWords();
                break;
            default:
                break;
        }
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>🛡️ Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <button 
                        className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleTabChange('dashboard')}
                    >
                        📊 Dashboard
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'novels' ? 'active' : ''}`}
                        onClick={() => handleTabChange('novels')}
                    >
                        📚 Duyệt Truyện
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => handleTabChange('users')}
                    >
                        👥 Quản Lý Users
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'comments' ? 'active' : ''}`}
                        onClick={() => handleTabChange('comments')}
                    >
                        💬 Duyệt Comments
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'genres' ? 'active' : ''}`}
                        onClick={() => handleTabChange('genres')}
                    >
                        🏷️ Quản Lý Genres
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => handleTabChange('reports')}
                    >
                        📋 Báo Cáo Vi Phạm
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
                        onClick={() => handleTabChange('announcements')}
                    >
                        📢 Thông Báo
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'banned-words' ? 'active' : ''}`}
                        onClick={() => handleTabChange('banned-words')}
                    >
                        🚫 Từ Cấm
                    </button>
                </nav>
                <div className="admin-user-info">
                    <div className="admin-user-name">👤 {user?.username || 'Admin'}</div>
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        🚪 Đăng Xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Top Bar */}
                <div className="admin-topbar">
                    <h1>Quản Trị Hệ Thống</h1>
                    <div className="admin-topbar-info">
                        <span>Ngày: {new Date().toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="admin-content">
                    {/* DASHBOARD */}
                    {activeTab === 'dashboard' && (
                        <div className="admin-section">
                            <h2>📊 Dashboard</h2>
                            <div className="admin-stats">
                                <div className="stat-card">
                                    <h3>📚 Truyện</h3>
                                    <p className="stat-number">{stats.novels}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>👥 Users</h3>
                                    <p className="stat-number">{stats.users}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>💬 Comments</h3>
                                    <p className="stat-number">{stats.comments}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>⚠️ Reports</h3>
                                    <p className="stat-number">{stats.pendingReports}</p>
                                </div>
                            </div>
                            <div className="admin-welcome">
                                <p>👋 Chào mừng {user?.username || 'Admin'} trở lại!</p>
                                <p>Sử dụng sidebar để quản lý nội dung hệ thống.</p>
                            </div>
                        </div>
                    )}

                    {/* DUYỆT TRUYỆN */}
                    {activeTab === 'novels' && (
                        <div className="admin-section">
                            <h2>📚 Duyệt Truyện</h2>
                            {novels.length === 0 ? (
                                <p>Không có truyện chờ duyệt</p>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Tên Truyện</th>
                                            <th>Tác Giả</th>
                                            <th>Người Tạo</th>
                                            <th>Ngày Tạo</th>
                                            <th>Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {novels.map(novel => (
                                            <tr key={novel.idln}>
                                                <td>{novel.title}</td>
                                                <td>{novel.author}</td>
                                                <td>{novel.creator}</td>
                                                <td>{new Date(novel.created_at).toLocaleDateString('vi-VN')}</td>
                                                <td>
                                                    <button className="btn-approve" onClick={() => handleViewNovelDetail(novel)}>👁️ Xem Chi Tiết</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* QUẢN LÝ USERS */}
                    {activeTab === 'users' && (
                        <div className="admin-section">
                            <h2>👥 Quản Lý Users</h2>
                            {users.length === 0 ? (
                                <p>Không có users</p>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Trạng Thái</th>
                                            <th>Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.user_id}>
                                                <td>{u.username}</td>
                                                <td>{u.email}</td>
                                                <td>{getDisplayRole(u.role)}</td>
                                                <td>{u.active ? '✅ Hoạt động' : '❌ Bị khóa'}</td>
                                                <td>
                                                    <button className="btn-toggle" onClick={() => handleToggleUser(u.user_id)}>
                                                        {u.active ? '🔒 Khóa' : '🔓 Mở'}
                                                    </button>
                                                    <button className="btn-delete" onClick={() => handleDeleteUser(u.user_id, u.username)}>
                                                        🗑️ Xóa
                                                    </button>
                                                    <select 
                                                        value={getDisplayRole(u.role)}
                                                        onChange={(e) => handleChangeRole(u.user_id, e.target.value)}
                                                        className="admin-select"
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="moderator">Moderator</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* DUYỆT COMMENTS */}
                    {activeTab === 'comments' && (
                        <div className="admin-section">
                            <h2>💬 Duyệt Comments</h2>
                            {comments.length === 0 ? (
                                <p>Không có comments chờ duyệt</p>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Người Dùng</th>
                                            <th>Nội Dung</th>
                                            <th>Truyện</th>
                                            <th>Trạng Thái</th>
                                            <th>Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comments.map(comment => (
                                            <tr key={comment.comment_id}>
                                                <td>{comment.username}</td>
                                                <td style={{maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis'}}>{comment.content}</td>
                                                <td>{comment.novel_title}</td>
                                                <td>{comment.status}</td>
                                                <td>
                                                    <button className="btn-approve" onClick={() => handleApproveComment(comment.comment_id)}>✅ Duyệt</button>
                                                    <button className="btn-delete" onClick={() => handleDeleteComment(comment.comment_id)}>🗑️ Xóa</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* QUẢN LÝ GENRES */}
                    {activeTab === 'genres' && (
                        <div className="admin-section">
                            <h2>🏷️ Quản Lý Thể Loại</h2>
                            
                            {/* Form Thêm hoặc Sửa */}
                            <div className="admin-form" style={{marginBottom: '2rem', border: editingGenre ? '2px solid #fbbf24' : 'none', padding: '1rem', borderRadius: '0.5rem'}}>
                                {editingGenre && (
                                    <div style={{marginBottom: '1rem', color: '#fbbf24', fontWeight: 'bold'}}>
                                        ✏️ Đang sửa: {editingGenre.ten_tl}
                                    </div>
                                )}
                                <input 
                                    type="text" 
                                    placeholder="Tên thể loại"
                                    value={editingGenre ? editingGenre.ten_tl : newGenre.ten_tl}
                                    onChange={(e) => editingGenre 
                                        ? setEditingGenre({...editingGenre, ten_tl: e.target.value})
                                        : setNewGenre({...newGenre, ten_tl: e.target.value})
                                    }
                                    className="admin-input"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Slug (tùy chọn)"
                                    value={editingGenre ? editingGenre.slug : newGenre.slug}
                                    onChange={(e) => editingGenre 
                                        ? setEditingGenre({...editingGenre, slug: e.target.value})
                                        : setNewGenre({...newGenre, slug: e.target.value})
                                    }
                                    className="admin-input"
                                />
                                {editingGenre ? (
                                    <>
                                        <button className="btn-approve" onClick={handleUpdateGenre}>💾 Lưu Thay Đổi</button>
                                        <button className="btn-reject" onClick={handleCancelEdit}>❌ Hủy</button>
                                    </>
                                ) : (
                                    <button className="btn-add" onClick={handleAddGenre}>➕ Thêm Thể Loại</button>
                                )}
                            </div>

                            {genres.length === 0 ? (
                                <p>Không có thể loại</p>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Tên</th>
                                            <th>Slug</th>
                                            <th>Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {genres.map(genre => (
                                            <tr key={genre.id_tl}>
                                                <td>{genre.ten_tl}</td>
                                                <td>{genre.slug}</td>
                                                <td>
                                                    <button className="btn-toggle" onClick={() => handleEditGenre(genre)}>✏️ Sửa</button>
                                                    <button className="btn-delete" onClick={() => handleDeleteGenre(genre.id_tl)}>🗑️ Xóa</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* BÁO CÁO VI PHẠM */}
                    {activeTab === 'reports' && (
                        <div className="admin-section">
                            <h2>📋 Báo Cáo Vi Phạm</h2>
                            {reports.length === 0 ? (
                                <p>Không có báo cáo nào</p>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Người Báo Cáo</th>
                                            <th>Loại</th>
                                            <th>Lý Do</th>
                                            <th>Trạng Thái</th>
                                            <th>Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map(report => (
                                            <tr key={report.id}>
                                                <td>{report.username}</td>
                                                <td>{report.report_type}</td>
                                                <td>{report.reason}</td>
                                                <td>{report.status}</td>
                                                <td>
                                                    <button className="btn-approve" onClick={() => handleResolveReport(report.id, 'resolved')}>✅ Xử Lý</button>
                                                    <button className="btn-reject" onClick={() => handleResolveReport(report.id, 'rejected')}>❌ Từ Chối</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* THÔNG BÁO HỆ THỐNG */}
                    {activeTab === 'announcements' && (
                        <div className="admin-section">
                            <h2>📢 Thông Báo Hệ Thống</h2>
                            <div className="admin-form" style={{marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                <input 
                                    type="text" 
                                    placeholder="Tiêu đề thông báo"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                                    className="admin-input"
                                />
                                <textarea 
                                    placeholder="Nội dung thông báo"
                                    value={newAnnouncement.content}
                                    onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                                    className="admin-textarea"
                                    rows="4"
                                />
                                <button className="btn-add" onClick={handleCreateAnnouncement}>📮 Đăng Thông Báo</button>
                            </div>
                            {announcements.length === 0 ? (
                                <p>Chưa có thông báo nào</p>
                            ) : (
                                <div className="admin-announcements">
                                    {announcements.map(ann => (
                                        <div key={ann.post_id} className="announcement-card">
                                            <h4>{ann.title}</h4>
                                            <p>{ann.content}</p>
                                            <small>Bởi: {ann.username} - {new Date(ann.created_at).toLocaleDateString('vi-VN')}</small>
                                            <button className="btn-delete" onClick={() => handleDeleteAnnouncement(ann.post_id)}>🗑️ Xóa</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TỪ CẤM */}
                    {activeTab === 'banned-words' && (
                        <div className="admin-section">
                            <h2>🚫 Danh Sách Từ Cấm</h2>
                            <p style={{color: '#999', marginBottom: '20px'}}>
                                📌 Các từ này sẽ tự động flag comment nếu phát hiện. Tổng cộng: <strong>{bannedWords.length}</strong> từ
                            </p>
                            {bannedWords.length === 0 ? (
                                <p>Không có từ cấm nào</p>
                            ) : (
                                <div className="banned-words-grid">
                                    {bannedWords.map((word, index) => (
                                        <div key={index} className="banned-word-tag">
                                            {word}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL CHI TIẾT TRUYỆN */}
            {showNovelDetail && selectedNovel && (
                <div className="admin-modal-overlay" onClick={handleCloseNovelDetail}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>📖 {selectedNovel.title}</h3>
                            <button className="admin-modal-close" onClick={handleCloseNovelDetail}>✕</button>
                        </div>

                        <div className="admin-modal-body">
                            {/* Thông tin cơ bản */}
                            <div className="novel-info">
                                <div className="info-row">
                                    <span className="label">Tác Giả:</span>
                                    <span>{selectedNovel.author}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Vẽ Bởi:</span>
                                    <span>{selectedNovel.authordraw || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Loại:</span>
                                    <span>{selectedNovel.type}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Mô Tả:</span>
                                    <span style={{maxHeight: '150px', overflow: 'auto'}}>{selectedNovel.description}</span>
                                </div>
                            </div>

                            {/* Danh sách chapters */}
                            <div className="chapters-section">
                                <h4>📑 Danh Sách Chương ({selectedNovelChapters.length})</h4>
                                {loadingChapters ? (
                                    <p>Đang tải chương...</p>
                                ) : selectedNovelChapters.length === 0 ? (
                                    <p style={{color: '#999'}}>Không có chương nào</p>
                                ) : (
                                    <div className="chapters-list">
                                        {selectedNovelChapters.map((chapter, idx) => (
                                            <div key={chapter.chapter_id} className="chapter-item">
                                                <div className="chapter-header">
                                                    <strong>Chương {chapter.chapter_number}: {chapter.title}</strong>
                                                </div>
                                                <div className="chapter-content">
                                                    {chapter.content ? (
                                                        chapter.content.substring(0, 300) + (chapter.content.length > 300 ? '...' : '')
                                                    ) : (
                                                        <span style={{color: '#999'}}>Chưa có nội dung</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="admin-modal-footer">
                            <button className="btn-reject" onClick={() => handleRejectNovel(selectedNovel.idln)}>
                                ❌ Từ Chối
                            </button>
                            <button className="btn-approve" onClick={handleApproveNovelFromModal}>
                                ✅ Duyệt Truyện
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;