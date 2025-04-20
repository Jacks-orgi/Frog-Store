import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropdown } from '../../context/DropdownContext';
import { useBasket  } from '../../context/BasketContext';
import './Navbar.css';
import { FaShoppingBasket } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const { openDropdown, setOpenDropdown } = useDropdown();
  const { basketItems  } = useBasket();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    setIsLoggedIn(!!authToken);
  }, [sessionStorage.getItem('authToken')]);

  const totalQuantity = useMemo(() => {
    return basketItems.reduce((total, item) => total + item.quantity, 0);
  }, [basketItems]);

  const handleFilter = (filter) => {
    navigate(`/shop?filter=${filter}`);
  };

  const BasketIcon = ({ itemCount }) => {
    return (
      <div className="basket-wrapper" onClick={() => navigate('/basket')}>
        <FaShoppingBasket size={28} />
        {itemCount > 0 && <span className="basket-count">{itemCount}</span>}
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')}></div>

      <div className="nav-items">
        <button className="nav-button" onClick={() => navigate('/')}>Home</button>
        <div className="nav-item-with-dropdown">
          <button className="nav-button" onClick={() => navigate('/shop?filter=all')}>Shop</button>
          <div className="dropdown-menu">
            <button onClick={() => handleFilter('all')}>All Products</button>
            <button onClick={() => handleFilter('plushies')}>Plushies</button>
            <button onClick={() => handleFilter('stress-helpers')}>Stress Helpers</button>
          </div>
        </div>
        <button className="nav-button" onClick={() => navigate('/contact')}>Contact</button>

        {isLoggedIn ? (
          <button className="nav-button" onClick={() => navigate('/account')}>Account</button>
        ) : (
          <button className="nav-button" onClick={() => navigate('/login')}>Login</button>
        )}      
        
        </div>

      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search..." />
      </div>

      <div className="nav-items">
        <BasketIcon itemCount={totalQuantity} />
      </div>
    </nav>
  );
};

export default Navbar;
