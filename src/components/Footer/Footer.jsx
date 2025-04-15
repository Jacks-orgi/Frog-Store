import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Froggy Co. - Handcrafting Joy for Little Hands</p>
    </footer>
  );
};

export default Footer;