import React, { useEffect, useState } from 'react';
import './SquishyBall.css';

const SquishyBall = () => {
  const [isSquished, setIsSquished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSquished(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`squishy-ball ${isSquished ? 'squished' : ''}`}>
      <div className="ball-highlight"></div>
    </div>
  );
};

export default SquishyBall;