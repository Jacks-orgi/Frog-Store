import React from 'react';
import SquishyBall from '../SquishyBall/SquishyBall';

const SquishyCardContent = () => {
  return (
    <div className="squishy-card-content">
      <SquishyBall />
      <p>Squeeze me to relieve stress!</p>
    </div>
  );
};

export default SquishyCardContent;