import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ id, image_url, name, price, status }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="product-image">
        {image_url ? <img src={image_url} alt={name} /> : <span>No Image Available</span>}
      </div>
      <div className="product-details">
        <p className="product-name">{name || 'No Name'}</p>
        <p className="product-price">£{price || '0.00'}</p>
        <p className={`product-status ${status}`}>{status || 'No Status'}</p>
      </div>
    </div>
  );
};

export default ProductCard;