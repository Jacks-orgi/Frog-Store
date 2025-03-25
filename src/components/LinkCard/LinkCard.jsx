import React from 'react';
import './LinkCard.css';

const LinkCard = ({ title, link, children }) => {
  return (
    <div className="link-card">
      {children}
      <a href={link}>{title} →</a>
    </div>
  );
};

export default LinkCard;