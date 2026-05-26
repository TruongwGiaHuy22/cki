import React, { useState, useEffect } from 'react';
import './RatingModal.css';

const RatingModal = ({ isOpen, onClose, novelId, onRatingSubmitted }) => {
  const [rating, setRating] = useState(null);
  const [myRating, setMyRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hàm lấy token từ cả localStorage và sessionStorage
  const getToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return null;
    // Loại bỏ dấu ngoặc kép hoặc khoảng trắng thừa
    return token.replace(/^["']|["']$/g, '').trim();
  };

  useEffect(() => {
    if (isOpen && novelId) {
      const token = getToken();
      const logged = !!token && token.length > 0;
      setIsLoggedIn(logged);
      
      if (logged) {
        fetchMyRating(token);
      } else {
        setRating(null);
        setMyRating(null);
        setError(null);
      }
    }
  }, [isOpen, novelId]);

  const fetchMyRating = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/ratings/${novelId}/my`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.status === 401) {
        setIsLoggedIn(false);
        setError('Phiên đăng nhập đã hết hạn.');
        return;
      }

      const data = await response.json();
      if (data.success && data.data) {
        setMyRating(data.data);
        setRating(data.data.rating);
      }
    } catch (err) {
      console.error('Lỗi kết nối:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === null) return;
    const token = getToken();
    if (!token) {
      setError('Vui lòng đăng nhập để lưu đánh giá');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/ratings/${novelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        if (onRatingSubmitted) onRatingSubmitted();
        setTimeout(() => onClose(), 500);
      } else {
        setError(data.message || 'Lỗi khi lưu đánh giá');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rating-modal-overlay" onClick={onClose}>
      <div className="rating-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="rating-modal-close" onClick={onClose}>&times;</button>
        <h3>Đánh giá truyện</h3>
        {!isLoggedIn ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#FF6B6B' }}>Vui lòng đăng nhập để đánh giá</p>
            <button onClick={() => window.location.href = '/login'} className="btn-login">Đi tới đăng nhập</button>
          </div>
        ) : (
          <>
            <div className="rating-stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className={`rating-star ${rating >= star ? 'active' : ''}`} 
                  onClick={() => setRating(star)}>★</button>
              ))}
            </div>
            {error && <p className="rating-error">{error}</p>}
            <button className="btn-submit" onClick={handleSubmit} disabled={loading}>Lưu đánh giá</button>
          </>
        )}
      </div>
    </div>
  );
};

export default RatingModal;