import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ReadingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        const res = await fetch('http://localhost:4000/api/history', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        const result = await res.json();

        if (result.success) {
          console.log('History data:', result.data);
          setHistory(result.data);
        } else {
          console.error("Lỗi server:", result.message);
        }
      } catch (err) {
        console.error("Lỗi kết nối:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  // Hàm xử lý URL ảnh
  const getCoverUrl = (cover) => {
    const defaultCover = 'http://localhost:4000/uploads/noname29.png';
    
    if (!cover) return defaultCover;
    
    // Nếu là full URL rồi thì dùng trực tiếp
    if (cover.startsWith('http')) return cover;
    
    // Nếu là relative path, thêm base URL
    if (cover.startsWith('/')) return `http://localhost:4000${cover}`;
    
    // Nếu chỉ là filename, gọi từ /uploads endpoint
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
      }}>📖 Lịch sử đọc truyện</h2>
      
      {loading ? (
        <p style={{ textAlign: 'center', color: '#9ca3af' }}>Đang tải...</p>
      ) : history.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#9ca3af' }}>Bạn chưa có lịch sử đọc truyện.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1.5rem',
          justifyItems: 'center'
        }}>
          {history.map(item => (
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
                {/* Ảnh bìa */}
                <div style={{
                  width: '100%',
                  height: '180px',
                  overflow: 'hidden',
                  backgroundColor: '#242b36'
                }}>
                  <img 
                    src={getCoverUrl(item.cover)} 
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = 'http://localhost:4000/uploads/noname29.png';
                    }}
                  />
                </div>

                {/* Tên truyện */}
                <div style={{
                  flex: 1,
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.2'
                  }}>
                    {item.title}
                  </p>
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '0.7rem',
                    color: '#94a3b8'
                  }}>
                    Đọc lần cuối: {new Date(item.last_read_at).toLocaleDateString('vi-VN')}
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

export default ReadingHistory;