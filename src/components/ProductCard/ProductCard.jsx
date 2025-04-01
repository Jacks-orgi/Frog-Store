import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ id, image, name, price, status }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="product-image">{image ? <img src={image} alt={name} /> : 'Image'}</div>
      <div className="product-details">
        <p className="product-name">{name}</p>
        <p className="product-price">£{price}</p>
        <p className={`product-status ${status.toLowerCase()}`}>{status}</p>
      </div>
    </div>
  );
};

export default ProductCard;