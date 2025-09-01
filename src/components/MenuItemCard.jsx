import React, { useState } from "react";

export default function MenuItemCard({ item, onAdd }) {
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    onAdd(item);
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(51, 65, 85, 0.6), rgba(30, 41, 59, 0.6))',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = 'rgba(71, 85, 105, 0.5)';
    }}>
      
      {/* Image Section */}
      <div style={{ 
        height: '180px', 
        overflow: 'hidden', 
        position: 'relative',
        background: '#374151'
      }}>
        {!imageError ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onError={handleImageError}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #374151, #4b5563)',
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            🍽️ No Image
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#f8fafc',
          margin: '0 0 8px 0',
          lineHeight: '1.3',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {item.name}
        </h3>
        
        <p style={{
          color: '#94a3b8',
          fontSize: '13px',
          margin: '0 0 16px 0',
          lineHeight: '1.4',
          height: '32px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {item.description}
        </p>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px'
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: '800',
            background: 'linear-gradient(to right, #10b981, #059669)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: '#10b981' // Fallback for non-webkit browsers
          }}>
            ₹{item.price}
          </span>
          
          <button
            onClick={handleAdd}
            disabled={isAdding}
            style={{
              background: isAdding 
                ? 'linear-gradient(to right, #6b7280, #4b5563)' 
                : 'linear-gradient(to right, #10b981, #059669)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: isAdding ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseOver={(e) => {
              if (!isAdding) {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '16px' }}>+</span>
            <span>{isAdding ? 'Adding...' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}