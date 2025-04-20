import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  

  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Froggy Co. - Handcrafting Joy for Little Hands</p>
      <p onClick={() => navigate('/contact')} className="contact-link">Contact Us</p>
      </footer>
  );
};

export default Footer;