import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropdown } from '../../context/DropdownContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { openDropdown, setOpenDropdown } = useDropdown();

  const handleFilter = (filter) => {
    navigate(`/shop?filter=${filter}`);
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
      </div>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search..." />
      </div>
    </nav>
  );
};

export default Navbar;
