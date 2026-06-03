import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:4000/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ novels: 0, users: 0, comments: 0, pendingReports: 0 });
    const [novels, setNovels] = useState([]);
    const [allNovels, setAllNovels] = useState([]);
    const [allNovelsTotal, setAllNovelsTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [genres, setGenres] = useState([]);
    const [genresTotal, setGenresTotal] = useState(0);
    const [genresCurrentPage, setGenresCurrentPage] = useState(1);
    const [reports, setReports] = useState([]);
    const [bannedWords, setBannedWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newGenre, setNewGenre] = useState({ ten_tl: '', slug: '' });
    const [editingGenre, setEditingGenre] = useState(null);
    
    // Forum posts management
    const [forumPosts, setForumPosts] = useState([]);
    const [forumPostsTotal, setForumPostsTotal] = useState(0);
    const [forumPostsPage, setForumPostsPage] = useState(1);
    const [showForumPostDetail, setShowForumPostDetail] = useState(false);
    const [selectedForumPost, setSelectedForumPost] = useState(null);
    const [forumPostComments, setForumPostComments] = useState([]);
    const [loadingForumComments, setLoadingForumComments] = useState(false);
    
    // Published novels management
    const [publishedNovels, setPublishedNovels] = useState([]);
    const [publishedNovelsTotal, setPublishedNovelsTotal] = useState(0);
    const [publishedNovelsPage, setPublishedNovelsPage] = useState(1);
    
    // Chi tiết truyện để duyệt
    const [showNovelDetail, setShowNovelDetail] = useState(false);
    const [selectedNovel, setSelectedNovel] = useState(null);
    const [selectedNovelChapters, setSelectedNovelChapters] = useState([]);
    const [loadingChapters, setLoadingChapters] = useState(false);

    // Chi tiết báo cáo
    const [showReportDetail, setShowReportDetail] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

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
        const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
        const userData = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
        
        if (!token || !userData) {
            navigate('/maychu/admin');
            return;
        }

        try {
            const user = JSON.parse(userData);
            
            // Kiểm tra role có phải admin không
            if (user.role !== 'admin') {
                alert('❌ Bạn không có quyền truy cập!');
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                sessionStorage.removeItem('admin_token');
                sessionStorage.removeItem('admin_user');
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
        const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
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

    const loadAllNovels = async (page = 1) => {
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            const res = await fetch(`${API_BASE}/admin/novels?limit=${limit}&offset=${offset}`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setAllNovels(data.data || []);
                setAllNovelsTotal(data.total || 0);
                setCurrentPage(page);
            }
        } catch (err) {
            console.error('Error loading all novels:', err);
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

    const loadGenres = async (page = 1) => {
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            const res = await fetch(`${API_BASE}/admin/genres?limit=${limit}&offset=${offset}`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setGenres(data.data || []);
                setGenresTotal(data.total || 0);
                setGenresCurrentPage(page);
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

    const loadForumPosts = async (page = 1) => {
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            const res = await fetch(`${API_BASE}/admin/forum/posts?limit=${limit}&offset=${offset}`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setForumPosts(data.data || []);
                setForumPostsTotal(data.total || 0);
                setForumPostsPage(page);
            }
        } catch (err) {
            console.error('Error loading forum posts:', err);
        }
    };

    const loadPublishedNovels = async (page = 1) => {
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            const res = await fetch(`${API_BASE}/admin/publish?limit=${limit}&offset=${offset}`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setPublishedNovels(data.data || []);
                setPublishedNovelsTotal(data.total || 0);
                setPublishedNovelsPage(page);
            }
        } catch (err) {
            console.error('Error loading published novels:', err);
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

    const handleDeleteNovelFromManage = async (id, title) => {
        if (!window.confirm(`Xác nhận xóa truyện "${title}" này?`)) return;
        try {
            const res = await fetch(`${API_BASE}/admin/novels/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Truyện đã bị xóa!');
                // Reload từ page hiện tại, nếu không có dữ liệu thì về page trước
                const newTotal = allNovelsTotal - 1;
                const maxPage = Math.ceil(newTotal / 10);
                const pageToLoad = currentPage <= maxPage ? currentPage : Math.max(1, maxPage);
                loadAllNovels(pageToLoad);
            } else {
                alert('❌ Lỗi xóa truyện');
            }
        } catch (err) {
            alert('❌ Lỗi xóa truyện');
        }
    };

    // Xem chi tiết truyện + chapters
    const handleViewNovelDetail = async (novel) => {
        setShowNovelDetail(true);
        setLoadingChapters(true);
        try {
            // Load chi tiết truyện (để có đầy đủ genres, cover, etc.)
            const novelRes = await fetch(`${API_BASE}/novels/${novel.idln}`);
            if (novelRes.ok) {
                const novelData = await novelRes.json();
                setSelectedNovel(novelData.data || novel);
            } else {
                setSelectedNovel(novel);
            }
            
            // Load chapters
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
            console.error('Lỗi tải chi tiết truyện:', err);
            setSelectedNovel(novel);
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
            console.log(`🔄 Changing role - User ID: ${id}, Role: "${newRole}"`);
            
            const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ role: newRole })
            });
            
            const responseData = await res.json();
            console.log(`📥 Response status: ${res.status}`, responseData);
            
            if (res.ok) {
                alert(`✅ Đổi vai trò thành ${newRole}!`);
                loadUsers();
            } else {
                alert(`❌ Lỗi đổi vai trò: ${responseData.message || 'Không rõ'}`);
            }
        } catch (err) {
            console.error(`❌ Exception:`, err);
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

    const handleDeleteForumPost = async (postId, title) => {
        if (!window.confirm(`Xác nhận xóa bài viết "${title}" này?`)) return;
        try {
            const res = await fetch(`${API_BASE}/admin/forum/posts/${postId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Bài viết đã bị xóa!');
                const newTotal = forumPostsTotal - 1;
                const maxPage = Math.ceil(newTotal / 10);
                const pageToLoad = forumPostsPage <= maxPage ? forumPostsPage : Math.max(1, maxPage);
                loadForumPosts(pageToLoad);
            } else {
                alert('❌ Lỗi xóa bài viết');
            }
        } catch (err) {
            alert('❌ Lỗi xóa bài viết');
        }
    };

    const handleViewForumPostDetail = async (post) => {
        setSelectedForumPost(post);
        setShowForumPostDetail(true);
        setForumPostComments([]);
        setLoadingForumComments(true);
        try {
            const res = await fetch(`${API_BASE}/admin/forum/posts/${post.post_id}/comments`, {
                headers: getAuthHeaders()
            });
        if (res.ok) {
            const data = await res.json();
            setForumPostComments(data.data || []);
        } else {
            console.error('Error loading forum comments:', res.status, res.statusText);
            setForumPostComments([]);
        }
    } catch (err) {
        console.error('Error loading forum comments:', err);
        setForumPostComments([]);
    } finally {
        setLoadingForumComments(false);
    }
};

const renderForumComment = (comment, depth = 0) => (
    <div key={comment.comment_id} style={{
        background: '#0f172a',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '8px',
        borderLeft: '3px solid #3b82f6',
        marginLeft: depth * 16,
        position: 'relative'
    }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
        }}>
            <strong style={{color: '#60a5fa'}}>{comment.username || 'Ẩn danh'}</strong>
            <small style={{color: '#94a3b8'}}>
                {new Date(comment.created_at).toLocaleString('vi-VN')}
            </small>
        </div>
        <div style={{
            color: '#cbd5e1',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            lineHeight: '1.5'
        }}>
            {comment.content}
        </div>
        {comment.like_count > 0 && (
            <small style={{color: '#10b981', display: 'block', marginTop: '6px'}}>
                ❤️ {comment.like_count} like
            </small>
        )}
        {comment.replies?.length > 0 && (
            <div style={{marginTop: '10px'}}>
                {comment.replies.map(reply => renderForumComment(reply, depth + 1))}
            </div>
        )}
    </div>
);

    const handleCloseForumPostDetail = () => {
        setShowForumPostDetail(false);
        setSelectedForumPost(null);
    };

    const handleDeleteForumPostFromDetail = async (postId, title) => {
        handleCloseForumPostDetail();
        handleDeleteForumPost(postId, title);
    };

    const handleDeletePublishedNovel = async (publishId, title) => {
        if (!window.confirm(`Xác nhận xóa xuất bản "${title}" này?`)) return;
        try {
            const res = await fetch(`${API_BASE}/admin/publish/${publishId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                alert('✅ Xuất bản đã bị xóa!');
                const newTotal = publishedNovelsTotal - 1;
                const maxPage = Math.ceil(newTotal / 10);
                const pageToLoad = publishedNovelsPage <= maxPage ? publishedNovelsPage : Math.max(1, maxPage);
                loadPublishedNovels(pageToLoad);
            } else {
                alert('❌ Lỗi xóa xuất bản');
            }
        } catch (err) {
            alert('❌ Lỗi xóa xuất bản');
        }
    };

    const handleViewReport = async (id) => {
        try {
            console.log('Fetching report detail:', id);
            const res = await fetch(`${API_BASE}/admin/reports/${id}`, {
                headers: getAuthHeaders()
            });
            console.log('Response status:', res.status);
            
            if (res.ok) {
                const data = await res.json();
                console.log('Report data:', data);
                setSelectedReport(data.data);
                setShowReportDetail(true);
            } else {
                const errorData = await res.json();
                console.error('Error response:', errorData);
                alert(`❌ ${errorData.message || 'Lỗi tải chi tiết báo cáo'}`);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            alert('❌ Lỗi kết nối: ' + err.message);
        }
    };

    const handleCloseReportDetail = () => {
        setShowReportDetail(false);
        setSelectedReport(null);
    };

    const handleLogout = () => {
        // Clear admin tokens first (before navigation)
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_user');
        
        // Also clear any leftover user tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        
        // Clear state
        setUser(null);
        
        // Navigate after clearing
        navigate('/maychu/admin');
    };

    if (loading) {
        return <div className="admin-loading">Đang tải...</div>;
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setShowNovelDetail(false); // Đóng modal khi chuyển tab
        switch(tab) {
            case 'novels':
                loadPendingNovels();
                break;
            case 'manage-novels':
                setCurrentPage(1);
                loadAllNovels(1);
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
            case 'banned-words':
                loadBannedWords();
                break;
            case 'forum-management':
                setForumPostsPage(1);
                loadForumPosts(1);
                break;
            case 'publish-management':
                setPublishedNovelsPage(1);
                loadPublishedNovels(1);
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
                        className={`admin-nav-item ${activeTab === 'manage-novels' ? 'active' : ''}`}
                        onClick={() => handleTabChange('manage-novels')}
                    >
                        📖 Quản Lý Truyện
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
                        📋 Báo Lỗi & Góp Ý
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'banned-words' ? 'active' : ''}`}
                        onClick={() => handleTabChange('banned-words')}
                    >
                        🚫 Từ Cấm
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'forum-management' ? 'active' : ''}`}
                        onClick={() => handleTabChange('forum-management')}
                    >
                        💬 Quản Lý Thảo Luận
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'publish-management' ? 'active' : ''}`}
                        onClick={() => handleTabChange('publish-management')}
                    >
                        📖 Quản Lý Xuất Bản
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

                    {/* QUẢN LÝ TRUYỆN */}
                    {activeTab === 'manage-novels' && (
                        <div className="admin-section">
                            <h2>📖 Quản Lý Truyện</h2>
                            {allNovels.length === 0 ? (
                                <p>Không có truyện</p>
                            ) : (
                                <div>
                                    <p className="admin-total">Tổng cộng: {allNovelsTotal} truyện</p>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tên Truyện</th>
                                                <th>Tác Giả</th>
                                                <th>Loại</th>
                                                <th>Trạng Thái</th>
                                                <th>Chương</th>
                                                <th>Lượt Xem</th>
                                                <th>Duyệt</th>
                                                <th>Hành Động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allNovels.map(novel => (
                                                <tr key={novel.idln}>
                                                    <td>#{novel.idln}</td>
                                                    <td><strong>{novel.title}</strong></td>
                                                    <td>{novel.author}</td>
                                                    <td>{novel.type || 'Truyện dịch'}</td>
                                                    <td>{novel.statuss || 'Đang tiến hành'}</td>
                                                    <td>{novel.total_chapters || 0}</td>
                                                    <td>{novel.view_count || 0}</td>
                                                    <td>{novel.active ? '✅ Đã duyệt' : '❌ Chưa duyệt'}</td>
                                                    <td>
                                                        <button 
                                                            className="btn-delete" 
                                                            onClick={() => handleDeleteNovelFromManage(novel.idln, novel.title)}
                                                        >
                                                            🗑️ Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {/* PAGINATION */}
                                    {allNovelsTotal > 10 && (
                                        <div className="pagination">
                                            <button 
                                                className="pagination-btn"
                                                onClick={() => loadAllNovels(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                ← Trước
                                            </button>
                                            
                                            {Array.from({ length: Math.ceil(allNovelsTotal / 10) }, (_, i) => i + 1).map(page => (
                                                <button 
                                                    key={page}
                                                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                                    onClick={() => loadAllNovels(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            
                                            <button 
                                                className="pagination-btn"
                                                onClick={() => loadAllNovels(currentPage + 1)}
                                                disabled={currentPage === Math.ceil(allNovelsTotal / 10)}
                                            >
                                                Sau →
                                            </button>
                                            
                                            <span className="pagination-info">
                                                Trang {currentPage} / {Math.ceil(allNovelsTotal / 10)}
                                            </span>
                                        </div>
                                    )}
                                </div>
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
                                                        <option value="author">Author</option>
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
                            
                            {/* PAGINATION */}
                            {genresTotal > 10 && (
                                <div className="pagination">
                                    <button 
                                        className="pagination-btn"
                                        onClick={() => loadGenres(genresCurrentPage - 1)}
                                        disabled={genresCurrentPage === 1}
                                    >
                                        ← Trước
                                    </button>
                                    
                                    {Array.from({ length: Math.ceil(genresTotal / 10) }, (_, i) => i + 1).map(page => (
                                        <button 
                                            key={page}
                                            className={`pagination-btn ${genresCurrentPage === page ? 'active' : ''}`}
                                            onClick={() => loadGenres(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        className="pagination-btn"
                                        onClick={() => loadGenres(genresCurrentPage + 1)}
                                        disabled={genresCurrentPage >= Math.ceil(genresTotal / 10)}
                                    >
                                        Sau →
                                    </button>
                                    
                                    <span className="pagination-info">
                                        Trang {genresCurrentPage} / {Math.ceil(genresTotal / 10)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* BÁO CÁO VI PHẠM */}
                    {activeTab === 'reports' && (
                        <div className="admin-section">
                            <h2>📋 Báo Lỗi / Góp Ý từ Người Dùng</h2>
                            <div style={{marginBottom: '20px'}}>
                                <span style={{color: '#10b981', marginRight: '20px'}}>
                                    🟢 Đang chờ: <strong>{reports.filter(r => r.statuss === 'Đang chờ').length}</strong>
                                </span>
                                <span style={{color: '#f59e0b', marginRight: '20px'}}>
                                    🟡 Đã xử lý: <strong>{reports.filter(r => r.statuss === 'Đã xử lý').length}</strong>
                                </span>
                                <span style={{color: '#ef4444'}}>
                                    🔴 Từ chối: <strong>{reports.filter(r => r.statuss === 'Từ chối').length}</strong>
                                </span>
                            </div>
                            {reports.length === 0 ? (
                                <p style={{color: '#999'}}>✅ Không có báo lỗi nào cần xử lý</p>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Người Báo</th>
                                            <th>Loại</th>
                                            <th>Nội Dung</th>
                                            <th>Trạng Thái</th>
                                            <th>Ngày Tạo</th>
                                            <th>Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map(report => (
                                            <tr 
                                                key={report.report_id}
                                                onClick={() => handleViewReport(report.report_id)}
                                                style={{cursor: 'pointer', transition: 'background 0.2s'}}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#2a2d36'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = ''}
                                            >
                                                <td>{report.user_name || 'Ẩn danh'}</td>
                                                <td>📝 Báo cáo</td>
                                                <td style={{maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                    {report.reason}
                                                </td>
                                                <td>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.9rem',
                                                        backgroundColor: report.statuss === 'Đang chờ' ? '#10b98122' : 
                                                                        report.statuss === 'Đã xử lý' ? '#f59e0b22' : '#ef444422',
                                                        color: report.statuss === 'Đang chờ' ? '#10b981' : 
                                                               report.statuss === 'Đã xử lý' ? '#f59e0b' : '#ef4444'
                                                    }}>
                                                        {report.statuss}
                                                    </span>
                                                </td>
                                                <td>{new Date(report.created_at).toLocaleDateString('vi-VN')}</td>
                                                <td style={{display: 'flex', gap: '8px'}}>
                                                    {report.statuss === 'Đang chờ' && (
                                                        <>
                                                            <button 
                                                                className="btn-approve" 
                                                                onClick={() => handleResolveReport(report.report_id, 'Đã xử lý')}
                                                                style={{padding: '6px 12px', fontSize: '0.9rem'}}
                                                            >
                                                                ✅ Xử Lý
                                                            </button>
                                                            <button 
                                                                className="btn-reject" 
                                                                onClick={() => handleResolveReport(report.report_id, 'Từ chối')}
                                                                style={{padding: '6px 12px', fontSize: '0.9rem'}}
                                                            >
                                                                ❌ Từ Chối
                                                            </button>
                                                        </>
                                                    )}
                                                    {report.statuss !== 'Đang chờ' && (
                                                        <span style={{color: '#999', fontSize: '0.9rem'}}>
                                                            {report.statuss === 'Đã xử lý' ? '✔️ Đã xử lý' : '✖️ Bị từ chối'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

                    {/* QUẢN LÝ THẢO LUẬN */}
                    {activeTab === 'forum-management' && (
                        <div className="admin-section">
                            <h2>💬 Quản Lý Thảo Luận</h2>
                            {forumPosts.length === 0 ? (
                                <p>Không có bài viết thảo luận</p>
                            ) : (
                                <div>
                                    <p className="admin-total">Tổng cộng: {forumPostsTotal} bài viết</p>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tiêu Đề</th>
                                                <th>Người Đăng</th>
                                                <th>Danh Mục</th>
                                                <th>Bình Luận</th>
                                                <th>Lượt Xem</th>
                                                <th>Ngày Tạo</th>
                                                <th>Hành Động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {forumPosts.map(post => (
                                                <tr key={post.post_id}>
                                                    <td>#{post.post_id}</td>
                                                    <td><strong>{post.title.substring(0, 50)}{post.title.length > 50 ? '...' : ''}</strong></td>
                                                    <td>{post.username || 'Ẩn danh'}</td>
                                                    <td>{post.category || 'Thảo luận'}</td>
                                                    <td>{post.comment_count || 0}</td>
                                                    <td>{post.view_count || 0}</td>
                                                    <td>{new Date(post.created_at).toLocaleDateString('vi-VN')}</td>
                                                    <td>
                                                        <button 
                                                            className="btn-approve" 
                                                            onClick={() => handleViewForumPostDetail(post)}
                                                        >
                                                            👁️ Xem
                                                        </button>
                                                        <button 
                                                            className="btn-delete" 
                                                            onClick={() => handleDeleteForumPost(post.post_id, post.title)}
                                                            style={{marginLeft: '8px'}}
                                                        >
                                                            🗑️ Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {/* PAGINATION */}
                                    {forumPostsTotal > 10 && (
                                        <div className="pagination">
                                            <button 
                                                className="pagination-btn"
                                                onClick={() => loadForumPosts(forumPostsPage - 1)}
                                                disabled={forumPostsPage === 1}
                                            >
                                                ← Trước
                                            </button>
                                            
                                            {Array.from({ length: Math.ceil(forumPostsTotal / 10) }, (_, i) => i + 1).map(page => (
                                                <button 
                                                    key={page}
                                                    className={`pagination-btn ${forumPostsPage === page ? 'active' : ''}`}
                                                    onClick={() => loadForumPosts(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            
                                            <button 
                                                className="pagination-btn"
                                                onClick={() => loadForumPosts(forumPostsPage + 1)}
                                                disabled={forumPostsPage === Math.ceil(forumPostsTotal / 10)}
                                            >
                                                Sau →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* QUẢN LÝ XUẤT BẢN */}
                    {activeTab === 'publish-management' && (
                        <div className="admin-section">
                            <h2>📖 Quản Lý Xuất Bản</h2>
                            {publishedNovels.length === 0 ? (
                                <p>Không có nội dung xuất bản</p>
                            ) : (
                                <div>
                                    <p className="admin-total">Tổng cộng: {publishedNovelsTotal} xuất bản</p>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tên Truyện</th>
                                                <th>Tập</th>
                                                <th>Tiêu Đề Xuất Bản</th>
                                                <th>Nhà Xuất Bản</th>
                                                <th>Giá</th>
                                                <th>Cửa Hàng</th>
                                                <th>Ngày Tạo</th>
                                                <th>Hành Động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {publishedNovels.map(pub => (
                                                <tr key={pub.publish_id}>
                                                    <td>#{pub.publish_id}</td>
                                                    <td><strong>{pub.novel_title || 'N/A'}</strong></td>
                                                    <td>{pub.volume_number || 1}</td>
                                                    <td>{pub.title ? pub.title.substring(0, 30) : 'N/A'}{pub.title && pub.title.length > 30 ? '...' : ''}</td>
                                                    <td>{pub.publisher_name || 'N/A'}</td>
                                                    <td>{pub.price ? `${pub.price.toLocaleString('vi-VN')}đ` : 'Miễn phí'}</td>
                                                    <td>{pub.store_name || 'N/A'}</td>
                                                    <td>{new Date(pub.created_at).toLocaleDateString('vi-VN')}</td>
                                                    <td>
                                                        <button 
                                                            className="btn-delete" 
                                                            onClick={() => handleDeletePublishedNovel(pub.publish_id, pub.title || 'Xuất bản')}
                                                        >
                                                            🗑️ Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {/* PAGINATION */}
                                    {publishedNovelsTotal > 10 && (
                                        <div className="pagination">
                                            <button 
                                                className="pagination-btn"
                                                onClick={() => loadPublishedNovels(publishedNovelsPage - 1)}
                                                disabled={publishedNovelsPage === 1}
                                            >
                                                ← Trước
                                            </button>
                                            
                                            {Array.from({ length: Math.ceil(publishedNovelsTotal / 10) }, (_, i) => i + 1).map(page => (
                                                <button 
                                                    key={page}
                                                    className={`pagination-btn ${publishedNovelsPage === page ? 'active' : ''}`}
                                                    onClick={() => loadPublishedNovels(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            
                                            <button 
                                                className="pagination-btn"
                                                onClick={() => loadPublishedNovels(publishedNovelsPage + 1)}
                                                disabled={publishedNovelsPage === Math.ceil(publishedNovelsTotal / 10)}
                                            >
                                                Sau →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL CHI TIẾT BÀI VIẾT THẢO LUẬN */}
            {showForumPostDetail && selectedForumPost && (
                <div className="admin-modal-overlay" onClick={handleCloseForumPostDetail}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto'}}>
                        <div className="admin-modal-header">
                            <h3>💬 {selectedForumPost.title}</h3>
                            <button className="admin-modal-close" onClick={handleCloseForumPostDetail}>✕</button>
                        </div>

                        <div className="admin-modal-body">
                            <div className="info-row">
                                <span className="label">Người Đăng:</span>
                                <span>{selectedForumPost.username || 'Ẩn danh'}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Danh Mục:</span>
                                <span>{selectedForumPost.category || 'Thảo luận'}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Lượt Xem:</span>
                                <span>{selectedForumPost.view_count || 0}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Bình Luận:</span>
                                <span>{selectedForumPost.comment_count || 0}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Ngày Tạo:</span>
                                <span>{new Date(selectedForumPost.created_at).toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Nội Dung:</span>
                                <div style={{
                                    background: '#181a20',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    marginTop: '8px',
                                    color: '#cbd5e1',
                                    maxHeight: '300px',
                                    overflow: 'auto',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    lineHeight: '1.6'
                                }}>
                                    {selectedForumPost.content}
                                </div>
                            </div>

                            {/* BÌNH LUẬN */}
                            <div className="info-row" style={{marginTop: '20px'}}>
                                <span className="label">💬 Bình Luận ({forumPostComments.length}):</span>
                                {loadingForumComments ? (
                                    <p style={{marginTop: '10px'}}>Đang tải...</p>
                                ) : forumPostComments.length === 0 ? (
                                    <p style={{marginTop: '10px', color: '#999'}}>Chưa có bình luận</p>
                                ) : (
                                    <div style={{marginTop: '12px', width: '100%'}}>
                                        {forumPostComments.map(comment => renderForumComment(comment))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="admin-modal-footer">
                            <button 
                                className="btn-delete" 
                                onClick={() => handleDeleteForumPostFromDetail(selectedForumPost.post_id, selectedForumPost.title)}
                            >
                                🗑️ Xóa Bài Viết
                            </button>
                            <button 
                                className="btn-approve" 
                                onClick={handleCloseForumPostDetail}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CHI TIẾT TRUYỆN */}
            {showNovelDetail && selectedNovel && (
                <div className="admin-modal-overlay" onClick={handleCloseNovelDetail}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>📖 {selectedNovel.title}</h3>
                            <button className="admin-modal-close" onClick={handleCloseNovelDetail}>✕</button>
                        </div>

                        <div className="admin-modal-body">
                            {/* Ảnh bìa */}
                            {selectedNovel.cover && (
                                <div className="info-row" style={{marginBottom: '1.5rem'}}>
                                    <span className="label">Ảnh Bìa:</span>
                                    <div style={{marginTop: '0.5rem'}}>
                                        <img 
                                            src={`http://localhost:4000/uploads/${selectedNovel.cover}`} 
                                            alt="Cover" 
                                            style={{maxWidth: '200px', maxHeight: '300px', borderRadius: '8px', border: '1px solid #ddd'}}
                                            onError={(e) => {e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover'; e.target.style.maxWidth = '200px';}}
                                        />
                                    </div>
                                </div>
                            )}

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
                                    <span className="label">Loại Truyện:</span>
                                    <span>{selectedNovel.type || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Thể Loại:</span>
                                    <span>
                                        {selectedNovel.novel_genres && selectedNovel.novel_genres.length > 0 
                                            ? selectedNovel.novel_genres.map(g => g.ten_tl).join(', ') 
                                            : selectedNovel.genres && selectedNovel.genres.length > 0
                                            ? selectedNovel.genres.join(', ')
                                            : 'Chưa có thể loại'}
                                    </span>
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

            {/* MODAL CHI TIẾT BÁO CÁO */}
            {showReportDetail && selectedReport && (
                <div className="admin-modal-overlay" onClick={handleCloseReportDetail}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px'}}>
                        <div className="admin-modal-header">
                            <h3>📋 Chi Tiết Báo Cáo #{selectedReport.report_id}</h3>
                            <button className="admin-modal-close" onClick={handleCloseReportDetail}>✕</button>
                        </div>

                        <div className="admin-modal-body">
                            <div className="info-row">
                                <span className="label">Người Báo Cáo:</span>
                                <span>{selectedReport.user_name || 'Ẩn danh'}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Ngày Tạo:</span>
                                <span>{new Date(selectedReport.created_at).toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Trạng Thái:</span>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '4px',
                                    backgroundColor: selectedReport.statuss === 'Đang chờ' ? '#10b98122' : 
                                                    selectedReport.statuss === 'Đã xử lý' ? '#f59e0b22' : '#ef444422',
                                    color: selectedReport.statuss === 'Đang chờ' ? '#10b981' : 
                                           selectedReport.statuss === 'Đã xử lý' ? '#f59e0b' : '#ef4444',
                                    fontWeight: '600'
                                }}>
                                    {selectedReport.statuss}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">Nội Dung:</span>
                                <div style={{
                                    background: '#181a20',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    marginTop: '8px',
                                    color: '#cbd5e1',
                                    maxHeight: '250px',
                                    overflow: 'auto',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    lineHeight: '1.6'
                                }}>
                                    {selectedReport.reason}
                                </div>
                            </div>
                        </div>

                        <div className="admin-modal-footer">
                            {selectedReport.statuss === 'Đang chờ' && (
                                <>
                                    <button 
                                        className="btn-reject" 
                                        onClick={() => {
                                            handleResolveReport(selectedReport.report_id, 'Từ chối');
                                            handleCloseReportDetail();
                                        }}
                                    >
                                        ❌ Từ Chối
                                    </button>
                                    <button 
                                        className="btn-approve" 
                                        onClick={() => {
                                            handleResolveReport(selectedReport.report_id, 'Đã xử lý');
                                            handleCloseReportDetail();
                                        }}
                                    >
                                        ✅ Đánh Dấu Đã Xử Lý
                                    </button>
                                </>
                            )}
                            {selectedReport.statuss !== 'Đang chờ' && (
                                <button 
                                    className="btn-approve" 
                                    onClick={handleCloseReportDetail}
                                >
                                    Đóng
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;