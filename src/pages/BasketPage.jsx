import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './BasketPage.css';
import axios from 'axios';

const BasketPage = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  const getCartInfo = async () => {
    const authToken = sessionStorage.getItem('authToken');
    
    console.log(authToken);
    if (!authToken) {
      setError('You need to log in first.');
      return;
    }
  
    try {
      const res = await axios.post('https://2-12.co.uk/~ddar/FrogStore/api/get_cart.php',
        { "token" : authToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = res.data;

      if (data.success) {
        const cartData = data.cart;
        setCart(cartData);
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  };

  useEffect(() => {
    getCartInfo();
  }, []);

  return (
    <div>
      <h1>Your Cart</h1>

      {error && <p className="error">{error}</p>}

      <ul>
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <li key={index}>
              <p>{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </li>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </ul>
    </div>
  );
};

export default BasketPage;
