import React, { useState, useEffect } from 'react';
import './AverageRating.css';

const AverageRating = ({ novelId, onRatingClick }) => {
  const [ratingData, setRatingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (novelId) {
      fetchAverageRating();
    }
  }, [novelId]);

  const fetchAverageRating = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/ratings/${novelId}/average`);
      const data = await response.json();
      if (data.success) {
        setRatingData(data.data);
      }
    } catch (err) {
      console.error('Error fetching average rating:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAverageRating();
  };

  if (loading) {
    return <div className="avg-rating-loading">Đang tải...</div>;
  }

  if (!ratingData) {
    return <div className="avg-rating-empty">Chưa có đánh giá</div>;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`avg-rating-star ${i <= Math.round(rating) ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="avg-rating-container">
      <div className="avg-rating-header">
        <h4>Đánh giá</h4>
      </div>
      
      <div className="avg-rating-display">
        <div className="avg-rating-score">
          <span className="score-number">{ratingData.avg_rating?.toFixed(1) || '0.0'}</span>
          <span className="score-label">/5</span>
        </div>
        
        <div className="avg-rating-stars">
          {renderStars(ratingData.avg_rating || 0)}
        </div>
        
        <div className="avg-rating-count">
          ({ratingData.total_ratings || 0} đánh giá)
        </div>
      </div>

      <button className="avg-rating-btn" onClick={onRatingClick}>
        Đánh giá ngay
      </button>
    </div>
  );
};

export default AverageRating;
