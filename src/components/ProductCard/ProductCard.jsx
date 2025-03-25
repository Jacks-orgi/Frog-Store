import React from 'react';
import './ProductCard.css';

const ProductCard = ({ image, name, price, status }) => {
  return (
    <div className="product-card">
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