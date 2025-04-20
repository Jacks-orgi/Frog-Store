import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const BasketContext = createContext();

export const useBasket = () => useContext(BasketContext);

export const BasketProvider = ({ children }) => {
  const [basketItems, setBasketItems] = useState([]);
  const { authToken } = useUser(); // Get token reactively from UserContext

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!authToken) {
        setBasketItems([]); // Clear cart when user logs out
        return;
      }

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
    };

    fetchCartItems();
  }, [authToken]);

  const getTotalQuantity = () => {
    return basketItems.reduce((total, item) => total + item.quantity, 0);
  };

  const addItemToBasket = async (product) => {
    if (!authToken) return;

    setBasketItems(prevItems => {
      const index = prevItems.findIndex(item => item.id === product.id);
      if (index !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[index].quantity += product.quantity;
        return updatedItems;
      }
      return [...prevItems, { ...product }];
    });

    try {
      await axios.post(
        'https://2-12.co.uk/~ddar/FrogStore/api/insert_cart.php',
        { token: authToken, product_id: product.id, quantity: product.quantity },
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Error adding item to basket:", error);
    }
  };

  const removeItemFromBasket = (productId) => {
    setBasketItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  return (
    <BasketContext.Provider value={{ basketItems, addItemToBasket, removeItemFromBasket, getTotalQuantity }}>
      {children}
    </BasketContext.Provider>
  );
};
