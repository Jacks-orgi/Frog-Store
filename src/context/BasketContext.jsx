// BasketContext.js
import React, { createContext, useContext, useState } from 'react';

const BasketContext = createContext();

export const useBasket = () => {
  return useContext(BasketContext);
};

export const BasketProvider = ({ children }) => {
  const [basketItems, setBasketItems] = useState([]);

  const getTotalQuantity = () => {
    return basketItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  const addItemToBasket = (product) => {
    setBasketItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
  
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += product.quantity;
        return updatedItems;
      }
  
      return [...prevItems, { ...product }];
    });
  };
  
  const removeItemFromBasket = (productId) => {
    setBasketItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  return (
    <BasketContext.Provider value={{ basketItems, addItemToBasket, removeItemFromBasket, getTotalQuantity }}>
      {children}
    </BasketContext.Provider>
  );
};
