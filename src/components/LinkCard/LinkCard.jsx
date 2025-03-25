import React from 'react';
import './LinkCard.css';

const LinkCard = ({ title, link }) => {
  return (
    <div className="link-card">
      <p>Hyperlink to the correct page / Image</p>
      <a href={link}>{title} →</a>
    </div>
  );
};

export default LinkCard;