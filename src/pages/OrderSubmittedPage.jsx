import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBasket } from '../context/BasketContext'
import './OrderSubmittedPage.css';

const OrderSubmittedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const purchasedItems = location.state?.items || [];
  const { clearBasket } = useBasket();
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  useEffect(() => {
    if (purchasedItems.length === 0) {
      navigate('/');
    } else if (!orderSubmitted) {
      clearBasket();
      sessionStorage.removeItem('cart');
      setOrderSubmitted(true);
    }
  }, [purchasedItems, navigate, clearBasket, orderSubmitted]);

  const estimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString();
  };

  return (
    <div className="order-submitted-container">
      <div className="order-card">
        <h2>Thank you for your order!</h2>
        <p>Your items will be delivered by <strong>{estimatedDelivery()}</strong>.</p>

        <div className="items-section">
          <h3>Items Purchased:</h3>
          <ul className="items-list">
            {purchasedItems.map((item, index) => (
              <li key={index} className="item">
                <span className="item-name">{item.name}</span>
                <span className="item-qty">x{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => navigate('/')} className="home-button">Return Home</button>
      </div>
    </div>
  );
};

export default OrderSubmittedPage;
