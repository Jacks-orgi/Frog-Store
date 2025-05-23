import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';
import './BasketPage.css';
import LoginPage from './LoginPage';

const BasketPage = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken') || '');
  const { addItemToBasket, removeItemFromBasket } = useBasket();
  const navigate = useNavigate();
  const shippingPrice = 2.99;

  const getCartInfo = async () => {
    setAuthToken(sessionStorage.getItem('authToken'));

    if (!authToken) {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(storedCart);
      return;
    }

    try {
      const res = await axios.post('https://2-12.co.uk/~ddar/FrogStore/api/get_cart.php', {
        "token": authToken
      }, { headers: { 'Content-Type': 'application/json' } });

      const data = res.data;
      if (data.success) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  };
  
  const handleRemoveItem = (index) => {
    const product = [...cart][index];
    const updatedCart = cart.filter((item, i) => i !== index);
    setCart(updatedCart);

    removeItemFromBasket(product, product.quantity);
  };

  const handleQuantityChange = (index, change) => {
    const updatedCart = [...cart];

    if (change === 1) {
      addItemToBasket(updatedCart[index], 1);
    } else if (change === -1) {
      removeItemFromBasket(updatedCart[index], 1);
    }

    updatedCart[index].quantity = Math.max(updatedCart[index].quantity + Number(change), 0);
  
    if (updatedCart[index].quantity === 0) {
      updatedCart.splice(index, 1);
    }
  
    setCart(updatedCart);
  };

  useEffect(() => {
    getCartInfo();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };
  
  return (
    <div className="basket-page">
      <div className="basket-content">
        {!authToken && (
          <div className="login-section">
            <LoginPage />
          </div>
        )}

        <div className="cart-content">
          <h1>Your Cart</h1>

          {error && <p>{error}</p>}

          {cart.length > 0 ? (
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-card">
                  <img src={item.image_url} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h2>{item.name}</h2>
                    <p>Price: £{item.price}</p>

                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                    </div>

                    <button className="remove-btn" onClick={() => handleRemoveItem(index)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}

          {cart.length > 0 && (
            <div>
              <div className="total-section">
                <h3>Items: £{calculateTotal()}</h3>
                <h3>Shipping: £{shippingPrice}</h3>
                <h3>Order Total: £{ (Number(calculateTotal()) + (shippingPrice)).toFixed(2) }</h3>
              </div>
              <button className="checkout-button" onClick={() => navigate("/checkout", { state: { items: cart, total: (Number(calculateTotal()) + (shippingPrice)).toFixed(2)} })}>Checkout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasketPage;
