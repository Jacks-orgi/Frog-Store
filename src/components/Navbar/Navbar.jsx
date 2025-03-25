import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo"></div>
      <div className="nav-items">
        <button className="nav-button">Home</button>
        <button className="nav-button">Shop</button>
        <button className="nav-button">Contact</button>
      </div>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search..." />
      </div>
    </nav>
  );
};

export default Navbar;
