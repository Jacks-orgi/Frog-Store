import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LinkCard.css';

const LinkCard = ({ title, link, filter = 'all', children }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/shop?filter=${filter}`);
  };

  return (
    <div className="link-card" onClick={handleClick} role="button" tabIndex={0}>
      {children}
      <span className="link-text">{title} →</span>
    </div>
  );
};

export default LinkCard;