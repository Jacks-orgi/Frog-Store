import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const BasketContext = createContext();

export const useBasket = () => useContext(BasketContext);

export const BasketProvider = ({ children }) => {
  const [basketItems, setBasketItems] = useState([]);
  const { authToken, setAuthToken } = useUser();

  const fetchCartItems = async () => {
    if (authToken) {
      try {
        const res = await axios.post(
          'https://2-12.co.uk/~ddar/FrogStore/api/get_cart.php',
          { token: authToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (res.data.success) {
          setBasketItems(res.data.cart);
        } else {
          console.error('Failed to fetch cart items');
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    } else {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setBasketItems(storedCart);
    }
  };

  const syncLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(basketItems));
  };

  useEffect(() => {
    fetchCartItems();
  }, [authToken]);

  useEffect(() => {
    syncLocalStorage();
  }, [basketItems]);

  useEffect(() => {
    if (!authToken) {
      setBasketItems([]);
      localStorage.removeItem('cart');
    }
  }, [authToken]);

  const getTotalQuantity = () => {
    return basketItems.reduce((total, item) => total + item.quantity, 0);
  };

  const addItemToBasket = async (product, quantity) => {
    if (authToken) {
      try {
        const response = await axios.post(
          'https://2-12.co.uk/~ddar/FrogStore/api/insert_cart.php',
          { 
            token: authToken, 
            product_id: product.product_id, 
            quantity: quantity, 
            remove: false 
          },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.success) {
          fetchCartItems();
        } else {
          console.error("Failed to add item to cart:", response.data.message);
        }
      } catch (error) {
        console.error("Error adding item to basket:", error);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const itemIndex = localCart.findIndex(item => item.product_id === product.product_id);

      if (itemIndex !== -1) {
        localCart[itemIndex].quantity += quantity;
      } else {
        localCart.push({ ...product, quantity });
      }

      localStorage.setItem('cart', JSON.stringify(localCart));
      setBasketItems(localCart);
    }
  };

  const removeItemFromBasket = async (product, quantity) => {
    if (authToken) {
      try {
        const response = await axios.post(
          'https://2-12.co.uk/~ddar/FrogStore/api/insert_cart.php',
          { 
            token: authToken, 
            product_id: product.product_id, 
            quantity: quantity, 
            remove: true 
          },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.success) {
          fetchCartItems();
        } else {
          console.error("Failed to remove item from cart:", response.data.message);
        }
      } catch (error) {
        console.error("Error removing item from basket:", error);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const itemIndex = localCart.findIndex(item => item.product_id === product.product_id);

      if (itemIndex !== -1) {
        if (localCart[itemIndex].quantity > quantity) {
          localCart[itemIndex].quantity -= quantity;
        } else {
          localCart.splice(itemIndex, 1);
        }

        localStorage.setItem('cart', JSON.stringify(localCart));
        setBasketItems(localCart);
      }
    }
  };

  const clearBasket = async () => {
    if (authToken) {
      try {
        const response = await axios.post(
          'https://2-12.co.uk/~ddar/FrogStore/api/clear_cart.php',
          { token: authToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.success) {
          setBasketItems([]);
        } else {
          console.error("Failed to clear cart:", response.data.message);
        }
      } catch (error) {
        console.error("Error clearing basket:", error);
      }
    } else {
      setBasketItems([]);
      localStorage.removeItem('cart');
    }
  };

  return (
    <BasketContext.Provider value={{ basketItems, addItemToBasket, removeItemFromBasket, getTotalQuantity, clearBasket }}>
      {children}
    </BasketContext.Provider>
  );
};
