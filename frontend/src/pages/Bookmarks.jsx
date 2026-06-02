import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:4000/api/bookmarks', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        const result = await res.json();

        if (result.success) {
          setBookmarks(result.data);
        } else {
          console.error("Lỗi server:", result.message);
        }
      } catch (err) {
        console.error("Lỗi kết nối:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookmarks();
  }, [navigate]);

  const getCoverUrl = (cover) => {
    const defaultCover = 'http://localhost:4000/uploads/noname29.png';
    
    if (!cover) return defaultCover;
    if (cover.startsWith('http')) return cover;
    if (cover.startsWith('/')) return `http://localhost:4000${cover}`;
    return `http://localhost:4000/uploads/${cover}`;
  };

  return (
    <div style={{
      padding: '2rem 1rem',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#0f1115',
      minHeight: '100vh'
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        color: '#ffffff'
      }}>🔖 Truyện đã đánh dấu</h2>
      
      {loading ? (
        <p style={{ textAlign: 'center', color: '#9ca3af' }}>Đang tải...</p>
      ) : bookmarks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#9ca3af' }}>Bạn chưa đánh dấu truyện nào.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1.5rem',
          justifyItems: 'center'
        }}>
          {bookmarks.map(item => (
            <Link 
              key={item.idln} 
              to={`/novel/${item.idln}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                width: '150px',
                height: '230px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#1a1d23'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
              }}
              >
                <img
                  src={getCoverUrl(item.cover)}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => { e.target.src = 'http://localhost:4000/uploads/noname29.png'; }}
                />
                <div style={{
                  padding: '0.75rem',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#fbbf24',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    margin: 0,
                    marginTop: '0.25rem'
                  }}>
                    {item.author || 'Ẩn danh'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
