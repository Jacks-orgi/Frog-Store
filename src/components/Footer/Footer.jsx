import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Company name and the rights reserved bit</p>
    </footer>
  );
};

export default Footer;